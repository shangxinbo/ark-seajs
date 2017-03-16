/**
 * NAME 2016/9/5
 * DATE 2016/9/5
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var param = req.body;
    if(!param.id){
        return 'param id error';
    }
    var d = {};
    return result.success(Mock.mock(d));
}