/**
 * NAME 2016/8/16
 * DATE 2016/8/16
 * AUTHOR shangxinbo
 */


/**
 * console兼容
 */
var console = console || {
        log: function () {
            return;
        },
        error: function () {
            return;
        },
        info: function () {
            return;
        }
    };


/**
 * 封装jquery ajax
 * @param options 参数
 * @param callback 回调函数
 */
function majax(options) {
    var session = getCookie('MLG');
    if (!session) {
        window.location.href = '/login.html';
        return false;
    }
    $.ajax({
        url: options.url,
        type: options.type ? options.type : 'post',
        dataType: 'json',
        async: options.async ? options.async : true,
        cache: options.cache ? options.cache : true,
        timeout: options.timeout ? options.timeout : 3 * 60 * 1000,
        data: options.data,
        headers: {
            "api-token": session
        },
        success: function (data) {
            if (data.code == 10014) {
                window.location.href = '/login.html';
                return false;
            }
            if (options.success) {
                options.success(data);
            }
        },
        error: function (err) {
            if (options.error) {
                options.error(err);
            }
        }
    });
};

/*
 * @desc  下载文件方法
 * @param url   download 地址
 * @param paramStr 串接参数;
 * */
function downFile(url, paramStr) {
    var session = getCookie('MLG');
    if (paramStr) {
        window.location.href = url + paramStr + '&api-token=' + session;
    } else {
        window.location.href = url + '?api-token=' + session;
    }
}


/**
 * 获取url参数
 * @param name 要获取的参数名
 * @returns {null}
 */
function getQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

/**
 * 显示弹层
 * @param id  弹层元素id
 */
function getWindow(id) {
    showDialog(id);
    $("#" + id + " .dialog-close").click(function () {
        hideDialog(id);
    });
    $("#" + id + " .dialog-footer a:not('.red')").click(function () {
        hideDialog(id);
    });
}
function hideDialog(id) {
    if (id) {
        $("#" + id).hide();
    } else {
        $(".dialog").hide();
    }
    $("#shadowLayer").remove();
}
function showDialog(id) {
    var ids = $("#" + id);
    var idH = -(ids.height() / 2);
    var idW = -(ids.width() / 2);
    if($('#shadowLayer').length<=0){
        $('<div id="shadowLayer"></div>').appendTo("body").show();
    }
    ids.show().css({"margin-left": idW, "margin-top": idH});
}

/**
 * 过滤html代码
 */
function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/&#x20;/ig, ''); //去掉&#x20;
    return str;
}

/**
 * 验证是否是有效手机号
 * 正则日期2015.12.16，
 * 注意该正则的实时使用性，添加新的号段
 */
function isRealPhone(mobile) {
    var patten1 = /^1(3[456789]{1}|47|5[012789]{1}|78|8[23478]{1})\d{8}$/;   //移动
    var patten2 = /^1(3[012]{1}|45|5[56]{1}|76|8[56]{1})\d{8}$/;             //联通
    var patten3 = /^1(33|53|77|8[019]{1})\d{8}$/;                            //电信
    var patten4 = /^170\d{8}$/;                                              //虚拟运营商

    if (patten1.test(mobile)) {
        return 1;
    } else if (patten2.test(mobile)) {
        return 2;
    } else if (patten3.test(mobile)) {
        return 3;
    } else if (patten4.test(mobile)) {
        return 4;
    } else {
        return false;
    }
}

