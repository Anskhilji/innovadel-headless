'use strict';

var Logger = require('dw/system/Logger');

function getProductRating(productId) {
    var rateVal = null;
    var sum = null;
    try {
        var id = productId;
        sum = id.split('').reduce(function (total, letter) {
            return total + letter.charCodeAt(0);
        }, 0);

        rateVal = (Math.ceil(((sum % 3) + 2) + (((sum % 10) / 10) + 0.1)));
    } catch (ex) {
        Logger.error('(productHelper-getProductRating) -> Error occured while getting product rating and exception is: {0} in {1} : {2}', ex.toString(), ex.fileName, ex.lineNumber);
    }
    return (rateVal < 5 ? rateVal + (((sum % 10) * 0.1) + 0.1) : rateVal);
}

module.exports = {
    getProductRating: getProductRating
}