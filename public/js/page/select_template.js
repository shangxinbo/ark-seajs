seajs.use([
    'modules/common',
    'lib/scrollBar',
    'dialog/popWindow'
], function (ark) {
    var id = getQuery("id");
    var type = getQuery('type');
    $(".create").click(function () {
        if (type == 'stock') {
            location.href = "/project/create-feedback.html?id=" + id + '&source=create&type=stock';
        }else{
            location.href = "/project/create-feedback.html?id=" + id + '&source=create';
        }

    })

    var projectId = getQuery('id');
    var projectName = getQuery('project_name');
    $('.breadcrumb li:last span').html(removeHTMLTag(projectName));
    $('.title-bar h2').html(removeHTMLTag(projectName));
});