function isEmail(str) {
    var patten = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/;
    if (patten.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 验证身份证id
 */
function isIdentity(str) {
    var str = str.replace(/[ ]/g, "");
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(str);
}

/**
 * 验证银行卡号合法性
 */
function isBankcard(str) {
    var cardNum = str.replace(/[ ]/g, "");
    var reg = /^[0-9]{15,19}$/;
    return reg.test(cardNum);
}

/**
 * 验证是否是中文姓名
 */
function isCname(str) {
    var reg = /^[\u4e00-\u9fa5]{2,20}$/;
    return reg.test(str);
}

/**
 * 验证字符串是否是整数串
 * @param sText String
 * @return Boolen
 * */
function isNumberic(sText) {
    var validChars = "0123456789";
    var IsNumber = true;
    var Char;
    if (isNaN(sText)) {
        IsNumber = false;
    } else {
        for (var i = 0; i < sText.length && IsNumber == true; i++) {
            Char = sText.charAt(i);
            if (validChars.indexOf(Char) == -1) {
                IsNumber = false;
            }
        }
        if (String(parseInt(sText)).length < String(sText).length) {
            IsNumber = false;
        }
    }
    return IsNumber;
}

/**
 * 格式化数字
 * */
function numberFormatter(num) {
    try {
        return num.toString().replace(/\d+?(?=(?:\d{3})+$)/img, "$&,");
    } catch (e) {
        return NaN
    }
}

/**
 * 生成字符串hash值
 * @param str
 * @return hashcode
 * */
function hashCode(str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}
/**
 * 生成用户登录hashcode
 * */
function generateUserCode(user) {
    return hashCode(user.id + user.username + user.type + user.status + user.phone + user.create_at);
}


/**
 * @param max  10进制数，随机数的最大值
 * @param min  可选 ，随机数的最小值
 * return num  max和min之间的随机数 or false
 */
function random(max, min) {
    if (!isNaN(max)) {
        min = isNaN(min) ? 0 : min;
        var sect = max - min;
        return Math.floor(accMul(Math.random(), sect) + min);
    } else {
        console.info('random param is not available');
        return false;
    }
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}


/**
 ** @param String name  cookie名  （必须）
 ** @param String value cookie值  （必须）
 ** @param noExpire     cookie存活时间(必须)  时间秒数/年数
 ** @param noyear       控制noExpire的单位
 **/
function setCookie(name, value, noExpire, noyear) {
    var param1 = name + '=' + escape(value) + ';';
    if (noExpire) {
        expires = new Date();
        if (noyear == null) noExpire = (1000 * 86400 * 365) * noExpire;
        expires.setTime(expires.getTime() + noExpire);
        var param2 = 'expires=' + expires.toUTCString() + ';';
    }else{
        var param2 = '';
    }
    document.cookie = param1 + param2 + 'path=/;' ;
}
/**
* @desc  获取cookie值
* @param String name cookie's name
* return String cookie's value
* */
function getCookie(name) {
    var cookie_name = name + '=';
    var cookie_length = document.cookie.length;
    var cookie_begin = 0;
    while (cookie_begin < cookie_length) {
        var value_begin = cookie_begin + cookie_name.length;
        if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
            var value_end = document.cookie.indexOf(';', value_begin);
            if (value_end == -1) {
                value_end = cookie_length;
            }
            return unescape(document.cookie.substring(value_begin, value_end))
        }
        cookie_begin = document.cookie.indexOf(' ', cookie_begin) + 1;
        if (cookie_begin == 0) {
            break;
        }
    }
    return null;
}

/*
* @desc 删除cookie
* @param String name cookie's name
* */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + '=;path=/;expires=' + exp.toUTCString();
}


/**
 ** 存储value至sessionStorage
 ** 说明：存储value至sessionStorage前，对value进行序列化
 ** 调用：saveSelectedInSessionStorage(key,value)
 **/
function saveSelectedInSessionStorage(key, value) {
    var storage = window.sessionStorage;
    var val = JSON.stringify(value)
    storage.setItem(key, val);
}

/**
 ** 说明：清空sessionStorage中的数据
 ** 调用：clearSessionStorageVal()
 **/
function clearSessionStorageVal() {
    removeSessionStorageVal('crowd');
    removeSessionStorageVal('tags');
    removeSessionStorageVal('ucmodel');
    //var storage = window.sessionStorage;
    //storage.clear();
}

/**
 ** 说明：删除sessionStorage中某个数据
 ** 调用：removeSessionStorageVal(key)
 **/
function removeSessionStorageVal(sKey) {
    var storage = window.sessionStorage;
    storage.removeItem(sKey);
}

function getCookie(name) {
    var cookie_name = name + '=';
    var cookie_length = document.cookie.length;
    var cookie_begin = 0;
    while (cookie_begin < cookie_length) {
        var value_begin = cookie_begin + cookie_name.length;
        if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
            var value_end = document.cookie.indexOf(';', value_begin);
            if (value_end == -1) {
                value_end = cookie_length;
            }
            return unescape(document.cookie.substring(value_begin, value_end))
        }
        cookie_begin = document.cookie.indexOf(' ', cookie_begin) + 1;
        if (cookie_begin == 0) {
            break;
        }
    }
    return null;
}

