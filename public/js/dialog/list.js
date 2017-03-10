define([
    STATIC + 'lib/scrollBar',
    STATIC + 'lib/template'
], function (require, exports, module) {
    var template = require(STATIC + 'lib/template')
    
    //custom options
    var options = {
        size: 20,
        api: API.upload_list_layer,
        dialog: 'listCrowd',
        template: 'historyList'
    }

    var page = 1,
        endlist = false,
        content = '',
        submitBtn = ''
    
    //filterlist content format
    template.helper('content', function (val) {
        if (val) {
            var content = JSON.parse(val)
            var str = ''
            if (content.file && content.file.name) {
                str += '上传人群：' + content.file.name
            }
            if (content.tagcode && content.tagcode.length) {
                var tag = ''
                for (var i = 0; i < content.tagcode.length; i++) {
                    for (var k = 0; k < content.tagcode[i].length; k++) {
                        tag += content.tagcode[i][k].text + ','
                    }
                }
                str += '已选标签：' + tag
            }
            if (content.fixedpros) {
                var fixedtag = ''
                for (var key in content.fixedpros) {
                    if (content.fixedpros[key] && content.fixedpros[key].length) {
                        for (var j = 0; j < content.fixedpros[key].length; j++) {
                            fixedtag += content.fixedpros[key][j].text + ','
                        }
                    }
                }
                if (fixedtag) {
                    str += '固定条件：' + fixedtag
                }
            }
            if (content.cuModel && content.cuModel.name) {
                str += '固定条件：' + content.cuModel.name
            }
            return str
        } else {
            return null
        }
    })
    
    //format big number like '1223232323' to '1,223,232,323'
    template.helper('bigNum',function(val){
        return formatBigNumber(val)
    })


    function init(opt) {

        $.extend(options, opt)

        content = $('#' + options.dialog).find('table.scroll-content')
        submitBtn = $('#' + options.dialog).find('a.red')

        $(".scroll-warp").scrollUnique()
        content.html('')
    }

    function getData(callback) {
        majax({
            url: options.api,
            data: {
                page: page,
                rows: options.size,
                nums:options.size
            },
            success: function (data) {
                if (data.code == 200) {
                    var data = data.detail.rows?data.detail.rows:data.detail.data;

                    var html = template(options.template, { rows: data });
                    content.append(html);
                    if (data.length < options.size) {
                        endlist = true
                    }
                    if (callback) {
                        callback(data.length)
                    }
                }
            }
        })
    }

    function scrollInit() {
        $(".scroll-warp").scrollBar({
            scrollInertia: 200,
            advanced: {
                updateOnContentResize: true
            },
            callbacks: {
                onTotalScroll: function () {
                    if (endlist) { return false; }
                    page++
                    getData()
                },
                onTotalScrollOffset: 100
            }
        });
    }

    exports.show = function (options, success, error) {
        init(options)
        getData(function (bool) {
            if (bool) {
                getWindow(options.dialog)
                $('#' + options.dialog).off().on('click', '.dialog-table.scroll-content i', function () {
                    var thistr = $(this).closest("tr");
                    thistr.siblings().find("i").removeClass("checked");
                    $(this).toggleClass("checked");
                })
                submitBtn.off().on('click', function () {
                    if (success) success($('#' + options.dialog).find('.checked').parents('tr'))
                })
                scrollInit()
            } else {
                if (error) error(1)
            }
        })
    }
})