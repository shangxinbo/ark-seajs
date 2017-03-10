/**
 * NAME 2016/8/22
 * DATE 2016/8/22
 * AUTHOR shangxinbo
 */
seajs.use([], function (ark) {

    $('body').on('keydown', function (e) {
        e=e||event;
        if (e.keyCode == 13)        //回车键的键值为13
            document.getElementById("input1").click();  //调用登录按钮的登录事件
    });

    $('button').on('click', function () {
        var username = document.getElementById("username");
        var pwd = document.getElementById("password");
        var reminder = document.getElementById("reminder");
        if (username.value.length == 0) {
            reminder.innerHTML = "请输入您的用户名!";
            username.focus();
            return false;
        }
        if (pwd.value.length == 0) {
            reminder.innerHTML = "请输入您的密码!";
            reminder.focus();
            return false;
        }
        $.ajax({
            url: API.login,
            type: "post",
            dataType: "json",
            data: {
                username: username.value,
                password: pwd.value
            },
            success: function (data) {
                if (data.code == 200) {
                    if (data.detail && data.detail["api-token"]) {
                        setCookie('MLG',data.detail["api-token"]);
                        majax({
                            url: API.get_user_info,
                            success: function (data) {
                                if (data["code"] == 200) {
                                    if(data.detail.user){
                                        var user = data.detail.user;
                                        user.code = generateUserCode(user);
                                        console.log(user);
                                        setCookie('user',JSON.stringify(user));
                                    }
                                }
                                window.location.href = '/index.html';
                            }
                        });
                    }
                } else {
                    reminder.innerHTML = data.message;
                }
            }
        });
    });
});