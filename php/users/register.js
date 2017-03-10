/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function (req, res) {
    var param = req.body;
    if (!param.username) {
        return 'username null'
    }
    if (!param.password) {
        return 'password null'
    }
    if (!param.confirmed_password) {
        return 'confirmed_password null'
    }
    if (!param.phone) {
        return 'phone null'
    }
    if (!param.email) {
        return 'email null'
    }
    if (!param.status) {
        return 'status null'
    }
    if (!param.type) {
        return 'type null'
    }
    return result.success({
        "user": {
            "user_name": "admin",
            "password": "admin123",
            "phone": "13488888888",
            "email": "zhangshilong@geotmt.com",
            "status": "1",
            "type": "1",
            "updated_at": "2016-08-22 18:16:54",
            "created_at": "2016-08-22 18:16:54",
            "id": 1
        },
        "token": "fca928bd6b9353cca2080936106e41449cffe1ee8b144b282aa563603771afbe"
    });
};