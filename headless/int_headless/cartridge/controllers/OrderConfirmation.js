'use strict';
var server = require('server');

var HashMap = require('dw/util/HashMap');
var HookMgr = require('dw/system/HookMgr');
var Locale = require('dw/util/Locale');
var Logger = require('dw/system/Logger');
var OrderMgr = require('dw/order/OrderMgr');
var Site = require('dw/system/Site');
var Transaction = require('dw/system/Transaction');

server.get('Confirmation', function(req, res, next) {
    res.setHttpHeader('Access-Control-Allow-Origin', '*');
    var OrderModel = require('*/cartridge/models/order');
    var context = new HashMap();
    var order = OrderMgr.getOrder(req.querystring.orderNo);
    var orderConfirmation = {
        success: false
    };

    if (!empty(order)) {
        try {
            var orderStatus;
            Transaction.wrap(function () {
                orderStatus  = OrderMgr.placeOrder(order);
            })
            if (orderStatus.message == 'OK') {
                var isMarketingCloudEnabled = !empty(Site.current.preferences.custom.isMarketingCloudEnabled) ? Site.current.preferences.custom.isMarketingCloudEnabled : false;
                var mcFromEmail = !empty(Site.current.preferences.custom.mcFromEmail) ? Site.current.preferences.custom.mcFromEmail : 'no-reply@innovadeltech.com';

                if(isMarketingCloudEnabled) {
                    var currentSite = Site.getCurrent();
                    var currentLocale = Locale.getLocale(currentSite.getDefaultLocale());
                    var orderObject = { order: order };
                    Object.keys(orderObject).forEach(function (key) {
                        context.put(key, orderObject[key]);
                    })
                
                    // Set Order for hook compat
                    context.put('Order', order);
                    // Set extra param, CurrentLocale
                    context.put('CurrentLocale', currentLocale);
    
                    var hookID = 'app.mail.sendMail';
                    if (HookMgr.hasHook(hookID)) {
                            var status = HookMgr.callHook(
                            hookID,
                            'sendMail',
                            {
                                communicationHookID: 'order.confirmation',
                                fromEmail: mcFromEmail,
                                toEmail: orderObject.order.customerEmail,
                                SubscriberKey: orderObject.order.customerEmail,
                                email: orderObject.order.customerEmail,
                                orderNo: orderObject.order.orderNo,
                                SiteID: currentSite.ID,
                                params: context,
                                customer: orderObject.order.customer
                            }
                        );
                        if (status.message == 'OK') {
                            orderConfirmation.success = true;
                        }
                    } else {
                        Logger.error('No hook registered for {0}', hookID);
                    }
                } else {
                    var emailHelper = require("*/cartridge/scripts/helper/emailHelper.js");
                    orderConfirmation = emailHelper.sendConfirmationEmail(order, orderConfirmation);
                }
            }

        } catch (e) {
            Logger.error('(OrderConfirmation-Confirmation) -> Error occured while calling custom end point OrderConfirmation in file :{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
            return orderConfirmation;
        }
    }
    res.json({
        orderConfirmation: orderConfirmation
    })
    next();
});

module.exports = server.exports();
