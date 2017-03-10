seajs.use([
    STATIC + 'modules/common',
    STATIC + 'lib/template',
    STATIC + 'dialog/popWindow',
    STATIC + 'lib/xUpload'
], function (ark, template) {

    var apply_cycle_id = '';
    var apply_turn_number = 0;
    $('body').on('click', '.downback', function () {
        var id = getQuery('id');
        if (id) {
            downFile(API.tags_template, '?project_id=' + id);
        }
    }).on("click", ".market", function () {
        apply_cycle_id = $(this).parents('tr').data('id');
        apply_turn_number = $(this).data('turn');
        getWindow('dialog01');
    }).on('click','[data-waitui]',function(){

        hideDialog('dialog01');

        var cl = $('#usecase .select-block a');

        if(apply_turn_number>80){
            $(cl[0]).find('em').html('匹配用户 ' + parseInt(apply_turn_number*(0.18/2+0.5)));
            $(cl[1]).find('em').html('匹配用户 ' + parseInt(apply_turn_number*(0.15/2+0.5)));
            $(cl[2]).find('em').html('匹配用户 ' + parseInt(apply_turn_number*(0.195/2+0.5)));
            $(cl[3]).find('em').html('匹配用户 ' + parseInt(apply_turn_number*(0.42/2+0.5)));
            $(cl[4]).find('em').html('匹配用户 ' + parseInt(apply_turn_number*(0.24/2+0.5)));
            $(cl[5]).find('em').html('匹配用户 ' + parseInt(apply_turn_number*(0.24/2+0.5)));
        }else{
            for(var i=0;i<cl.length;i++){
                $(cl[i]).find('em').html('匹配用户 ' + random(apply_turn_number));
            }
        }
        getWindow('usecase');


    }).on('click','#usecase .select-block a',function(){
        $(this).siblings('a').removeClass('active');
        $(this).addClass('active');
    }).on('click','#usecase .red',function(){
        hideDialog('usecase');
    }).on('click','[data-downdata]',function(){
        downFile(API.tags_downloaddata,'?id=' + apply_cycle_id);
        if($('tr[data-id="'+ apply_cycle_id +'"] [data-upback]').data('upback')<0){
            $('tr[data-id="'+ apply_cycle_id +'"] [data-upback]').data('upback',apply_cycle_id);
            initUploadBtn($('tr[data-id="'+ apply_cycle_id +'"] [data-upback]')[0],apply_cycle_id);
        }
        hideDialog('dialog01');
    }).on('click','[data-downupback]',function(data){
        apply_cycle_id = $(this).parents('tr').data('id');
        downFile(API.tags_feedbackdata,'?id=' + apply_cycle_id);
    }).on('click','[data-alert]',function(){
        ark.alert($(this).data('alert'));
    });;


    //项目每期预览表格
    getData();
    function getData(){
        majax({
            url: API.tags_list,
            data: {
                project_id: getQuery('id'),
                type: 'cyclelist'
            },
            success: function (data) {
                if (data.code == 200) {
                    var data = data.detail;
                    var user = ark.getUserInfo();
                    var isAdmin = false;
                    if (user.type == 1 && user.id != data.user_id) {
                        isAdmin = 1;
                    }
                    if (!data.all.level || data.all.level.length == 0) {
                        data.all.level = [];
                        for (var i in data.level) {
                            data.all.level.push('');
                        }
                    }
                    var levelData = data.level.map(function(d){
                        var item = {};
                        item.level = d;
                        if(d.length>5){
                        	item.shortLevel = d.slice(0,5) + '...';                        	
                        }else{
                        	item.shortLevel = d;                        	                        	
                        }
                        return item;
                    });
                    for (var i=0;i<data.list.length;i++) {
                    	if(data.list[i].upload_status){
                    		data.head.upload_status = 1;
                    		break;
                    	}else{
                    		data.head.upload_status = 0;                    		
                    	}
                    }
                    if(data.list.length % 2 == 0){
                        data.all.bg = false;
                    }else{
                        data.all.bg = true;
                    }
                    $('.breadcrumb li:last span').html(data.project.name);  //面包屑
                    $('.title-bar').html(template('title-bar', {
                        project: data.project,
                        user_id: data.user_id,
                        user_name:data.user_name,
                        isAdmin: isAdmin,
                        cycle: data.head
                    }));
                    $('.case-table').html(template('case-table', {
                        level: levelData,
                        isAdmin: isAdmin,
                        list: data.list,
                        all: data.all
                    }));

                    //上传初始化
                    var clt = $('[data-upback]');
                    var uploader = [];
                    for (var i = 0; i < clt.length; i++) {
                        if($(clt[i]).data('upback')==-1) {
                            $(clt[i]).on('click', function () {
                                ark.alert('请下载人群，再进行上传反馈操作');
                            });
                        }else{
                            var pid = getQuery('id');
                            var id = $(clt[i]).data('upback');
                            var session = getCookie('MLG');
                            uploader[i] = new plupload.Uploader({
                                browse_button: clt[i],
                                url: API.tags_upload,
                                flash_swf_url: '/js/lib/Moxie.swf',
                                multi_selection: false,
                                headers: {
                                    "api-token": session
                                },
                                multipart_params: {
                                    "id": id ? id : '',
                                    "project_id": pid ? pid : '',
                                    "api-token": session
                                },
                                filters: {
                                    mime_types: [
                                        {title: "TXT files", extensions: 'xls,xlsx'}
                                    ]
                                }
                            });
                            uploader[i].init();
                            uploader[i].bind('FilesAdded', function (uploader, file) {
                                getWindow('loading');
                                uploader.start();
                            });
                            uploader[i].bind('Error',function(uploader,err){
                                hideDialog('loading');
                                $('#selectNewCrowdBtn').parent().next('.error').remove();
                                if(err.code==-601){
                                    var msg = '文件格式有误，请重新上传xls,xlsx格式文件';
                                }else{
                                    var msg = err.message;
                                }
                                ark.alert(msg);
                            });
                            uploader[i].bind('FileUploaded', function (uploader, file, result) {
                                hideDialog('loading');
                                var fileData = JSON.parse(result.response.substr(0,result.response.length-1));
                                if (fileData.code == 200) {
                                    window.location.reload();
                                }else if(fileData.code==207){
                                    var data = fileData;
                                    var phone = [],level = [],pl = [];
                                    for(var i in data.detail){
                                        var d = data.detail[i];
                                        console.log(d);
                                        if(d.phone&& d.level){
                                            pl.push(i);
                                        }else{
                                            if(d.phone){
                                                phone.push(i);
                                            }
                                            if(d.level){
                                                level.push(i);
                                            }
                                        }
                                    }
                                    upErrorAlert(phone,level,pl);
                                }else{
                                    ark.alert(fileData.message);
                                }
                            });
                        }
                    }
                }else if(data.code == 210){
                    ark.pageForbidden();
                }else{
                    ark.pageNotFound();
                }
            }
        });
    }


    //项目每期预览页面折线图
    majax({
        url: '/php/tags/lineharts',
        data: {
            project_id: getQuery('id')
        },
        success: function (data) {
            if (data.code == 200) {
                if (data.detail.change_score) {
                    lineChart(data.detail);
                } else {
                    $('.line-chart').hide();
                }
            }
        }
    });

    function lineChart(data) {
        if (!data) return false;
        var itemArr = [], legend = [];
        var lineColor = ['#E94D6A', '#09A88D', '#398AD6', '#B84BC8', '#CC855A'];
        var lineSybol = ['ring-red.png', 'ring-green.png', 'ring-blue.png', 'ring-violet.png', 'ring-brown.png'];

        for (var i = 0; i < data.ciclyName.length; i++) {
            var ob = {
                type: 'line',
                symbolSize: 9,
                symbol: 'image://' + STATIC + '../img/' + lineSybol[i],
                smooth: true,
                lineStyle: {
                    normal: {
                        color: lineColor[i]
                    }
                },
                name: data.ciclyName[i],
                connectNulls: false,
                data: []
            };
            for (var j = 0; j < data.change_score.length; j++) {
                ob.data.push(data.change_score[j][i]);
            }
            itemArr.push(ob);
            legend.push({
                id: i,
                color: lineColor[i],
                name: data.ciclyName[i].slice(0, 5),
                title: data.ciclyName[i]
            });
        }

        $('.line-legend-item').replaceWith(template('legend', {legend: legend}));

        var myChart = echarts.init(document.getElementById('cutline'));
        var option = {
            xAxis: {
                name: "周期",
                type: 'category',
                boundaryGap: false,
                data: data.date,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#60597C'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#60597C'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            tooltip : {
                show: true,
                formatter: '{b0}<br />{a0}：{c0}%'
            },
            yAxis: [
                {
                    name: "转化率",
                    nameTextStyle: {
                        color: '#8E87A5',
                        fontSize: '14'
                    },
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            color: '#60597C'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0)', '#3F3D66']
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#60597C'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: '{value} %'
                    }
                }
            ],
            grid: {
                left: '3%',
                right: '5%',
                containLabel: true
            },
            series: itemArr
        };
        myChart.setOption(option);
    }



    function initUploadBtn(btn,id){
        console.log($(btn));
        $(btn).off('click');
        var pid = getQuery('id');
        var session = getCookie('MLG');
        var uploader = new plupload.Uploader({
            browse_button: btn,
            url: API.tags_upload,
            flash_swf_url: '/js/lib/Moxie.swf',
            multi_selection: false,
            headers: {
                "api-token": session
            },
            multipart_params: {
                "id": id ? id : '',
                "project_id": pid ? pid : '',
                "api-token": session
            },
            filters: {
                mime_types: [
                    {title: "TXT files", extensions: 'xls,xlsx'}
                ]
            }
        });
        uploader.init();
        uploader.bind('FilesAdded', function (uploader, file) {
            getWindow('loading');
            uploader.start();
        });
        uploader.bind('Error',function(uploader,err){
            hideDialog('loading');
            $('#selectNewCrowdBtn').parent().next('.error').remove();
            if(err.code==-601){
                var msg = '文件格式有误，请重新上传xls,xlsx格式文件';
            }else{
                var msg = err.message;
            }
            ark.alert(msg);
        });
        uploader.bind('FileUploaded', function (uploader, file, result) {
            hideDialog('loading');
            var fileData = JSON.parse(result.response.substr(0,result.response.length-1));
            if (fileData.code == 200) {
                window.location.reload();
            }else if(fileData.code==207){
                var data = fileData;
                var phone = [],level = [],pl = [];
                for(var i in data.detail){
                    var d = data.detail[i];
                    if(d.phone&& d.level){
                        pl.push(i);
                    }else{
                        if(d.phone){
                            phone.push(i);
                        }
                        if(d.level){
                            level.push(i);
                        }
                    }
                }
                upErrorAlert(phone,level,pl);
            }else{
                ark.alert(fileData.message);
            }
        });
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
});