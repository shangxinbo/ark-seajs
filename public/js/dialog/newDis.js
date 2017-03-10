define([
    STATIC + 'modules/uploader'
], function (require, exports, module) {
    var Uploader = require(STATIC + 'modules/uploader');
    var ark = require(STATIC + 'modules/common');
    var
        dialog = $('#newDis'),
        fileName = $('#newDis input[name="name"]'),
        desc = $('#newDis textarea[name="desc"]'),
        label = $('#newDis input[name="label"]'),
        upBtn = $('#newDis .upbtn'),
        submitBtn = $('#newDis .red'),  
        createApi = API.lostcontactrep_upload
    
    var uploader = Uploader.init({
        button: upBtn[0],
        url: createApi,
        accept: "xlsx",
        container: label
    }, function (uploader, file, result) {
        var fileData = JSON.parse(result.response);
        dialog.find('p.error').remove()
        dialog.find('.error').removeClass('error')
        if(fileData.code==200){
            window.location.href = '/dis-repair.html'
        }else if(fileData.code==203||fileData.code==206){
            fileName.addClass('error').after('<p class="error"><i></i><span>'+fileData.message+'</span></p>');
            label.val('');
            return false
        }else if(fileData.code==211||fileData.code==205||fileData.code==202){
            label.addClass('error').closest('div').after('<p class="error"><i></i><span>'+fileData.message+'</span></p>');
            label.val('');
            return false
        }else if(fileData.code==207){
            desc.addClass('error').after('<p class="error"><i></i><span>'+fileData.message+'</span></p>')
            label.val('');
            return false
        }
        else{
            hideDialog();
            label.val('');
            ark.alert(fileData.message);
        }

    })

    function submitCreate() {
        var
            filenameVal = fileName.val().trim(),
            filedescVal = desc.val().trim(),
            pattenname = /^[\u4E00-\u9FFFa-zA-Z0-9]{0,20}$/,
            pattendesc = /^[\u4E00-\u9FFFa-zA-Z0-9]{0,60}$/;
        dialog.find('p.error').remove()
        dialog.find('.error').removeClass('error')

        if (!pattenname.test(filenameVal)) {
                fileName.addClass('error').after('<p class="error"><i></i><span>名称可以由中文、字母、数字组合，最长10个字符</span></p>');
                fileName.focus();
                return false;
        } else if (filenameVal == "") {
            fileName.addClass('error').after('<p class="error"><i></i><span>失联名称不能为空</span></p>')
            return false
        } else if (filenameVal.length > 10) {
            fileName.addClass('error').after('<p class="error"><i></i><span>名称超长' + (filenameVal.length - 10) + '字，请重新输入</span></p>')
            return false
        }
        if (!pattendesc.test(filedescVal)) {
            desc.addClass('error').after('<p class="error"><i></i><span>描述可以由中文、字母、数字组合，最长50个字符</span></p>');
            desc.focus();
            return false;
        }
        if (filedescVal == "") {
            desc.addClass('error').after('<p class="error"><i></i><span>信息描述不能为空</span></p>')
            return false
        } else if (filedescVal.length > 50) {
            desc.addClass('error').after('<p class="error"><i></i><span>描述超长' + (filedescVal.length - 50) + '字，请重新输入</span></p>')
            return false
        }
        if (!label.val()) {
            label.addClass('error').closest('div').after('<p class="error"><i></i><span>请上传文件</span></p>')
            return false
        }
        uploader.bind('BeforeUpload', function (uploader, files) {
            uploader.setOption('multipart_params', {
                "name": filenameVal,
                "desc": filedescVal,
                "api-token": getCookie('MLG')
            })
        })
        uploader.start()
    }

    exports.create = function () {

        dialog.find('p.error').remove()
        dialog.find('.error').removeClass('error')
        fileName.val('')
        desc.val('')
        label.val('')

        getWindow('newDis')
        submitBtn.off().on('click', function () {
            submitCreate()
        })
    }
})