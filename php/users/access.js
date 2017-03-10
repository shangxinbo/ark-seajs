/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var page = req.body.page?req.body.page:1;
    var rows = req.body.rows?req.body.rows:20;
    var d = {
        total:15,
        rows:[]
    };
    for(var i=10;i<(10+parseInt(rows));i++){
        d.rows.push({
            "id": i,
            "name": Random.cword(4,8),
            "desc": Random.csentence(6,29)
        });
    }
    return result.success(Mock.mock(d));
}