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
    if(!param.project_id){
        return 'param project_id error';
    }
    var d = {
        date:[],
        change_score:[],
        ciclyName:[]
    };
    for(var i=0;i<7;i++){
        d.date.push(Random.date('yyyyMMdd'));
        var a = [];
        for(var j=0;j<3;j++){
            a.push(Random.integer(0,100));

        }
        d.change_score.push(a)
    }
    for(var m=0;m<3;m++){
        d.ciclyName.push(Random.csentence(3,6));
    }
    return result.success(Mock.mock(d));
}