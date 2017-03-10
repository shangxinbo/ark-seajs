/**
 * NAME 2016/8/16
 * DATE 2016/8/16
 * AUTHOR shangxinbo
 */

define([
    STATIC + 'lib/handlebars',
    STATIC + 'modules/functions',
    STATIC + 'lib/template'
], function (require, exports, module) {

    var template = require(STATIC + 'lib/template');

    module.exports = {
        alert: function (text, callback) {
            var dialog = $('#alert.dialog'),
                content = dialog.find('.dialog-body');
            content.find('h5').css({ "height": "auto" });

            text = text ? text : '';
            content.find('span').html(text);
            dialog.off('click');
            dialog.on('click', '.dialog-footer a', function (event) {
                hideDialog('alert');
                if (callback) {
                    callback();
                }
            }).on('click', '.dialog-close', function (event) {
                hideDialog('alert');
            })
            getWindow('alert');
        },
        confirm: function (text, callback, param) {
            var dialog = $('#confirm.dialog'),
                content = dialog.find('.dialog-body');

            text = text ? text : '';
            content.find('span').html(text);
            dialog.off('click');
            dialog.on('click', '.dialog-footer a', function (event) {
                hideDialog('confirm');
                if ($(this).hasClass('red')) {
                    if (callback) {
                        if (param) {
                            callback(param);
                        } else {
                            callback();
                        }

                    }
                }
            }).on('click', '.dialog-close', function (event) {
                hideDialog('confirm');
            })
            getWindow('confirm');
        },
        alertErr: function (text, callback) {
            var dialog = $('#errorAlert.dialog'),
                $content = dialog.find('.dialog-data-error');
            text = text ? text : '';
            $content.html(text);
            dialog.off('click');
            dialog.on('click', '.dialog-footer a', function (event) {
                hideDialog('errorAlert');
                if (callback) {
                    callback();
                }
            }).on('click', '.dialog-close', function (event) {
                hideDialog('errorAlert');
            })
            getWindow('errorAlert');
        },
        getUserInfo: function () {
            var user = JSON.parse(getCookie('user'));
            if (user) {
                var code = generateUserCode(user);
                if (user.code && user.code == code) {
                    return user;
                } else {
                    module.exports.logout();
                }
            } else {
                module.exports.logout();
            }
        },
        logout: function () {
            majax({
                url: API.logout,
                success: function (data) {
                    if (data.code == 200) {
                        clearSessionStorageVal();
                        delCookie('MLG'); delCookie('user');
                        window.location.href = "/login.html";
                    }
                }
            });
        },
        pageNotFound: function () {
            $('body').html(template('404', { title: "404", context: "很抱歉，找不到页面了" }));
        },
        pageForbidden: function () {
            $('body').html(template('404', { title: "403", context: "很抱歉，您没有访问该页面的权限"}));
        },
        serverError: function () {
            $('body').html(template('404', { title: "500", context: "糟糕了，服务器内部错误" }));
        },
        renderDom: function (jqObj, data) {
            var tpl = jqObj.html();
            var handle = Handlebars.compile(tpl);
            var dom = handle(data);
            return dom;
        },
        dissectFilters: function (obj) {
            if (obj) {
                var tags = { "tagcode": obj.tagcode, "fixedpros": obj.fixedpros ? obj.fixedpros : null };
                var cuModel = obj.cuModel;
                var file = obj.file;
                if (tags.tagcode != null || tags.fixedPros != null) {
                    saveSelectedInSessionStorage('tags', tags);
                } else {
                    removeSessionStorageVal('tags');
                }
                if (cuModel != null) {
                    saveSelectedInSessionStorage('ucmodel', cuModel);
                } else {
                    removeSessionStorageVal('ucmodel');
                }
                if (file.id != null && file.name != null) {
                    saveSelectedInSessionStorage('crowd', file);
                } else {
                    removeSessionStorageVal('crowd');
                }
            }
        }
    };

    //退出
    $(".header .quit [data-quit]").on("click", function () {
        module.exports.logout();
    });
    //用户信息初始化
    var user = module.exports.getUserInfo();
    if (user) {
        var str = "Hi，" + user.username;
        $(".header-content p").text(str);
    }

    //头部导航交互
    $('body').on('click', function () {
        $(".header-content li").removeClass("li-hover");
    }).on('click', ".header-content li>i", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(".header-content li").removeClass("li-hover");
        $(this).parent().addClass("li-hover");
    }).on('click', '.clearStorage', function () {
        clearSessionStorageVal();
    });

    //未读消息
    majax({
        url: API.message_count,
        success: function (data) {
            if (data["code"] == 200) {
                if (data.detail.count > 0) {
                    $(".header-content .news-icon").html('<span class="icon"></span><em>' + data.detail.count + '</em>');
                }
            }
        }
    });
    
});
