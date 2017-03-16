/**
 * Created by Administrator on 2016/8/22.
 */
seajs.use([
    'modules/pages',
    'modules/common',
    'lib/handlebars',
    'dialog/popWindow'
], function (pages,ark) {
    var source = $("#list").html();
    var template = Handlebars.compile(source);
    var numEveryPage = 10;
    var currentPage = 1;
    getData(1);
    function getData(page) {
        majax({
            url: API.template_list,
            data: {
                page: page,
                rows: numEveryPage
            },
            success: function (data) {
                if(data.code==200){
                    var rows = data.detail.rows;
                    if(typeof(rows)!=='undefined'){
                        currentPage = page;
                        for (var i = 0; i < rows.length; i++) {
                            var tagStr = '';
                            var rowsnum=0;
                            var tagstr='';
                            if(!rows[i]["uploadName"]){  //php数据兼容
                                rows[i]["uploadName"] = rows[i]['name'];
                                rows[i]["uploadDesc"] = rows[i]['desc'];
                            }

                            var item = rows[i];
                            var obj = JSON.parse(item.content);
                            if (obj) {
                                if (obj.file) {
                                    if(obj.file.name!=null) {
                                        tagStr += '上传人群：' + obj.file.name+',';
                                        rowsnum++;
                                        if(rowsnum<11){
                                            tagstr += '上传人群：' + obj.file.name+',';
                                        }
                                    }
                                }
                                if ((obj.tagcode&&obj.tagcode.length>0)||(obj.fixedpros&&(obj.fixedpros.area.length>0||obj.fixedpros.interest.length>0||obj.fixedpros.sex.length>0||obj.fixedpros.mobile.length>0||obj.fixedpros.age.length>0))) {
                                    tagStr += '标签筛选：';
                                    tagstr += '标签筛选：';
                                    if(obj.tagcode!=null){
                                        for (var j = 0; j < obj.tagcode.length; j++) {
                                            var tagcode = obj.tagcode[j];
                                            for (var m = 0; m < tagcode.length; m++) {
                                                tagStr += tagcode[m].text + ', ';
                                                rowsnum++;
                                                if(rowsnum<11){
                                                    tagstr += tagcode[m].text + ', ';
                                                }
                                            }
                                        }
                                    }

                                    if(obj.fixedpros!=null){

                                        if(obj.fixedpros.area.length>0){
                                            tagStr +='地域：';
                                            tagstr +='地域：';
                                            for(var z=0;z<obj.fixedpros.area.length;z++){
                                                tagStr +=obj.fixedpros.area[z].text+',';
                                                rowsnum++;
                                                if(rowsnum<11){
                                                    tagstr +=obj.fixedpros.area[z].text+',';
                                                }
                                            }
                                        }
                                        if(obj.fixedpros.interest.length>0){
                                            tagStr +='兴趣：';
                                            tagstr +='兴趣：';
                                            for(var z=0;z<obj.fixedpros.interest.length;z++){
                                                tagStr +=obj.fixedpros.interest[z].text+',';
                                                rowsnum++;
                                                if(rowsnum<11){
                                                    tagstr +=obj.fixedpros.interest[z].text+',';
                                                }
                                            }
                                        }
                                        if(obj.fixedpros.sex.length>0){
                                            tagStr +='性别：';
                                            tagstr +='性别：';
                                            for(var z=0;z<obj.fixedpros.sex.length;z++){
                                                tagStr +=obj.fixedpros.sex[z].text+',';
                                                rowsnum++;
                                                if(rowsnum<11){
                                                    tagstr +=obj.fixedpros.sex[z].text+',';
                                                }
                                            }
                                        }
                                        if(obj.fixedpros.mobile.length>0){
                                            tagStr +='手机：';
                                            tagstr +='手机：';
                                            for(var z=0;z<obj.fixedpros.mobile.length;z++){
                                                tagStr +=obj.fixedpros.mobile[z].text+',';
                                                rowsnum++;
                                                if(rowsnum<11){
                                                    tagstr +=obj.fixedpros.mobile[z].text+',';
                                                }
                                            }
                                        }
                                        if(obj.fixedpros.age.length>0){
                                            tagStr +='年龄：';
                                            tagstr +='年龄：';
                                            for(var z=0;z<obj.fixedpros.age.length;z++){
                                                tagStr +=obj.fixedpros.age[z].text+',';
                                                rowsnum++;
                                                if(rowsnum<11){
                                                    tagstr +=obj.fixedpros.age[z].text+',';
                                                }
                                            }
                                        }
                                    }
                                }

                                if (obj.cuModel) {
                                    if(obj.cuModel.name!=null){
                                        tagStr += '建模筛选：' + obj.cuModel.name;
                                        rowsnum++;
                                        if(rowsnum<11){
                                            tagstr += '建模筛选：' + obj.cuModel.name;
                                        }
                                    }
                                }
                                if(rowsnum>10){
                                     tagstr +='...';
                                }
                                data.detail.rows[i].tagStr = tagStr;
                                data.detail.rows[i].tagstr = tagstr;

                            }
                        }
                        if (rows.length > 0) {
                            var html = template({rows: data.detail.rows});
                            $('#com-table').html(html);
                            $('.com-table tr:odd').addClass('bg');
                            var total = data.detail.total;
                            var nums = Math.ceil(total / numEveryPage);
                            $(".page").html(pages(currentPage, nums));
                            $('[data-page="' + currentPage + '"]').addClass('active');
                        }else {
                            $('#com-table').html('<div class="com-table-null">暂无数据</div>');
                        }
                    }
                }else{
                    console.log(data.message);
                }
            }
        })
    }

    $(".page").on("click", "a", function () {
        var prevBtn = $(this).hasClass('prev');
        var nextBtn = $(this).hasClass('next');
        if (prevBtn) {
            getData(currentPage-1);
            return false;
        }
        if (nextBtn) {
            getData(currentPage+1);
            return false;
        }
        currentPage = parseInt($(this).text());
        getData(currentPage);
    });

    $('body').on('click','.use',function(){
        var _this = $(this);
        var text = _this.parents('tr').data('text');
        ark.dissectFilters(text);
        location.href='/report.html';
    }).on('click', '.edit .delete', function () {
        var _this = $(this);
        ark.confirm('是否删除该条记录',function() {
            var id = _this.parents('tr').data('id');
            majax({
                url: API.template_delete,
                data: {
                    id: id
                },
                success: function (data) {
                    if (data.code == 200) {
                        getData(currentPage);
                    } else {
                        hideDialog("confirm");
                        ark.alert(data.message);
                    }
                }
            });
        });
    });
});