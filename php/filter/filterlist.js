/**
 * NAME 2016/8/8
 * DATE 2016/8/8
 * AUTHOR shangxinbo
 */
var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function(req,res){
    var page = req.body.page?req.body.page:1;
    var rows = req.body.rows?req.body.rows:20;
    /*var d = {
        total:205,
        rows:[]
    };
    var content = [
        '{\"tagcode\":null,\"fixedpros\":null,\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":{\"id\":1,\"name\":\"普通信用卡\"}}',
        '{\"tagcode\":null,\"fixedpros\":null,\"group\":null,\"file\":{\"id\":40,\"name\":\"方舟145.txt\"},\"cuModel\":null}',
        '{\"tagcode\":[[{\"code\":\"106000000002000015\",\"text\":\"美团团购_A\",\"level\":100},{\"code\":\"106000000002000013\",\"text\":\"百度糯米_A\",\"level\":100},{\"code\":\"106000000003000003\",\"text\":\"百度糯米_网\",\"level\":100},{\"code\":\"106000000003000005\",\"text\":\"去哪儿网团购\",\"level\":100},{\"code\":\"106000000003000009\",\"text\":\"团800_网\",\"level\":100}]],\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}',
        '{\"tagcode\":[],\"fixedpros\":{\"area\":[],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[{\"code\":20002,\"text\":\"19-24\"}]},\"group\":null,\"file\":{\"id\":27,\"name\":\"方舟2.txt\"},\"cuModel\":{\"id\":4,\"name\":\"理财模型\"}}'
    ];
    for(var i=10;i<(10+parseInt(rows));i++){
        d.rows.push({
            "id": i,
            "name": Random.cword(4,8),
            "desc": Random.csentence(6,29),
            "type": 0,
            "content": content[3],
            "dataPath": "d:/detail_bak//1/911be07a-92ef-41a1-8210-df349b6fe65d",
            "uploadPath": Random.url(),
            "createTime": Random.date('yyyy-MM-dd'),
            "alterTime": Random.date('yyyy-MM-dd'),
            "status": 0
        });
    }*/
    d = {"total":7,"rows":[{"id":6,"name":"\u6cb3\u5317\u751f","desc":"\u6cb3\u5317\u751f","content":"{\"tagcode\":[],\"fixedpros\":{\"area\":[{\"code\":30004,\"text\":\"\u6cb3\u5317\u7701\"}],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[]},\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}","createTime":"2016-09-12 18:22:39"},{"id":5,"name":"\u5c71\u897f\u7701","desc":"\u5c71\u897f\u7701","content":"{\"tagcode\":[],\"fixedpros\":{\"area\":[{\"code\":30005,\"text\":\"\u5c71\u897f\u7701\"}],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[]},\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}","createTime":"2016-09-12 18:22:17"},{"id":7,"name":"\u6cb3\u5317\u751f","desc":"\u6cb3\u5317\u751f","content":"{\"tagcode\":[],\"fixedpros\":{\"area\":[{\"code\":30004,\"text\":\"\u6cb3\u5317\u7701\"}],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[]},\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}","createTime":"2016-09-12 18:22:39"},{"id":8,"name":"\u8d44\u8baf\u8bba\u575b","desc":"\u8d44\u8baf\u8bba\u575b","content":"{\"tagcode\":[[{\"code\":\"10301\",\"text\":\"\u8d44\u8baf\u8bba\u575b\",\"level\":2}]],\"fixedpros\":{\"area\":[],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[]},\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}","createTime":"2016-09-12 18:23:52"},{"id":9,"name":"\u7f8e\u56e2app","desc":"\u7f8e\u56e2app","content":"{\"tagcode\":[[{\"code\":\"106000000002000015\",\"text\":\"\u7f8e\u56e2\u56e2\u8d2d_APP\",\"level\":100}]],\"fixedpros\":{\"area\":[],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[]},\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}","createTime":"2016-09-12 18:25:45"},{"id":10,"name":"\u6bcd\u5a74\u7528\u54c1","desc":"\u6bcd\u5a74\u7528\u54c1","content":"{\"tagcode\":[[{\"code\":\"11001\",\"text\":\"\u6bcd\u5a74\u7528\u54c1\",\"level\":2}]],\"fixedpros\":{\"area\":[],\"interest\":[],\"sex\":[],\"mobile\":[],\"age\":[]},\"group\":null,\"file\":{\"code\":null,\"name\":null},\"cuModel\":null}","createTime":"2016-09-12 18:26:09"}]};
    return result.success(Mock.mock(d));
}