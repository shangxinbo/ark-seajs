define([
    STATIC + 'lib/plupload.full.min.js',
    STATIC + 'modules/common'
], function (require, exports, module) {

    var defaults = {
        button: $('#newCrowd .red')[0],
        url: API.upload,
        accept: "txt",
        container: $('body'),
        data: {},
        autoUp: false
    }

    var session = getCookie('MLG')

    /**
     * @param Object options 初始化参数
     * @param Function callback 上传成功回掉
     */
    exports.init = function (options, callback) {
        var opt = $.extend({}, defaults, options);
        var uploader = new plupload.Uploader({
            browse_button: opt.button,
            url: opt.url,
            flash_swf_url: '/js/lib/Moxie.swf',
            multi_selection: false,
            headers: {
                "api-token": session
            },
            filters: {
                mime_types: [
                    { title: "TXT files", extensions: opt.accept }
                ],
                max_file_size: '100mb'
            }
        })
        uploader.init()
        uploader.bind('FilesAdded', function (uploader, file) {
            if (opt.autoUp) {
                getWindow('loading')
                uploader.start()
            } else {
                var filename = file[0].name;
                opt.container.val(filename);

                var queuedLength = uploader.total.queued;
                if (queuedLength > 1) {
                    uploader.splice(0, queuedLength - 1);
                }
            }
        })
        uploader.bind('Error', function (uploader, err) {
            $(opt.button).parent().next('.error').remove()
            if (err.code == -601) {
                var msg = '文件格式有误，请重新上传' + opt.accept + '格式文件'
            } else if (err.code == -600) {
                var msg = '文件过大，请上传100MB以内的文件'
            } else {
                var msg = err.message
            }
           $(opt.button).parent().after('<p class="error"><i></i><span>' + msg + '</span></p>')
        })
        uploader.bind('FileUploaded', function (uploader, file, result) {
            if (callback) callback(uploader, file, result)
        })
        return uploader
    }
});
