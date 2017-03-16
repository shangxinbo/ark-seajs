/**
 * Created by Administrator on 2016/9/2.
 */
/**
 * NAME 2016/8/24
 * DATE 2016/8/24
 * AUTHOR shangxinbo
 */

seajs.use([
    'modules/pages',
    'modules/common',
    'dialog/popWindow'
], function (pages, ark) {
    var source = $("#list").html();
    var template = Handlebars.compile(source);
    var numEveryPage = 10;
    var currentPage = 1;
    var edit_tr_id = '';
    majax({
        url:API.message_read,
        data: {},
        success:function(data){
            if(data.code == 200){
                $('.header-content .news-icon').html('');
            }
        }
    });

    getData(currentPage);
    function getData(page) {
        majax({
            url:API.message_list,
            data: {
                page: page,
                rows: numEveryPage
            },
            success: function (data) {
                //解析用户列表数据
                if(data.code==200){
                    currentPage = page;
                    if(data.detail.messages && data.detail.messages.data&&data.detail.messages.data.length>0) {
                        var rows = data.detail.messages.data;
                        var total = data.detail.messages.total;
                        var html = template({rows: rows});
                        $('#com-table').html(html);
                        $('.com-table tr:odd').addClass('bg');
                        var nums = Math.ceil(total / numEveryPage);
                        $(".page").html(pages(currentPage, nums));
                        $('[data-page="' + currentPage + '"]').addClass('active');
                    }else{
                        $('#com-table').html('<div class="com-table-null">暂无数据</div>');
                    }
                }else{
                    ark.alert(data.message);
                }
            }
        });
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

    $("body").on('click', '.delete', function () {
        edit_tr_id = $(this).parents('tr').data('id');
        ark.confirm('是否要删除该条消息',function(){
            majax({
                url: API.message_delete,
                data: {
                    id: edit_tr_id
                },
                success: function (data) {
                    if (data.code == 200) {
                        hideDialog("confirm");
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
