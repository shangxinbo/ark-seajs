/**
 * NAME 2016/9/2
 * DATE 2016/9/2
 * AUTHOR shangxinbo
 */
var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var page = req.body.page?req.body.page:1;
    var rows = req.body.rows?req.body.rows:20;
    var d = {"count":20};
    return result.success(Mock.mock(d));
}