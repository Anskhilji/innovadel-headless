'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
const URLUtils = require('dw/web/URLUtils');
var HashMap = require('dw/util/HashMap');
var Site = require('dw/system/Site');

exports.afterPATCH = function (customer, customerInput) {
    try {
        if (customer && customerInput) {
            var HookMgr = require('dw/system/HookMgr');
            var context = new HashMap();
            var mcFromEmail = !empty(Site.current.preferences.custom.mcFromEmail) ? Site.current.preferences.custom.mcFromEmail : 'no-reply@innovadeltech.com';
            var currentSite = Site.getCurrent();

            var userObject = {
                subscriberKey: customer.profile.email,
                emailAddress: customer.profile.email,
                firstName: customer.profile.firstName,
                lastName: customer.profile.lastName
            };

            Object.keys(userObject).forEach(function (key) {
                context.put(key, userObject[key]);
            });

            var hookID = 'app.mail.sendMail';
            if (HookMgr.hasHook(hookID)) {
                HookMgr.callHook(
                    hookID,
                    'sendMail',
                    {
                        communicationHookID: 'account.updated',
                        fromEmail: mcFromEmail,
                        toEmail: userObject.emailAddress,
                        SubscriberKey: customer.profile.email,
                        email: customer.profile.email,
                        firstName: customer.profile.firstName,
                        lastName: customer.profile.lastName,
                        SiteID: currentSite.ID,
                        params: context,
                        customer: customer
                    }
                );
            } else {
                Logger.error('No hook registered for {0}', hookID);
            }

        }
    } catch (ex) {
        Logger.error('(accountUpdated) -> Error occured while executing Hook and exception is: {0} in {1} : {2}', ex.toString(), ex.fileName, ex.lineNumber);
    }

    return new Status(Status.OK);
};