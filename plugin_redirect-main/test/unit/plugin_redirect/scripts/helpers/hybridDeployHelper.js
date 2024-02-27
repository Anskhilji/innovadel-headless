'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var routes = '{"Home": "/","Product": "/[locale]/product/[productid]","Category": "/[locale]/category/[categoryid]","Search": "/[locale]/search?q=[searchterms]","Account": "/[locale]/account"}';

describe('test relative url building', function () {
    var hybridDeployHelper = proxyquire('../../../../../cartridges/plugin_redirect/cartridge/scripts/helpers/hybridDeployHelper', {
        '*/cartridge/config/hybridDeployPreferences': {
            PWA_KIT_ROUTES: routes
        }
    });

    it('should get URL for account component', function () {
        var url = hybridDeployHelper.getUrl('Account', 'en_US');
        assert.equal(url, '/en-US/account');
    });

    it('should get URL for home component', function () {
        var url = hybridDeployHelper.getUrl('Home', 'en_US');
        assert.equal(url, '/');
    });

    it('should get URL for product component', function () {
        var url = hybridDeployHelper.getProductUrl('en_US', 'product1');
        assert.equal(url, '/en-US/product/product1');
    });

    it('should get URL for category component', function () {
        var url = hybridDeployHelper.getCategoryUrl('en_US', 'category1');
        assert.equal(url, '/en-US/category/category1');
    });

    it('should get URL for search component', function () {
        var url = hybridDeployHelper.getSearchUrl('en_US', 'someSearchTerm');
        assert.equal(url, '/en-US/search?q=someSearchTerm');
    });
});

describe('test with alternate locale placement', function () {
    var hybridDeployHelper = proxyquire('../../../../../cartridges/plugin_redirect/cartridge/scripts/helpers/hybridDeployHelper', {
        '*/cartridge/config/hybridDeployPreferences': {
            PWA_KIT_ROUTES: '{"Home": "/","Account": "/account","Search": "/search?q=[searchterms]&locale=[locale]"}'
        }
    });
    it('should have no locale', function () {
        var url = hybridDeployHelper.getUrl('Account', 'en_US');
        assert.equal(url, '/account');
    });
    it('should have locale as a query parameter', function () {
        var url = hybridDeployHelper.getSearchUrl('en_US', 'someSearchTerm');
        assert.equal(url, '/search?q=someSearchTerm&locale=en-US');
    });
    it('should return undefined url if component has no route', function () {
        var url = hybridDeployHelper.getUrl('Cart', 'en-US');
        assert.equal(url, undefined);
    });
});
