/**
 * NAME 2016/8/22
 * DATE 2016/8/22
 * AUTHOR shangxinbo
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
            url: API.upload_list,
            data: {
                page: page,
                rows: numEveryPage
            },
            success: function (data) {
                if(data.code==200){
                    currentPage = page;
                    var rows = data.detail.rows;
                    if(typeof(rows)!=='undefined'){
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

    $('body').on('click', '.edit a', function () {
        var _this = $(this);
        ark.confirm('是否删除该条记录',function(){
            var id = _this.parents('tr').data('id');
            majax({
                url: API.upload_delete,
                data: {
                    id: id
                },
                success: function (data) {
                    if (data.code == 200) {
                        getData(currentPage);
                    }else{
                        hideDialog("confirm");
                        ark.alert(data.message);
                    }
                }
            });
        })
    });
});