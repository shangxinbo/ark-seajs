define([
    'modules/uploader',
    'modules/common'
], function (require, exports, module) {
    var Uploader = require('modules/uploader');
    var ark = require('modules/common')

    var
        dialog = $('#newCrowd'),
        fileName = $('#newCrowd input[name="name"]'),
        desc = $('#newCrowd textarea[name="desc"]'),
        label = $('#newCrowd input[name="label"]'),
        upBtn = $('#newCrowd .upbtn'),
        submitBtn = $('#newCrowd .red'),
        plupload = '',
        createApi = API.upload

    var uploader = Uploader.init({
        button: upBtn[0],
        url: createApi,
        accept: "xlsx",
        container: label
    }, function (uploader, file, result) {
        var type = dialog.data('type')
        if (type == 1) {
            saveSelectedInSessionStorage("UploadedFile", file);
            var fileData = JSON.parse(result.response.substr(0, result.response.length - 1));
            if (fileData.code == 200) {
                var crowd = {
                    id: fileData.detail.id,
                    name: fileData.detail.name
                };
                saveSelectedInSessionStorage("crowd", crowd);
                window.location.href = "/report.html";
            } else {
                $('#newCrowd ul li:last').append('<p class="error"><i></i><span>' + fileData.message + '</span></p>');
                $('#newCrowd .upload-warp input').val('');
            }
        } else {
            var data = JSON.parse(result.response.substr(0, result.response.length - 1));
            if(data.code==200){
                hideDialog() 
                $('#firstStep').data('file',data.detail.id)
                getWindow('firstStep')
            } else {
                $('#newCrowd ul li:last').append('<p class="error"><i></i><span>' + data.message + '</span></p>');
                $('#newCrowd .upload-warp input').val('');
            }
            
        }

    })

    function submitCreate() {
        var
            filenameVal = fileName.val().trim(),
            filedescVal = desc.val().trim()

        dialog.find('p.error').remove()
        dialog.find('.error').removeClass('error')

        if (filenameVal == "") {
            fileName.addClass('error').after('<p class="error"><i></i><span>人群名称不能为空</span></p>')
            return false
        } else if (filenameVal.length > 20) {
            fileName.addClass('error').after('<p class="error"><i></i><span>名称超长' + (filename.length - 20) + '字，请重新输入</span></p>')
            return false
        }
        if (filedescVal == "") {
            desc.addClass('error').after('<p class="error"><i></i><span>人群描述不能为空</span></p>')
            return false
        } else if (filedescVal.length > 100) {
            desc.addClass('error').after('<p class="error"><i></i><span>描述超长' + (filedesc.length - 100) + '字，请重新输入</span></p>')
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
        getWindow('newCrowd')
        submitBtn.off().on('click', function () {
            submitCreate()
        })
        dialog.find('a.download').off().on('click',function(){
            downFile(API.upload_template)
        })
    }
})