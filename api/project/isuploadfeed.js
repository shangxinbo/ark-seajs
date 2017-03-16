var Mock = require('mockjs');
var result = require('../base');
module.exports = function(req,res){
    var d = {
    	"pid":162
    };
    return result.success(Mock.mock(d));
}