'use strict';

var Calendar = require('dw/util/Calendar');
var Locale = require('dw/util/Locale');
var Logger = require('dw/system/Logger');
var Resource = require('dw/web/Resource');
var Site = require('dw/system/Site');
var StringUtils = require('dw/util/StringUtils');

var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
var OrderModel = require('*/cartridge/models/order');

function sendEmail(emailObj, template, context) {
    var HashMap = require('dw/util/HashMap');
    var Mail = require('dw/net/Mail');

    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var mail = new Mail();
    
    mail.addTo(emailObj.to);
    mail.setFrom(emailObj.from);
    mail.setSubject(emailObj.subject);
    mail.setContent(renderTemplateHelper.getRenderedHtml(context, template), 'text/html', 'UTF-8');
    mail.send();
}

function sendSubscribeNewsletterEmail(userEmail, emailSuccess) {
    try {
        var emailObj = {
            to: userEmail,
            subject: Resource.msg('email.object.subject.subscription','registration',null),
            from: 'no-reply@salesforce.com',
            type: emailHelpers.emailTypes.registration
        };
        var context = {
            timeStamp: StringUtils.formatCalendar(new Calendar(), 'MM-dd-yyyy-h-mm-a'),
            sessionID: session.getSessionID(),
            message: Resource.msg('email.subscription.thankyou.msg','registration',null)
        }
        var template = 'subscription/email/subscribeNewsletterNotification';
        sendEmail(emailObj, template, context);
        emailSuccess = true;
    } catch (ex) {
        Logger.error('(emailHelper-sendEmail) -> Error occured while sending the email and exception is: {0} in {1} : {2}', ex.toString(), ex.fileName, ex.lineNumber);
    }
    return emailSuccess
}

function sendConfirmationEmail(order, orderConfirmation) {
    try {
        var currentSite = Site.getCurrent();
        var currentLocale = Locale.getLocale(currentSite.getDefaultLocale());

        var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });
        var orderObject = { order: orderModel };

        var emailObj = {
            to: order.customerEmail,
            subject: Resource.msg('subject.order.confirmation.email', 'order', null),
            from: 'no-reply@innovadeltech.com',
            type: emailHelpers.emailTypes.orderConfirmation
        };
        var template = 'checkout/confirmation/confirmationEmail';
        sendEmail(emailObj, template, orderObject)
        orderConfirmation.success = true;
        return orderConfirmation;
    } catch (e) {
        Logger.error('(emailHelper-sendConfirmationEmail) -> Error occured while sending email on order confirmation in file:{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
        return orderConfirmation;
    }
}

module.exports = {
    sendSubscribeNewsletterEmail: sendSubscribeNewsletterEmail,
    sendConfirmationEmail: sendConfirmationEmail
}