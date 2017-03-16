"use strict"

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function (req, res) {
    var d = 123456789;
    return result.success(Mock.mock(d));
}