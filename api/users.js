/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('./base');
module.exports = function (req, res) {
    return result.success({
        "user": {
            "id": 1,
            "username": "asdfasf",
            "nickname": "",
            "phone": "13488888888",
            "email": "zhangshilong@geotmt.com",
            "type": 0,
            "status": 1,
            "deleted_at": null,
            "created_at": "2016-08-22 18:16:54",
            "updated_at": "2016-08-22 18:16:54"
        }
    });
};