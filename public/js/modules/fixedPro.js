define(function (require, exports, module) {
    var filterCondition = {}, //已选固定筛选条件
        selectedDimension = {}, //固定筛选条件详情
        keys = ['area','sex','mobile','age'];
    //初始化发送至服务器的固定筛选条件对象
    exports.initFixedpros = function (data, pros) {
        for (var i in data) {
            pros[i] = [];
        }
        return pros;
    };
    //初始化固定筛选dom
    exports.initFixed = function (filterCondition) {
        majax({
            url: API.filter_getFixedProperty,
            async: false,
            success: function (data) {
                if (data["code"] == 200) {
                    selectedDimension = data["detail"];
                    exports.initBaseTag(filterCondition);
                    if (Object.keys(filterCondition).length == 0) {
                        return exports.initFixedpros(selectedDimension, filterCondition);
                    } else {
                        for (var line in filterCondition) {
                            for (var i = 0; i < filterCondition[line].length; i++) {
                                var item = filterCondition[line];
                                $("#" + line).find("#" + item[i]["code"]).addClass("active");
                                $('#' + line).addClass('base-tag-show');
                            }
                        }
                    }
                }
            }
        });
    }
    exports.initBaseTag = function (filterCon) {
        var container = $(".base-main .base-tag-warp");
//			exports.initFixedpros(selectedDimension,filterCon);
        var dom = '';
        for (var k = 0; k < keys.length; k++) {
    	    var item = '<div class="base-tag-item" data-key="' + keys[k] + '" id="' + keys[k] + '">' +
                '<h3><i class="' + keys[k] + '"></i>' + selectedDimension[keys[k]]["label"] + ':' + '</h3>' +
                '<div class="base-tag">';
            for (var i = 0; i < selectedDimension[keys[k]]["rows"].length; i++) {
                item += '<span data-code="' + selectedDimension[keys[k]]["rows"][i]["code"] + '" data-key="' + keys[k] + '" id="' + selectedDimension[keys[k]]["rows"][i]["code"] + '">' + selectedDimension[keys[k]]["rows"][i]["val"] + '<i></i></span>';
            }
            item += '</div></div>';
            dom += item;
        }
        container.html(dom);

        var tags = container.find('.base-tag');
        for (var i = 0; i < tags.length; i++) {
            if ($(tags[i]).height() > 71) {
                $(tags[i]).append('<a class="base-more" href="javascript:void(0);"><i></i></a>');
            }
        }
        container.on('click', '.base-more', function () {
            $(this).parents('.base-tag-item').toggleClass('base-tag-show');
        });

    };
    exports.bindHandler = function (filterCondition) {
        $(".base-main .base-tag-warp").on("click", "span", function () {
            var code = $(this).data("code");
            var filtertext = $(this).text();
            var thisKey = $(this).data("key");
            if ($(this).hasClass("active")) {//取消已选，清除dom及数据
                $(this).removeClass("active");
                for (var i = 0; i < filterCondition[thisKey].length; i++) {
                    if (code == filterCondition[thisKey][i]["code"]) {
                        filterCondition[thisKey].splice(i, 1);
                    }
                }
            } else {
                $(this).addClass("active");//添加已选，添加dom及数据
                if ($.inArray(code, filterCondition[thisKey]) == -1) {
                    var item = {};
                    item["code"] = code;
                    item["text"] = filtertext;
                    if (filterCondition[thisKey]) {
                        filterCondition[thisKey].push(item);
                    } else {
                        exports.initFixedpros(selectedDimension, filterCondition);
                        filterCondition[thisKey].push(item);
                    }

                }
            }
        });
    }

});