/**
 ** 说明：格式化大数
 ** 调用：formatBigNumber(num)
 ** 返回值：格式化后的结果
 **/
function formatBigNumber(num) {
    var str = num + '';
    return str.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
}

/**
 ** 说明：判断对象是否相等
 ** 调用：isObjectValueEqual(obja, objb)
 ** 返回值：boolean
 **/
function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}


/**
 ** 说明：Object.keys兼容处理
 **/
var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
    hasOwn = ({}).hasOwnProperty;
for (var i in {
    toString: 1
}) {
    DONT_ENUM = false;
}

Object.keys = Object.keys || function (obj) {//ecma262v5 15.2.3.14
        var result = [];
        for (var key in obj) if (hasOwn.call(obj, key)) {
            result.push(key)
        }
        if (DONT_ENUM && obj) {
            for (var i = 0; key = DONT_ENUM[i++];) {
                if (hasOwn.call(obj, key)) {
                    result.push(key);
                }
            }
        }
        return result;
    };

/**
 ** 说明：indexOf兼容处理
 **/
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

/**
 ** 说明：forEach兼容处理
 **/
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

/**
 ** 说明：bind兼容处理
 **/
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis || window,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * 说明：trim兼容处理
 */
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        if (!this) return this;//空字符串不做处理
        return this.replace(/^\s+|\s+$/g, '');
    }
}
/**
 ** 说明：判断对象是否为空
 **/
function isEmpty(obj) {
    for (var item in obj) {
        if (obj[item])
            return false;
    }
    return true;
}


/**
 * 说明：滚动子元素到边界后阻止父元素滚动
 * 在到达边界的前一个滚动，手动滚动到边界，同时event.preventDefault()阻止鼠标滚动行为。
 * 调用：$(selector).scrollUnique();
 */
$.fn.scrollUnique = function () {
    return $(this).each(function () {
        var eventType = 'mousewheel';
        // 火狐是DOMMouseScroll事件
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function (event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;

            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);

            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0 ? 0 : scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }
        });
    });
};

/**
 * ES5的map兼容处理
 */
if (typeof Array.prototype.map != "function") {
  Array.prototype.map = function (fn, context) {
    var arr = [];
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {      
         arr.push(fn.call(context, this[k], k, this));
      }
    }
    return arr;
  };
}

/**
 * filter兼容处理
 */
if (typeof Array.prototype.filter != "function") {
  Array.prototype.filter = function (fn, context) {
    var arr = [];
    if (typeof fn === "function") {
       for (var k = 0, length = this.length; k < length; k++) {
          fn.call(context, this[k], k, this) && arr.push(this[k]);
       }
    }
    return arr;
  };
}

/**
 * some兼容处理
 */
if (typeof Array.prototype.some != "function") {
  Array.prototype.some = function (fn, context) {
	var passed = false;
	if (typeof fn === "function") {
   	  for (var k = 0, length = this.length; k < length; k++) {
		  if (passed === true) break;
		  passed = !!fn.call(context, this[k], k, this);
	  }
    }
	return passed;
  };
}

/**
 * every兼容处理
 */
if (typeof Array.prototype.every != "function") {
  Array.prototype.every = function (fn, context) {
    var passed = true;
    if (typeof fn === "function") {
       for (var k = 0, length = this.length; k < length; k++) {
          if (passed === false) break;
          passed = !!fn.call(context, this[k], k, this);
      }
    }
    return passed;
  };
}

/**
 * reduce兼容处理
 */
if (typeof Array.prototype.reduce != "function") {
  Array.prototype.reduce = function (callback, initialValue ) {
     var previous = initialValue, k = 0, length = this.length;
     if (typeof initialValue === "undefined") {
        previous = this[0];
        k = 1;
     }
     
    if (typeof callback === "function") {
      for (k; k < length; k++) {
         this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
      }
    }
    return previous;
  };
}

/**
 * setTimeout Polyfill
 */
// if (!window.setTimeout.isPolyfill) {  
//     var __nativeST__ = window.setTimeout;  
//     window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {  
//         var aArgs = Array.prototype.slice.call(arguments, 2);  
//         return __nativeST__(vCallback instanceof Function ? function () {  
//         vCallback.apply(null, aArgs);  
//         } : vCallback, nDelay);  
//     };  
//     window.setTimeout.isPolyfill = true;  
// } 