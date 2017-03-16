"use strict"

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    // var d = [];
    // for(let i=0;i<10;i++){
    //     d.push({
    //         "code":Random.integer(10100100100,10200100100),
    //         "name":Random.ctitle(6)
    //     })
    // }
    var d = {
        cycle:[{
            "code":"1",
            "text":"最近7天"
        },{
            "code":"2",
            "text":"最近15天"
        },{
            "code":"3",
            "text":"最近30天"
        },{
            "code":"0",
            "text":"最近90天"
        }],
        data:[]
    }
    for(let i=0;i<10;i++){
        d.data.push({
            "code":Random.integer(10100100100,10200100100),
            "name":Random.ctitle(6)
        })
    }
    return result.success(Mock.mock(d));
}