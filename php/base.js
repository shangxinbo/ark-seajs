/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

module.exports.success = function (data) {
    return {
        "code":200,
        "message":'',
        "detail":data
    };
};

module.exports.error = function (code,message) {
    if(code!=200){
        return {
            "code":code,
            "message":message
        };
    }else{
        return 'response code error';
    }
};

module.exports.upload = function () {
    return '{"code":200, "message":"", "detail":{}}#';
};