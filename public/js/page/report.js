/**
 * NAME 2016/8/9
 * DATE 2016/8/9
 * AUTHOR shangxinbo
 */

seajs.use([
    'modules/common',
    'modules/report',
    'dialog/popWindow',
    'lib/template'
], function (ark,report,PopWindow,template) {
    var crowd = sessionStorage.getItem('crowd');
    var tags = sessionStorage.getItem('tags');
    var ucmodel = sessionStorage.getItem('ucmodel');
    var baskets = [];
    var param = {
        tagcode: null,
        fixedpros: null,
        group: null,
        file: {
            code: null,
            name: null
        },
        cuModel:null
    };

    //report or analysis
    if (getQuery('ana')) {
        $('.filters').remove();
        $('.center-button').replaceWith(template('buttons',{}));
    }else{

        if (tags) {
            try {
                tags = JSON.parse(tags);
                for (var i = 0; i < tags.tagcode.length; i++) {
                    var text = '', title = '';
                    var item = tags.tagcode[i];
                    for (var j = 0; j < item.length; j++) {
                        title += item[j].text + ' ';
                        if (j < 2) {
                            text += item[j].text + ' ';
                        }
                        if (j == 3) {
                            text += '… ';
                        }
                    }
                    baskets.push({"index": i, "text": text, "title": title});
                }
                param.tagcode = tags.tagcode;
                param.fixedpros = tags.fixedpros;
            } catch (err) {
                ark.alert(err);
            }
        }

        if (crowd) {
            try {
                crowd = JSON.parse(crowd);
                param.file = crowd;
            } catch (err) {
                ark.alert(err);
                crowd = '';
            }
        }

        if(ucmodel){
            try {
                ucmodel = JSON.parse(ucmodel);
                param.cuModel = ucmodel;
            } catch (err) {
                ark.alert(err);
                ucmodule = '';
            }
        }


        //判断是否显示点击筛选
        if(param.fixedpros){
            if (param.fixedpros.area.length > 0 || param.fixedpros.interest.length > 0 || param.fixedpros.sex.length > 0 || param.fixedpros.mobile.length > 0 || param.fixedpros.age.length > 0) {
                var showFilterBtn = '';
            } else {
                if(baskets.length>0){
                    var showFilterBtn = '';
                }else{
                    var showFilterBtn = 1;
                }
            }
        }else{
            if(baskets.length>0){
                var showFilterBtn = '';
            }else{
                var showFilterBtn = 1;
            }
        }

        var context = {
            crowd: crowd,
            baskets: baskets,
            filters: param.fixedpros,
            showFilterBtn: showFilterBtn,
            ucmodel:ucmodel
        };

        $('.filters').html(template('filter_nav',context));

        $('span .delete').on('click', function (event) {
            var ele = $(this).parent();
            if (ele.data('crowdid')) {
                param.file = '';
                sessionStorage.setItem('crowd', '');
            }
            if (ele.data('basketid') || ele.data('basketid') == '0') {
                tags.tagcode.splice(ele.data('basketid'), 1);
                sessionStorage.setItem('tags', JSON.stringify(tags));
            }
            if (ele.data('tagid') || ele.data('tagid') == '0') {
                for (var m in tags.fixedpros) {
                    var item = tags.fixedpros[m];
                    for (var h = 0; h < item.length; h++) {
                        if (item[h].code == ele.data('tagid')) {
                            tags.fixedpros[m].splice(h, 1);
                        }
                    }
                }
                sessionStorage.setItem('tags', JSON.stringify(tags));
            }

            if (ele.data('model')) {
                sessionStorage.setItem('ucmodel', '');
            }
            ele.remove();
            window.location.reload();
        });
        $('i.modify').on('click', function (event) {
            if ($(this).data('href') == 'filter') {
                window.location.href = '/filter/index.html?showpage=1';
            }else if($(this).data('href')=='model'){
                var id = $(this).siblings('span').data('model');
                window.location.href = '/modeling-screening.html?id='+ id;
            }
        });
    }

    getLineData({name: 'default'});

    //get five mapData
    majax({
        url: API.filter_searchdim,
        data: {
            uploadId: param.file.id,
            tags: JSON.stringify(param)
        },
        success: function (data) {
            if(data.code==200){
                if(data.detail.cus_total>0){
                    $('#loading').hide();
                    $('.two-charts-alter').show();
                    $('.two-charts').show();
                    report.sexChart(data.detail.dim_res.sex);
                    report.histogram1(data.detail.dim_res.age, $('.age-distribution'));
                    report.areas(data.detail.dim_res.area);
                    report.histogram2(data.detail.dim_res.mobile, $('#chart-mobile'));
                }else{
                    $('#loading').hide();
                }

                $('.center-button a').show();


                $('.center-button em').html(numberFormatter(data.detail.cus_total)).attr('value',data.detail.cus_total);

                //demo 填充投放数据值
                var cl = $('#usecase .select-block a');

                if(data.detail.cus_total>10){
                    var gr = random(data.detail.cus_total*0.9,data.detail.cus_total*0.8);
                }else{
                    var gr = random(data.detail.cus_total);
                }
                for(var i=0;i<cl.length;i++){
                    if(i==cl.length-2||i==cl.length-1){
                        $(cl[i]).find('em').html('匹配用户 ' + gr);
                    }else{
                        if(data.detail.cus_total>10){
                            $(cl[i]).find('em').html('匹配用户 ' + random(data.detail.cus_total*0.9,data.detail.cus_total*0.8));
                        }else{
                            $(cl[i]).find('em').html('匹配用户 ' + random(data.detail.cus_total));
                        }
                    }
                }

            }else{
                if(data.code==204){
                    ark.alert('<a href="/upload/history/index.html">上传人群</a>-上传文件处理失败',function(){
                        removeSessionStorageVal('crowd');
                        window.location.reload();
                    });
                }else if(data.code==500){
                    ark.serverError();
                }else{
                    ark.alert(data.message);
                }
            }

        }
    });

    function getLineData(group) {
        $('#chart-line').html('<div style="width: 100%;"><img style="display: block;margin: 0 auto; padding-top: 136px;" src="'+ STATIC +'../img/load2.gif" /> </div>');
        majax({
            url: API.filter_searchline,
            data: {
                uploadId: param.file.id ? param.file.id : null,
                tags: JSON.stringify({
                    group: group,
                    tagcode: param.tagcode,
                    fixedpros: param.fixedpros,
                    file: param.file,
                    cuModel:param.cuModel
                })
            },
            success: function (data) {
                if (data.code == 200) {
                    if(data.detail.group_res&&data.detail.group_res.length>0){
                        $('#chart-line div').remove();
                        report.line(data.detail.group_res);
                    }else{
                        $('.line-chart').html('<div class="data-null">暂无数据</div>');
                    }
                }else if(data.code==300){
                    ark.alert('上传人群正在匹配，请稍后尝试刷新查看');
                }else if(data.code==204){
                    ark.alert('<a href="/upload/history/index.html">上传人群</a>-上传文件处理失败',function(){
                        removeSessionStorageVal('crowd');
                        window.location.reload();
                    });
                }else if(data.code==500){
                    ark.serverError();
                }else{
                    ark.alert(data.message);
                }
            }
        });
    }

    //选择折线图类别显示
    $('.select-warp').on('click', 'p', function (event) {
        $(this).parent().toggleClass('select-open');
    }).on('click', 'li', function (event) {
        var group = $(this).data('group');
        var text = $(this).html();
        getLineData({name: group});
        $(this).parent().siblings('p').html(text);
        $(this).parents('.select-warp').removeClass('select-open');
    });


    //保存
    $('body').on('click', '[data-save]', function () {
        if($('.filters-item span').length>0){
            $('#savepeople input').val('');
            $('#savepeople textarea').val('');
            getWindow('savepeople');
        }else{
            ark.alert('筛选条件不能为空');
        }
    }).on('click', '#savepeople .red', function () {
        var cont = $(this).parents('.dialog');
        var name = cont.find('input');
        var text = cont.find('textarea');
        cont.find('p.error').remove().end().find('.error').removeClass('error');
        if ($.trim(name.val())=='') {
            name.addClass('error').after('<p class="error"><i></i><span>名称不能为空</span></p>');
            return false;
        }else{
            var nl = $.trim(name.val());
            if(nl.length>20){
                name.addClass('error').after('<p class="error"><i></i><span>名称超长'+ (nl.length-20) +'字，请重新输入</span></p>');
                return false;
            }
        }
        if ($.trim(text.val())=='') {
            text.addClass('error').after('<p class="error"><i></i><span>描述不能为空</span></p>');
            return false;
        }else{
            var dl = $.trim(text.val());
            if(dl.length>100){
                text.addClass('error').after('<p class="error"><i></i><span>描述超长'+ (dl.length-100) +'字，请重新输入</span></p>');
                return false;
            }
        }

        majax({
            url: API.template_save,
            data: {
                uploadId: param.file.code,
                content: JSON.stringify(param),
                name: $.trim(name.val()),
                desc: $.trim(text.val())
            },
            success: function (data) {
                if (data.code == 200) {
                    hideDialog('savepeople');
                    getWindow('save_result');
                    $('.center-button a:last').attr('href','/project/create-marketing.html').attr('style','');
                } else {
                    text.addClass('error').after('<p class="error"><i></i><span>'+ data.message +'</span></p>');
                }
            }
        })

    }).on('click', '[data-down]', function () {
        var amount = parseInt($('.center-button em').attr('value'));
        if(amount>100000){
            ark.alert('目前只支持客户规模10万以下数据下载，您下载的数据可能不是全部',function(){
                downloadStart();
            })
        }else{
            downloadStart();
        }
        function downloadStart(){
            majax({
                url: '/data/filter/generate',
                data: {
                    uploadId: param.file.code ? param.file.code : null,
                    tags: JSON.stringify(param)
                },
                success: function (data) {
                    if (data.code == 200) {
                        window.open('/filter/download?file=' + data.detail);
                    } else {
                        ark.alert(data.message);
                    }
                }
            });
        }
    }).on('click', '#save_result .red', function () {
        hideDialog('save_result');
    }).on('click','[data-api="1"]',function(){
        $('#api').find('input,textarea').val('');
        $('#api').find('.select-block').find('a').removeClass('active').filter(':first').addClass('active');
        getWindow('api');
    }).on('click','#api .select-block>a,#usecase .select-block>a',function(){
        $(this).toggleClass('active');
    }).on('click','#api .red',function(){
        hideDialog('api');
    }).on('click','[data-usecase="1"]',function(){
        $('#usecase').find('input,textarea').val('');
        $('#usecase').find('.select-block').find('a').removeClass('active').filter(':first').addClass('active');
        getWindow('usecase');
    }).on('click','#usecase .red',function(){
        hideDialog('usecase');
    }).on('click','#filterHistory .dialog-footer>a.red',function(){
        var sel = $('#filterHistory .checked');
        if (sel.length > 0) {
            var content = sel.parents('tr').data('content');
            ark.dissectFilters(content);
            window.location.href = '/report.html';
        }
    })/*.on('click','.filters-item.second span',function(event){
        var type = 0;
        if($(this).data('tagid')||$(this).data('tagid')==0){
            type=1;
        }
        if(type>0){
            window.location.href = '/filter/index.html?showpage=2';
        }else{
            window.location.href = '/filter/index.html?showpage=1';
        }
    })*/;




});