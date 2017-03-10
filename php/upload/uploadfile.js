/**
 * NAME 2016/8/8
 * DATE 2016/8/8
 * AUTHOR shangxinbo
 */
var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var d = {
        code:"123",
        name:"asdfasdf",
        uploadName:"asdfasdf",
        uploadDesc:"asdfasdf",
        name:"phone-1k-0805.txt",
        id:"123"
    };
    return result.success(Mock.mock(d));
}