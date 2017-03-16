"use strict"

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var d = [];
    for(let i=0;i<10;i++){
        d.push({
            "code":Random.integer(10100100100,10200100100),
            "name":Random.ctitle(6),
            "num":Random.integer(0,10000)
        })
    }
    return result.success(Mock.mock(d));
}