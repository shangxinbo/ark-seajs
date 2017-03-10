/**
 * Created by Administrator on 2016/9/6.
 */
seajs.use([
    STATIC + 'modules/pages',
    STATIC + 'modules/common',
    STATIC + 'modules/uploader',
    STATIC + 'lib/template',
    STATIC + 'dialog/popWindow'
], function (pages, ark, Uploader, template) {
    var id = getQuery('id');
    var project_id = getQuery('project_id')
    var type = getQuery('type')
    var user = ark.getUserInfo();

    majax({
        url: API.tags_cycledata,
        data: {
            id: getQuery('id')
        },
        success: function (data) {
            if (data.code == 210) {
                ark.pageForbidden()
            }
            if (data.code != 200) {
                ark.alert(data.message);
                return false;
            }

            //面包屑
            if(type=='stock'){
                $('.breadcrumb a').attr('href','/project/list_stock.html')
            }
            $('.breadcrumb li:eq(1) span').html(data.detail.project.name)
            $('.title-bar h2').html(data.detail.project.name);
            initUploadBtn(data.detail.id)
            /*if (data.detail.clue_download_status) {
                initUploadBtn(data.detail.id)
            } else {
                $('.addback').on('click', function () {
                    ark.alert('请下载人群，再进行上传反馈操作');
                })
            }*/

            $('.center-button').prepend(template('data_status', {
                data: data.detail.summary
            }))
            if (data.detail.cycle_info) {
                $(".case-table").html(template('list', {
                    data: data.detail.cycle_info,
                    id: data.detail.id
                }))
                $(".funnel-chart").html(template('funnel', {
                    data: data.detail.cycle_info
                }))
            }


            //外推
            var cl = $('#waitui .select-block a');
            if (data.detail.summary.effect_total > 80) {
                $(cl[0]).find('em').html('匹配用户 ' + parseInt(data.detail.summary.effect_total * (0.18 / 2 + 0.5)));
                $(cl[1]).find('em').html('匹配用户 ' + parseInt(data.detail.summary.effect_total * (0.15 / 2 + 0.5)));
                $(cl[2]).find('em').html('匹配用户 ' + parseInt(data.detail.summary.effect_total * (0.195 / 2 + 0.5)));
                $(cl[3]).find('em').html('匹配用户 ' + parseInt(data.detail.summary.effect_total * (0.42 / 2 + 0.5)));
                $(cl[4]).find('em').html('匹配用户 ' + parseInt(data.detail.summary.effect_total * (0.24 / 2 + 0.5)));
                $(cl[5]).find('em').html('匹配用户 ' + parseInt(data.detail.summary.effect_total * (0.24 / 2 + 0.5)));
            } else {
                for (var i = 0; i < cl.length; i++) {
                    $(cl[i]).find('em').html('匹配用户 ' + random(data.detail.summary.effect_total));
                }
            }
        }
    });

    $("body").on("click", ".downback", function () {
        downFile(API.tags_template, '?project_id=' + project_id)
    }).on('click', '[data-downdata]', function () {
        downFile(API.tags_downloaddata, '?id=' + id)
        hideDialog()
    }).on('click', '#waitui .select-block a', function () {
        $(this).siblings('a').removeClass('active');
        $(this).addClass('active');
    })

    function initUploadBtn(cycleId) {
        var uploader = Uploader.init({
            button: $('.addback')[0],
            url: API.tags_upload,
            accept: 'xls,xlsx',
            autoUp: true
        }, function (uploader, file, result) {
            hideDialog('loading');
            var fileData = JSON.parse(result.response.substr(0, result.response.length - 1));
            if (fileData.code == 200) {
                window.location.reload();
            } else if (fileData.code == 207) {
                var data = fileData;
                var phone = [], level = [], pl = [];
                for (var i in data.detail) {
                    var d = data.detail[i];
                    if (d.phone && d.level) {
                        pl.push(i);
                    } else {
                        if (d.phone) {
                            phone.push(i);
                        }
                        if (d.level) {
                            level.push(i);
                        }
                    }
                }
                upErrorAlert(phone, level, pl);
            } else {
                ark.alert(fileData.message)
            }
        })

        uploader.bind('BeforeUpload', function (uploader, files) {
            uploader.setOption('multipart_params', {
                "id": cycleId,
                "project_id": getQuery('id'),
                "api-token": getCookie('MLG')
            })
        })
        return uploader
    }

    function upErrorAlert(phone,level,pl) {
        var text = '<div class="data-error-title"><i></i><span>上传数据格式有错误</span></div><p>';
        var items = {};
        if(phone.length>0){
        	items.phone = {};
        	items.phone.id = "phone";
        	items.phone.classification = phone.length + '条数据格式错误';
        	items.phone.lines = phone.join('、');
            text += '<a href="javascript:void(0);" data-classification="phone">'
            	 + phone.length
            	 + '条</a>数据的数据格式错误,';
        }
        if(level.length>0){
        	items.level = {};
        	items.level.id = "level";
        	items.level.classification = level.length + '条阶段信息错误';
        	items.level.lines = level.join('、');
            text += '<a href="javascript:void(0);" data-classification="level">'
            	 + level.length
            	 + '条</a>数据的阶段信息错误,';         	 
        }
        if(pl.length>0){
        	items.pl = {};
        	items.pl.id = "pl";
        	items.pl.classification = pl.length + '条数据和阶段信息错误';
        	items.pl.lines = pl.join('、');
            text += '<a href="javascript:void(0);" data-classification="pl">'
            	 + pl.length
            	 + '条</a>数据的数据格式与阶段信息均错误';     
        }
        text += '</p>';
        $('body').on('click','.dialog-body a',function(){
        	saveSelectedInSessionStorage('errorData',items);
        	var classification = $(this).data('classification');
    		window.open('/project/data-error.html?classification='+classification);
	    });
        ark.alertErr(text,function(){
        	saveSelectedInSessionStorage('errorData',items);
    		window.open('/project/data-error.html');
        });
    };
})