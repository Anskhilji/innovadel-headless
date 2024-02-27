'use strict';

var Site = require('dw/system/Site');
var sitePreference = Site.current.preferences.custom; 

exports.OMS_ACCESS_TOKEN = 'OMS_Token';
exports.OMS_ACCESS_TOKEN_ID = 'oms_accessToken';

exports.SERVICE_ID = {
    OMS_AUTH : 'oms.auth.api',
    OMS_REST : 'oms.rest.api'
}

exports.OMS_Constant = {
    CLIENT_ID: sitePreference.oms_client_id,
    CLIENT_SECRET: sitePreference.oms_client_secret,
    USERNAME: sitePreference.oms_username,
    PASSWORD: sitePreference.oms_password,
};