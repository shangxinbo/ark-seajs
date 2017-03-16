/**
 * 弹窗模块
 */
define([
    'dialog/newCrowd',
    'dialog/newDis',
    'dialog/list',
    'base/common'
], function (require, exports, module) {
    var newCrowd = require('dialog/newCrowd')
    var newDis = require('dialog/newDis')
    var list = require('dialog/list')
    var ark = require('base/common')

    $("body").on("click", "[data-dialog]", function () {
        var id = $(this).attr("data-dialog")
        var type = $(this).attr('data-crowdType')   //默认是存量分析上传人群

        hideDialog()
        if (type==1) {
            console.log(type)
            $('#newCrowd').data('type', type)
            $('#listCrowd').data('type', type)
            console.log($('#listCrowd').data('type'))
        } else if(type==0) {
            $('#newCrowd').data('type', 0)
            $('#listCrowd').data('type', 0)
        }

        switch (id) {

            //新建上传人群
            case 'newCrowd':
                newCrowd.create()
                break

            //新建上传失联信息    
            case 'newDis':
                newDis.create()
                break

            //上传人群列表
            case 'listCrowd':
                list.show({
                    api: API.upload_list_layer,
                    dialog: 'listCrowd',
                    template: 'T_crowdList'
                }, function (tr) {
                    if (tr.length > 0) {
                        if ($('#listCrowd').data('type')) {
                            var crowd = {
                                id: tr.data('id'),
                                name: tr.data('name')
                            };
                            saveSelectedInSessionStorage('crowd', crowd)
                            window.location.href = '/report.html'
                        } else {
                            hideDialog()
                            $('#firstStep').data('file', tr.data('id'));
                            getWindow('firstStep');
                        }
                    }
                }, function () {
                    ark.alert('请新建上传文件', function () {
                        newCrowd.create()
                    })
                })
                break

            //筛选历史列表
            case 'filterList':
                list.show({
                    api: API.template_list_layer,
                    dialog: 'filterList',
                    template: 'T_filterList'
                }, function (tr) {
                    if (tr.length > 0) {
                        var text = tr.data('content');
                        ark.dissectFilters(text);
                        window.location.href = '/report.html'
                    }
                }, function () {
                    ark.alert('请新建筛选条件', function () {
                        getWindow('newFilter');
                    })
                })
                break

            //反馈模板列表
            case 'feedbackList':
                var id = getQuery("id");

                list.show({
                    api: API.project_historytemplate,
                    dialog: 'feedbackList',
                    template: 'T_feedbackList'
                }, function (tr) {
                    if (tr.length > 0) {
                        var crowd = {
                            id: tr.data('id'),
                            name: tr.data('name')
                        };
                        majax({
                            url: API.project_uptemplate,
                            data: {
                                tid: crowd.id,
                                pid: id
                            },
                            success: function (data) {
                                if (data.code == 200) {
                                    var type = getQuery('type')
                                    if (type == 'stock') {
                                        location.href = "/project/list_stock.html";
                                    } else {
                                        location.href = "/project/list_new.html";
                                    }
                                } else {
                                    hideDialog('historyTemplate');
                                    ark.alert(data.message);
                                }
                            }
                        });
                    }
                }, function () {
                    ark.alert('请创建历史反馈模板');
                })
                break
            //默认弹窗
            default:
                getWindow(id)
        }
    }).on('click', ".product", function () {
        var _id = $("#firstStep").data("file")
        var str = '/filter-tag/InventoryAnalysis-screening.html?entrance=product'
        if (_id) {
            str += '&file=' + _id
        }
        window.location.href = str;
    }).on('click', ".preference", function () {
        var _id = $("#firstStep").data("file");
        var str = '/filter-tag/InventoryAnalysis-screening.html?entrance=preference'
        if (_id) {
            str += '&file=' + _id
        }
        window.location.href = str;
    }).on('click', '#feedbackList .use', function () {
        var _this = $(this);
        var templateId = _this.parents('tr').data('id');
        var id = getQuery('id');
        location.href = "/project/view-feedback.html?template_id=" + templateId + "&id=" + id + '&source=view';
    });
})
