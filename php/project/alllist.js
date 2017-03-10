/**
 * NAME 2016/9/5
 * DATE 2016/9/5
 * AUTHOR shangxinbo
 */

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var d = {
        "data":[
            {
                "id":8,
                "user_id":1,
                "filter_type":1,
                "filter_id":1,
                "template_id":2,
                "project_name":"营销项目",
                "area":"全国",
                "cycle":0,
                "cycle_number":0,
                "template_exist":0,
                "include_week":0,
                "include_holiday":0,
                "begin_time":"20160903",
                "detail_requirement":"描述面谈",
                "project_status":0,
                "deleted_at":null,
                "created_at":"2016-09-02 16:53:10",
                "updated_at":"2016-09-02 16:53:10",
                "clueDownloadNum":0,
                "project_status_desc":"未开始"
            },
            {
                "id":7,
                "user_id":1,
                "filter_type":1,
                "filter_id":1,
                "template_id":2,
                "project_name":"理财营销项目",
                "area":"北京",
                "cycle":0,
                "cycle_number":0,
                "template_exist":0,
                "include_week":0,
                "include_holiday":0,
                "begin_time":"20160903",
                "detail_requirement":"理财描述面谈",
                "project_status":0,
                "deleted_at":null,
                "created_at":"2016-09-02 16:36:11",
                "updated_at":"2016-09-02 16:36:11",
                "clueDownloadNum":0,
                "project_status_desc":"进行中"
            },
            {
                "id":9,
                "user_id":1,
                "filter_type":1,
                "filter_id":1,
                "template_id":2,
                "project_name":"理财营销项目",
                "area":"北京",
                "cycle":0,
                "cycle_number":0,
                "template_exist":0,
                "include_week":0,
                "include_holiday":0,
                "begin_time":"20160903",
                "detail_requirement":"理财描述面谈",
                "project_status":0,
                "deleted_at":null,
                "created_at":"2016-09-02 16:36:11",
                "updated_at":"2016-09-02 16:36:11",
                "clueDownloadNum":0,
                "project_status_desc":"已暂停"
            },
            {
                "id":19,
                "user_id":1,
                "filter_type":1,
                "filter_id":1,
                "template_id":2,
                "project_name":"理财营销项目",
                "area":"北京",
                "cycle":0,
                "cycle_number":0,
                "template_exist":0,
                "include_week":0,
                "include_holiday":0,
                "begin_time":"20160903",
                "detail_requirement":"理财描述面谈",
                "project_status":0,
                "deleted_at":null,
                "created_at":"2016-09-02 16:36:11",
                "updated_at":"2016-09-02 16:36:11",
                "clueDownloadNum":0,
                "project_status_desc":"已关闭"
            }
        ],
        "total":{
            "salesNum":"10000",
            "changeNum":3
        },
        "page":{
            "total":"100",
        }
    };
    return result.success(Mock.mock(d));
}