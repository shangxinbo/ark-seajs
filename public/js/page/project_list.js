seajs.use([
    STATIC + 'modules/common',
    STATIC + 'lib/template',
    STATIC + 'modules/pages',
    STATIC + 'dialog/popWindow'
], function (ark, template, pages) {

    var currentPage = 1
    var pageEvery = 10
    var keywords = ''
    var stock = location.pathname.indexOf('list_stock') >= 0 ? 'stock' : 'new'

    template.config('escape', false)

    function getData(page) {
        majax({
            url: API.project_stock_list,
            data: {
                page: page,
                nums: pageEvery,
                keyword: keywords,
                type: stock
            },
            success: function (data) {
                currentPage = page
                if (data["code"] == 200) {
                    var html = template('list', {
                        keywords: keywords,
                        data: data.detail.project.data,
                        total: data.detail.total,
                        pages: pages(page, Math.ceil(data.detail.project.total / pageEvery))
                    });
                    $('.main').html(html)
                    $('[data-page="' + page + '"]').addClass('active')
                }
            }
        });
    }
    getData(currentPage)

    $('.warp').on('click', '.search span', function () {
        var k = $(this).siblings('input').val()
        if ($.trim(k)) {
            keywords = k
            currentPage = 1
            getData(currentPage)
        } else {
            keywords = ''
            currentPage = 1
            getData(currentPage)
        }
    }).on('click', '.page a', function () {
        var prevBtn = $(this).hasClass('prev')
        var nextBtn = $(this).hasClass('next')
        if (prevBtn) {
            getData(currentPage - 1)
            return false
        }
        if (nextBtn) {
            getData(currentPage + 1)
            return false
        }
        getData(parseInt($(this).text()))
    }).on('click', '[data-down]', function () {
        var id = $(this).data('down')
        downFile(API.tags_downloaddata, '?id=' + id)
        setInterval(function () {
            window.location.reload(true)
        }, 200)

    })

    $('body').on('keydown', function (event) {
        if (event.keyCode == 13) {
            $('.search span').click()
        }
    })

})