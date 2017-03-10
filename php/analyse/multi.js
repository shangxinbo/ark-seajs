/**
 * NAME 2016/8/8
 * DATE 2016/8/8
 * AUTHOR shangxinbo
 * 统计图5图
 */
var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var code = req.body.code;
    var level = req.body.level;
    var d = {
        dim_res: {
            interest:{},
            area:{},
            sex:{},
            mobile:{},
            age:{},
        },
        cus_total:7
    };
    for(var i=1;i<20;i++){
        d.dim_res.interest[Random.cword(3,6)] = Random.natural(1, 100)+ '%';
        d.dim_res.area[Random.province()] = Random.natural(1, 100)+ '%';
        d.dim_res.mobile[Random.cword(2,3)] = Random.natural(1, 100)+ '%';
    }
    d.dim_res.sex = {
        "男": '54%',
        "女": '46%'
    };
    d.dim_res.age = {
        "19-24": '20%',
        "0-18": '2%',
        "35-50": '16%',
        "25-34": '10%',
        "50+": '39%'
    };
    return result.success(Mock.mock(d));
}