"use strict";
let Mock = require('mockjs')
let Random = Mock.Random
let result = require('../base')
module.exports = function(req,res){
    let page = req.body.page?req.body.page:1
    let rows = req.body.rows?req.body.rows:20
    let keywords = req.body.keywords
    let type = req.body.type 
    let d = {
        project:{
            total:20,
            current_page:page,
            data:[]
        },
        total:{
            salesNum: "799627", 
            changeNum: 0
        }
    }
    
    for(let i=0;i<10;i++){
        d.project.data.push({
            "id": Random.integer(0,10000),
            "user_id": 1,
            "project_name": Random.ctitle(6),
            "template_id":'1',
            "contacts": Random.cname(),
            "describe": Random.ctitle(10),
            "product": Random.ctitle(4) + ','+ Random.ctitle(6),
            "interests_channel": Random.ctitle(4) + ','+ Random.ctitle(6),
            "channel": Random.ctitle(4) + ','+ Random.ctitle(6),
            "area": Random.ctitle(4) + ','+ Random.ctitle(6),
            "assets": Random.ctitle(4) + ','+ Random.ctitle(6),
            "internet_assess": "",
            "status": Random.integer(0,5),
            "screen_num": Random.integer(0,10000),
            "feedback_num": Random.integer(0,10000),
            "sex": "10100100100,10100100200,10100100300",
            "created_at": Random.date('yyyy-MM-dd')
        })
    }

    return result.success(Mock.mock(d));
}