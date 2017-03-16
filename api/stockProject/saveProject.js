"use strict"

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var d = [];

    return result.success(Mock.mock(d));
    // return result.error(30002,'1111');
}