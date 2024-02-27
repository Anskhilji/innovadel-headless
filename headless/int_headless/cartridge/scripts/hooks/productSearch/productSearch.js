'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');

var productRating = require ("*/cartridge/scripts/helper/productHelper.js");
var ProductFactory = require('*/cartridge/scripts/factories/product');

exports.modifyGETResponse = function (product, res) {

    try {
        var prd = product && product.hits && product.hits.length > 0 ? product.hits.toArray() : null;
        var item = null;

        if (!empty(prd)) {
            prd.forEach(function (key) {
                var params = {
                    pid: key.productId
                };
                var fullProduct = ProductFactory.get(params);

                item = key;
                item.c_rating = productRating.getProductRating(key.productId);
                item.c_promotionPrice = fullProduct.price.sales;
                item.c_promotions= fullProduct.promotions;
            });
        }
    } catch (ex) {
        Logger.error('(product-modifyGETResponse) -> Error occured while product search hook executing and exception is: {0} in {1} : {2}', ex.toString(), ex.fileName, ex.lineNumber);
    }
    
    return new Status(Status.OK);
}