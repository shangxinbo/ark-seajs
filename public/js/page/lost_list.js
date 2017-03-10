/**
 * Created by Administrator on 2017/2/17.
 */
seajs.use([
    STATIC + 'modules/pages',
    STATIC + 'modules/common',
    STATIC + 'lib/handlebars',
    STATIC + 'dialog/popWindow'
], function (pages,ark) {
    var source = $("#list").html();
    var template = Handlebars.compile(source);
    var numEveryPage = 10;
    var currentPage = 1;
    var a='';
    var total=0;
    getData(1);
    function getData(page) {
        majax({
            url: API.lostcontactrep_list,
            data: {
                page: page,
                search: a ? a : "",
                rows: numEveryPage
            },
            success: function (data) {
                if(data.code==200){
                    var rows = data.detail.data;
                    total=data.detail.page.total;
                    if(typeof(rows)!=='undefined'){
                        currentPage = page;
                        if (rows.length > 0) {
                            for(var i = 0; i < rows.length; i++){
                                var tagStr = '';
                                var statu=false;
                                if(rows[i].status==0){
                                    tagStr='未匹配';
                                }else if(rows[i].status==1){
                                    tagStr='正在匹配';
                                }else{
                                    tagStr='匹配成功';
                                    statu=true;
                                }
                               rows[i].stustr=tagStr;
                               rows[i].statu=statu;
                            }
                            var html = template({rows: data.detail.data});
                            $('#com-table').html(html);
                            $('.com-table tr:odd').addClass('bg');
                        }else {
                            $('#com-table').html('<div class="com-table-null">暂无数据</div>');
                        }
                        $(".page").html(pages(currentPage,total));
                        $('[data-page="' + currentPage + '"]').addClass('active');
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

    $('body').on('click','.search span',function(){
        a=$(".search input").val();
        getData(1,a)
    }).on('click', '.edit a', function () {
        var _this = $(this);
        var id = _this.parents('tr').data('id');
        downFile(API.lostcontactrep_download, '?id=' + id);
    }).on('click', 'a.download', function () {
        downFile(API.lostcontactrep_template);
    }).on('keydown', function (event) {
        if (event.keyCode == 13) {
            $('.search span').click()
        }
    });
});