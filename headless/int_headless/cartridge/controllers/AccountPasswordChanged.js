'use strict';
var server = require('server');

var HashMap = require('dw/util/HashMap');
var HookMgr = require('dw/system/HookMgr');
var Locale = require('dw/util/Locale');
var Logger = require('dw/system/Logger');
var OrderMgr = require('dw/order/OrderMgr');
var Site = require('dw/system/Site');
var Transaction = require('dw/system/Transaction');

server.get('PasswordChanged', function(req, res, next) {
    res.setHttpHeader('Access-Control-Allow-Origin', '*');

    var OrderModel = require('*/cartridge/models/order');
    var context = new HashMap();

    var firstName = !empty(req.querystring.firstName) ? req.querystring.firstName : '';
    var lastName = !empty(req.querystring.lastName) ? req.querystring.lastName : '';
    var email = !empty(req.querystring.email) ? req.querystring.email : '';
    var isMarketingCloudEnabled = !empty(Site.current.preferences.custom.isMarketingCloudEnabled) ? Site.current.preferences.custom.isMarketingCloudEnabled : false;
    var mcFromEmail = !empty(Site.current.preferences.custom.mcFromEmail) ? Site.current.preferences.custom.mcFromEmail : 'no-reply@innovadeltech.com';
    var accountPasswordChanged = {
        success: false
    };
    try {
        if(isMarketingCloudEnabled) {
            var currentSite = Site.getCurrent();
            
            var objectForEmail = {
                firstName: firstName,
                lastName: lastName,
                customerEmail: email,
                resettingCustomer: customer
            };

            Object.keys(objectForEmail).forEach(function (key) {
                context.put(key, objectForEmail[key]);
            });

            var hookID = 'app.mail.sendMail';
            if (HookMgr.hasHook(hookID)) {
                    var status = HookMgr.callHook(
                    hookID,
                    'sendMail',
                    {
                        communicationHookID: 'account.passwordChanged',
                        fromEmail: mcFromEmail,
                        toEmail: objectForEmail.customerEmail,
                        SubscriberKey: objectForEmail.customerEmail,
                        email: objectForEmail.customerEmail,
                        firstName: objectForEmail.firstName,
                        lastName: objectForEmail.lastName,
                        SiteID: currentSite.ID,
                        params: context,
                        customer: customer
                    }
                );
                if (status.message == 'OK') {
                    accountPasswordChanged.success = true;
                }
            } else {
                Logger.error('No hook registered for {0}', hookID);
            }
        }
    } catch (e) {
        Logger.error('(AccountPasswordUpdated-PasswordChanged) -> Error occured while calling custom end point OrderConfirmation in file :{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
        return accountPasswordChanged;
    }
    res.json({
        accountPasswordChanged: accountPasswordChanged
    })
    next();
});

module.exports = server.exports();
