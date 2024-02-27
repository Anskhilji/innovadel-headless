'use strict';

/**
 * @module communication/account
 */

const URLUtils = require('dw/web/URLUtils');

const hookPath = 'app.communication.newsletter.';

/**
 * Wrapper to trigger.sendTrigger() to allow common variable injection for all hooks in the file
 * @param hookID
 * @param promise
 * @param data
 * @returns {SynchronousPromise}
 */
function sendTrigger(hookID, promise, data) {
    return require('*/cartridge/scripts/communication/util/send').sendTrigger(hookID, promise, data);
}

/**
 * Trigger account created notification
 * @param {SynchronousPromise} promise
 * @param {module:communication/util/trigger~CustomerNotification} data
 * @returns {SynchronousPromise}
 */
function created(promise, data) {
    return sendTrigger(hookPath + 'created', promise, data);
}

module.exports = require('dw/system/HookMgr').callHook(
    'app.communication.handler.initialize',
    'initialize',
    require('*/cartridge/scripts/communication/handler').handlerID,
    'app.communication.account',
    {
        created: created,
    }
);
