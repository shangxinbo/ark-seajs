/**
 * NAME 2016/8/24
 * DATE 2016/8/24
 * AUTHOR shangxinbo
 */

seajs.use([
    STATIC + 'modules/pages',
    STATIC + 'modules/common',
    STATIC + 'lib/handlebars',
    STATIC + 'dialog/popWindow'
], function (pages, ark) {


    var source = $("#list").html();
    var template = Handlebars.compile(source);
    var numEveryPage = 10;
    var currentPage = 1;
    var sou = $("#list1").html();
    var temp = Handlebars.compile(sou);
    var rolePage = 0;

    var edit_tr_id = '';
    var patten = {
        username: /^[a-zA-Z0-9]{6,20}$/,
        nickname: /^[\u4E00-\u9FFFa-zA-Z0-9]{1,20}$/,
        password: /^[a-zA-Z0-9]{8,}$/
    };

    var user = ark.getUserInfo();
    if (user.type == 1) {
        rolePage = 1;
        $('[data-page="2"]').show();
        getData(1);
        $(".page").on("click", "a", function () {
            var prevBtn = $(this).hasClass('prev');
            var nextBtn = $(this).hasClass('next');
            if (prevBtn) {
                getData(currentPage - 1);
                return false;
            }
            if (nextBtn) {
                getData(currentPage + 1);
                return false;
            }
            currentPage = parseInt($(this).text());
            getData(currentPage);
        });
    } else {
        rolePage = 0;
        var html = template({rows: user});
        $('.general-account').html(html);
        $('[data-page="1"]').show();
    }


    $("body").on("click", ".alter", function (event) {
        var username = $(this).parents('tr').find('td:first').html();
        $('#alter input:first').val(username);
        var nickname = $(this).parents('tr').find('td:eq(1)').html();
        $('#alter input:eq(1)').val(nickname);
        var phone = $(this).parents('tr').find('td:eq(3)').html();
        $('#alter input:eq(2)').val(phone);
        var email = $(this).parents('tr').find('td:eq(4)').html();
        $('#alter input:eq(3)').val(email);
        edit_tr_id = $(this).parents('tr').data('id');
        $('#alter input').removeClass('error');
        $('#alter p.error').remove();
        getWindow("alter");

    }).on('click', '#alter a.red', function () {
        var nickname = $("#nickname");
        var phone = $("#phone");
        var email = $("#email");
        var pattenNickname = /^[\u4E00-\u9FFFa-zA-Z0-9]{1,20}$/;
        $('#alter input').removeClass('error');
        $('#alter p.error').remove();
        if (nickname.val().length == 0) {
            nickname.addClass("error").after('<p class="error"><i></i><span>昵称不能为空</span></p>');
            phone.focus();
            return false;
        } else {
            if (nickname.val()) {
                if (!pattenNickname.test($.trim(nickname.val()))) {
                    nickname.addClass('error').after('<p class="error"><i></i><span>昵称可以由中文、字母、数字组合，最长20个字符</span></p>');
                    nickname.focus();
                    return false;
                }
            }
        }
        if (phone.val().length == 0) {
            phone.addClass("error").after('<p class="error"><i></i><span>手机号不能为空</span></p>');
            phone.focus();
            return false;
        } else {
            if (!isRealPhone(phone.val())) {
                phone.addClass("error").after('<p class="error"><i></i><span>无效手机号</span></p>');
                phone.focus();
                return false;
            }
        }
        if ($.trim(email.val())) {
            if (!isEmail(email.val())) {
                email.addClass("error").after('<p class="error"><i></i><span>邮箱地址无效</span></p>');
                email.focus();
                return false;
            }
        } else {
            email.addClass("error").after('<p class="error"><i></i><span>邮箱不能为空</span></p>');
            email.focus();
            return false;
        }
        majax({
            url: API.user_update,
            data: {
                id: edit_tr_id,
                nickname: $.trim(nickname.val()),
                phone: $.trim(phone.val()),
                email: $.trim(email.val())
            },
            success: function (data) {
                if (data.code == 200) {
                    hideDialog("alter");
                    if (rolePage) {
                        getData(currentPage);
                        ark.alert('修改成功', function () {
                            getData(currentPage);
                        });

                    } else {
                        window.location.reload();
                    }
                } else {
                    email.next().remove();
                    email.addClass("error").after('<p class="error"><i></i><span>' + data.message + '</span></p>');
                }
            }
        });
    }).on('click', '.resetpass', function () {
        var username = $(this).parents('tr').find('td:first').html();
        $('#resetpass .dialog-header span').html(username);
        edit_tr_id = $(this).parents('tr').data('id');
        $('#resetpass input').val('');
        $('#resetpass input').removeClass('error');
        $('#resetpass p.error').remove();
        getWindow("resetpass");
    }).on('click', '#resetpass a.red', function () {
        var password = $('#reset_password'),
            repeat_password = $('#reset_repeat_password');
        $('#resetpass input').removeClass('error');
        $('#resetpass p.error').remove()
        if ($.trim(password.val())) {
            if (!patten.password.test($.trim(password.val()))) {
                password.addClass("error").after('<p class="error"><i></i><span>密码最少8位，请以数字和字母组合重新输入</span></p>');
                password.focus();
                return false;
            }
        } else {
            password.addClass("error").after('<p class="error"><i></i><span>密码最少8位，请以数字和字母组合重新输入</span></p>');
            password.focus();
            return false;
        }
        if ($.trim(repeat_password.val())) {
            if (!patten.password.test($.trim(repeat_password.val()))) {
                repeat_password.addClass("error").after('<p class="error"><i></i><span>确认密码与新密码不符，请重新输入</span></p>');
                repeat_password.focus();
                return false;
            } else {
                if (repeat_password.val() != password.val()) {
                    repeat_password.addClass("error").after('<p class="error"><i></i><span>确认密码与新密码不符，请重新输入</span></p>');
                    repeat_password.focus();
                    return false;
                }
            }
        } else {
            repeat_password.addClass("error").after('<p class="error"><i></i><span>确认密码与新密码不符，请重新输入</span></p>');
            repeat_password.focus();
            return false;
        }
        majax({
            url: API.user_password,
            type: "post",
            dataType: "json",
            data: {
                id: edit_tr_id,
                old_password: '',
                password: $.trim(password.val()),
                confirmed_password: $.trim(repeat_password.val())
            },
            success: function (data) {
                if (data.code == 200) {
                    hideDialog("resetpass");
                    ark.alert('重置成功', function () {
                        getData(currentPage);
                    });
                } else {
                    repeat_password.addClass("error").after('<p class="error"><i></i><span>' + data.message + '</span></p>');
                }
            }
        })

    }).on('click', '.state', function () {
        var status = $(this).html();
        edit_tr_id = $(this).parents('tr').data('id');
        uname = $(this).parents('tr').find('td:first').html();
        if (status == '启用') {
            ark.confirm('是否启用该用户', function () {
                majax({
                    url: API.user_disable,
                    type: "post",
                    dataType: "json",
                    data: {
                        id: edit_tr_id,
                        status: 1
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
                })
            });

        }
        if (status == '禁用') {
            ark.confirm('确定要禁用' + uname + '的账号吗？', function () {
                majax({
                    url: API.user_disable,
                    type: "post",
                    dataType: "json",
                    data: {
                        id: edit_tr_id,
                        status: 0
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
                })
            });
        }
    }).on('click', '.delete', function () {
        edit_tr_id = $(this).parents('tr').data('id');
        var username = $(this).parents('tr').find('td:first').html();
        ark.confirm('确定要删除' + username + '的账号吗？', function () {
            majax({
                url: API.user_delete,
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
            })
        });
    }).on('click', '#adduser', function () {
        $('#addusers input').val('');
        $('#addusers input').removeClass('error');
        $('#addusers p.error').remove();
        //重置加密
        getWindow('addusers');
    }).on('click','#secret p',function(event){
        $('#secret').addClass('select-open');
        event.stopPropagation();
    }).on('click','#secret li',function(){
        $('#secret p').data('type',$(this).data('type'));
        $('#secret p').html($(this).html());
        $('#secret').removeClass('select-open');
    }).on('click',function(){
        $('#secret').removeClass('select-open');
    }).on('click', '#addusers a.red', function () {
        var username = $('#addusers input[name="username"]'),
            nickname = $('#addusers input[name="nickname"]'),
            phone = $('#addusers input[name="phone"]'),
            email = $('#addusers input[name="email"]'),
            password = $('#addusers input[name="password"]'),
            repassword = $('#addusers input[name="repassword"]'),
            type = $('#secret p').data('type');
        $("#addusers p.error").remove();
        $("input").removeClass("error");
        var patten = {
            username: /^[a-zA-Z0-9]{6,20}$/,
            nickname: /^[\u4E00-\u9FFFa-zA-Z0-9]{1,20}$/,
            password: /^[a-zA-Z0-9]{8,}$/
        };
        if ($.trim(username.val())) {
            if (!patten.username.test($.trim(username.val()))) {
                username.addClass("error").next().after('<p class="error"><i></i><span>用户名是字母、数字，长度在6~20个字符</span></p>');
                username.focus();
                return false;
            }
        } else {
            username.addClass("error").next().after('<p class="error"><i></i><span>用户名不能为空</span></p>');
            username.focus();
            return false;
        }
        if ($.trim(nickname.val())) {
            if (!patten.nickname.test($.trim(nickname.val()))) {
                nickname.addClass("error").after('<p class="error"><i></i><span>昵称可以由中文、字母、数字组合，最长20个字符</span></p>');
                nickname.focus();
                return false;
            }
        }
        else {
            nickname.addClass("error").after('<p class="error"><i></i><span>昵称不能为空</span></p>');
            nickname.focus();
            return false;
        }
        if ($.trim(phone.val())) {
            if (!isRealPhone(phone.val())) {
                phone.addClass("error").after('<p class="error"><i></i><span>无效手机号</span></p>');
                phone.focus();
                return false;
            }
        } else {
            phone.addClass("error").after('<p class="error"><i></i><span>手机号不能为空</span></p>');
            phone.focus();
            return false;
        }

        if ($.trim(email.val())) {
            if (!isEmail(email.val())) {
                email.addClass("error").after('<p class="error"><i></i><span>邮箱地址无效</span></p>');
                email.focus();
                return false;
            }
        } else {
            email.addClass("error").after('<p class="error"><i></i><span>邮箱不能为空</span></p>');
            email.focus();
            return false;
        }

        if ($.trim(password.val())) {
            if (!patten.password.test($.trim(password.val()))) {
                password.addClass("error").after('<p class="error"><i></i><span>密码是字母数字组合长度不小于8</span></p>');
                password.focus();
                return false;
            } else {
                if (repassword.val() != password.val()) {
                    repassword.addClass("error").after('<p class="error"><i></i><span>前后两次密码不一致</span></p>');
                    repassword.focus();
                    return false;
                }
            }
        } else {
            password.addClass("error").after('<p class="error"><i></i><span>密码不能为空</span></p>');
            password.focus();
            return false;
        }
        majax({
            url: API.register,
            data: {
                username: $.trim(username.val()),
                nickname: $.trim(nickname.val()),
                password: $.trim(password.val()),
                confirmed_password: $.trim(repassword.val()),
                phone: $.trim(phone.val()),
                email: $.trim(email.val()),
                status: 1,
                type: type
            },
            success: function (data) {
                if (data.code == 200) {
                    hideDialog("addusers");
                    ark.alert('已成功添加账户', function () {
                        getData(currentPage);
                    });
                } else {
                    repassword.addClass("error").after('<p class="error"><i></i><span>' + data.message + '</span></p>');
                }
            }
        })
    });

    $("body").on('click', '.resetpwd', function () {
        $('#user_resetpass input').val('');
        $('#user_resetpass input').removeClass('error');
        $('#user_resetpass p.error').remove();
        getWindow("user_resetpass");
        var user = ark.getUserInfo();
        var str = user.username;
        $("#user_resetpass .dialog-header").html('<h4>重置<span>' + str + '</span>的密码</h4>');
        edit_tr_id = $(this).parents('.general-button').siblings('table').find('tr:first').data('id');
    }).on('click', '#user_resetpass a.red', function () {
        var password = $('#user_reset_password'),
            oldpsw = $('#user_password'),
            repeat_password = $('#user_reset_repeat_password');
        $('#user_resetpass input').removeClass('error');
        $('#user_resetpass p.error').remove();
        if ($.trim(oldpsw.val())) {
            if (!patten.password.test($.trim(oldpsw.val()))) {
                oldpsw.addClass("error").after('<p class="error"><i></i><span>旧密码错误，请重新输入</span></p>');
                oldpsw.focus();
                return false;
            }
        } else {
            oldpsw.addClass("error").after('<p class="error"><i></i><span>旧密码错误，请重新输入</span></p>');
            oldpsw.focus();
            return false;
        }
        if ($.trim(password.val())) {
            if (!patten.password.test($.trim(password.val()))) {
                password.addClass("error").after('<p class="error"><i></i><span>密码最少8位，请以数字和字母组合重新输入</span></p>');
                password.focus();
                return false;
            }
        } else {
            password.addClass("error").after('<p class="error"><i></i><span>密码最少8位，请以数字和字母组合重新输入</span></p>');
            password.focus();
            return false;
        }
        if ($.trim(repeat_password.val())) {
            if (!patten.password.test($.trim(repeat_password.val()))) {
                repeat_password.addClass("error").after('<p class="error"><i></i><span>确认密码与新密码不符，请重新输入</span></p>');
                repeat_password.focus();
                return false;
            } else {
                if (repeat_password.val() != password.val()) {
                    repeat_password.addClass("error").after('<p class="error"><i></i><span>确认密码与新密码不符，请重新输入</span></p>');
                    repeat_password.focus();
                    return false;
                }
            }
        } else {
            repeat_password.addClass("error").after('<p class="error"><i></i><span>确认密码与新密码不符，请重新输入</span></p>');
            repeat_password.focus();
            return false;
        }

        majax({
            url: API.user_password,
            data: {
                id: edit_tr_id,
                old_password: $.trim(oldpsw.val()),
                password: $.trim(password.val()),
                confirmed_password: $.trim(repeat_password.val())
            },
            success: function (data) {
                if (data.code == 200) {
                    hideDialog("user_resetpass");
                    ark.alert('重置成功', function () {
                        ark.logout();
                    })
                } else {
                    $("#user_reset_repeat_password+p").remove();
                    repeat_password.addClass("error").after('<p class="error"><i></i><span>' + data.message + '</span></p>');
                }
            }
        });
    }).on('click', '.edit_myinfo', function () {
        var username = $(this).parents('.general-button').siblings('table').find('tr:first').find('td').html();
        $('#useralter input:first').val(username);
        var nickname = $(this).parents('.general-button').siblings('table').find('tr:eq(1)').find('td').html();
        $('#useralter input:eq(1)').val(nickname);
        var phone = $(this).parents('.general-button').siblings('table').find('tr:eq(2)').find('td').html();
        $('#useralter input:eq(2)').val(phone);
        var email = $(this).parents('.general-button').siblings('table').find('tr:eq(3)').find('td').html();
        $('#useralter input:eq(3)').val(email);
        edit_tr_id = $(this).parents('.general-button').siblings('table').find('tr:first').data('id');
        $('#useralter input').removeClass('error');
        $('#useralter p.error').remove();
        getWindow("useralter");
    }).on('click', '#useralter .red', function () {
        var nickname = $("#usernickname");
        var phone = $("#userphone");
        var email = $("#useremail");
        var pattenNickname = /^[\u4E00-\u9FFFa-zA-Z0-9]{1,20}$/;
        $('#useralter input').removeClass('error');
        $('#useralter p.error').remove();
        if (nickname.val()) {
            if (!pattenNickname.test($.trim(nickname.val()))) {
                nickname.addClass('error').after('<p class="error"><i></i><span>昵称可以由中文、字母、数字组合，最长20个字符</span></p>');
                nickname.focus();
                return false;
            }
        } else {
            nickname.addClass("error").after('<p class="error"><i></i><span>昵称不能为空</span></p>');
            nickname.focus();
            return false;
        }

        if (phone.val().length == 0) {
            phone.addClass("error").after('<p class="error"><i></i><span>手机号不能为空</span></p>');
            phone.focus();
            return false;
        } else {
            if (!isRealPhone(phone.val())) {
                phone.addClass("error").after('<p class="error"><i></i><span>无效手机号</span></p>');
                phone.focus();
                return false;
            }
        }

        if (email.val().length == 0) {
            email.addClass("error").after('<p class="error"><i></i><span>邮箱不能为空</span></p>');
            email.focus();
            return false;
        } else {
            if (!isEmail(email.val())) {
                email.addClass("error").after('<p class="error"><i></i><span>邮箱地址无效</span></p>');
                email.focus();
                return false;
            }
        }
        majax({
            url: API.user_update,
            data: {
                id: edit_tr_id,
                email: $.trim(email.val()),
                phone: $.trim(phone.val()),
                nickname: $.trim(nickname.val())
            },
            success: function (data) {
                //console.log(1);
                if (data.code == 200) {
                    //console.log(123123);
                    hideDialog("useralter");
                    ark.alert('修改成功', function () {
                        majax({
                            url: API.get_user_info,
                            success: function (data) {
                                if (data["code"] == 200) {
                                    if (data.detail.user) {
                                        var user = data.detail.user;
                                        user.code = generateUserCode(user);
                                        console.log(user);
                                        setCookie('user', JSON.stringify(user));
                                    }
                                }
                                window.location.reload();
                            }
                        });
                    })
                    //if (rolePage) {
                    //    getData(currentPage);
                    //} else {
                    //    window.location.reload();
                    //}
                } else {
                    console.log(data.message);
                }
            }
        });
    });

    //重载页面
    function getData(page) {
        majax({
            url: API.user_list,
            type: 'post',
            dataType: "json",
            data: {
                page: page,
                rows: numEveryPage
            },
            success: function (data) {
                //解析用户列表数据
                currentPage = page;
                var datas = data.detail.users;
                if (typeof(datas) !== 'undefined') {
                    var rows = data.detail.users.data;
                    if (typeof(rows) !== 'undefined') {
                        for (var i = 0; i < rows.length; i++) {
                            var tagStr = '';
                            var str = '';
                            var state = '';
                            if (data.detail.users.data[i].status == 1) {
                                tagStr += '有效';
                                str += '禁用';
                            } else {
                                tagStr += '无效';
                                str += '启用';
                            }
                            data.detail.users.data[i].status = tagStr;
                            data.detail.users.data[i].str = str;
                            data.detail.users.data[i].state = str;
                        }
                        for(var i=0;i<data.detail.users.data.length;i++){
                            var ss = data.detail.users.data[i].type;
                            switch (ss){
                                case 0: data.detail.users.data[i].usertype='数据分析师';break;
                                case 1: data.detail.users.data[i].usertype='超级管理员';break;
                                case 2: data.detail.users.data[i].usertype='普通用户';break;
                                case 3: data.detail.users.data[i].usertype='普通用户';break;
                                case 4: data.detail.users.data[i].usertype='存量客户';break;
                                case 5: data.detail.users.data[i].usertype='后台管理员';break;
                                default: data.detail.users.data[i].usertype='普通用户';
                            }
                        }
                        var html = temp({rows: data.detail.users.data});
                        $('.com-table').html(html);
                        var state = $(".com-table tr");
                        //var a =$(".status");
                        state.each(function () {
                            if ($(this).find("td:eq(5)").html() == "无效") {
                                $(this).addClass("disable");
                            }
                        })
                        var total = data.detail.users.total;
                        var nums = Math.ceil(total / numEveryPage);
                        $(".page").html(pages(currentPage, nums));
                        $('[data-page="' + currentPage + '"]').addClass('active');
                    }
                    //列表隔行变色
                    $('.com-table tr:odd').css('background', '#222249');
                    //页码

                }
            }
        });
    }

});
