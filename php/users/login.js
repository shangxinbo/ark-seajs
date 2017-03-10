/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base.js');
module.exports = function (req, res) {
    var param = req.body;
    if (!param.username) {
        return 'username null'
    }
    if (!param.password) {
        return 'password null'
    }
    return result.success({
        "user": {
            "id": 1,
            "user_name": "admin",
            "nickname": "",
            "password": "admin123",
            "phone": "13488888888",
            "email": "zhangshilong@geotmt.com",
            "type": 1,
            "status": 1,
            "deleted_at": null,
            "created_at": "2016-08-22 18:16:54",
            "updated_at": "2016-08-22 18:16:54"
        },
        "api-token":"fca928bd6b9353cca2080936106e41449cffe1ee8b144b282aa563603771afbe"
    });
}