/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var param = req.body;
    var d = {
        "users":{
            "total":5,
            "per_page": 10,
            "current_page": 2,
            "last_page": 4,
            "next_page_url": "http://ark.geotmt.com/users/list?page=3",
            "prev_page_url": "http://ark.geotmt.com/users/list?page=1",
            "from": 21,
            "to": 40,
            "data":[]
        }
    };
    for(var i=0;i<param.rows;i++){
        d.users.data.push({
            "id": Random.natural(),
            "username": Random.word(4,9),
            "nickname": Random.cword(4,6),
            "password": "eyJpdiI6IjF2OHgreStNbHBxM0p4RDhuanZKSHc9PSIsInZhbHVlIjoidUdOMlZPdXhRVTlTT0tJU1hsRUR5UT09IiwibWFjIjoiYzY0MTFlOGUwMmQ4MWE0YjM0MzJiNzZkMDJkM2FmZDhjMTgxYjQ3N2E3M2RhNzdhNmM1YWQ1MDViODc4YjAyMyJ9",
            "phone": "13488888888",
            "email": Random.email(),
            "type": Random.integer(0,1),
            "status": Random.integer(0,1),
            "deleted_at": null,
            "created_at": Random.date('yyyy-MM-dd hh:mm:ss'),
            "updated_at": Random.date('yyyy-MM-dd hh:mm:ss')
        })
    }

    return result.success(Mock.mock(d));
};