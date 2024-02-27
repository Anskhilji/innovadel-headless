'use strict';
var server = require('server');
var Site = require('dw/system/Site');
var HookMgr = require('dw/system/HookMgr');
var Logger = require('dw/system/Logger');

server.post('SubscribeNewsletter', function (req, res, next) {
    res.setHttpHeader('Access-Control-Allow-Origin', '*');
    var emailHelper = require("*/cartridge/scripts/helper/emailHelper.js");
    var emailSendResponse;
    var emailSuccess = false;
    var requestData = JSON.parse(request.httpParameterMap.requestBodyAsString);

    if (Site.current.preferences.custom.isMarketingCloudEnabled) {
        var mcFromEmail = !empty(Site.current.preferences.custom.mcFromEmail) ? Site.current.preferences.custom.mcFromEmail : 'no-reply@innovadeltech.com';
        var hookID = 'app.mail.sendMail';
        if (HookMgr.hasHook(hookID)) {
            emailSendResponse = HookMgr.callHook(
                hookID,
                'sendMail',
                {
                    communicationHookID: 'newsletter.created',
                    fromEmail: mcFromEmail,
                    toEmail: requestData.customerEmail,
                    SubscriberKey: requestData.customerEmail,
                    email: requestData.customerEmail,
                    SiteID: Site.getCurrent().ID,
                }
            );
        } else {
            Logger.error('Hook not found!!! (app.mail.sendMail), while sending mail to subscriber)');
        }
    } else {
        emailSendResponse = emailHelper.sendSubscribeNewsletterEmail(requestData.customerEmail, emailSuccess);
    }
    res.json({
        emailSendResponse: emailSendResponse
    })
    next();
});

module.exports = server.exports();
