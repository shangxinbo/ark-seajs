"use strict"

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var d = [];
    // for(let i=0;i<10;i++){
    //     d.push({
    //         "code":Random.integer(10100100100,10200100100),
    //         "name":Random.ctitle(6),
    //         "num":Random.integer(0,10000)
    //     })
    // }
    d = [{"code":10104444486,"name":"入除立记种律","num":5900},{"code":10117876058,"name":"三生千影温基","num":1262},{"code":10197969350,"name":"江活界形给前","num":4435},{"code":10148284170,"name":"以置许手油题","num":2295},{"code":10153773484,"name":"强据样情般度","num":2575},{"code":10162682158,"name":"适任形种特法","num":9391},{"code":10173918009,"name":"子容进我油是","num":2251},{"code":10189719658,"name":"来也土算里样","num":4890},{"code":10107959057,"name":"走容其需离也","num":4825},{"code":10169340476,"name":"走需然片音角","num":3924}];
    return result.success(Mock.mock(d));
}