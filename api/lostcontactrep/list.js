

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');

module.exports = function (req,res) {
    var page = req.body.page?req.body.page:1;
    var rows = req.body.rows?req.body.rows:20;
    var arr = [];
    for(var i=0;i<parseInt(rows);i++){
        arr.push({
            "id": Random.integer(0,1000),
            "name": Random.csentence(6),
            "desc":Random.csentence(12),
            "num":Random.integer(0,10000),
            "begdt":Random.date('yyyy-MM-dd'),
            "endt":Random.date('yyyy-MM-dd'),
            "status":Random.integer(0,2),
            "repair_num":Random.integer(0,10000)
        })
    }
    return result.success(Mock.mock({
        page:{
            current:Random.integer(0,5),
            total:17
        },
        data:arr
    }))
}