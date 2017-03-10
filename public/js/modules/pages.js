/**
 * NAME 2016/8/22
 * DATE 2016/8/22
 * AUTHOR shangxinbo
 */
define(function (require, exports, module) {

    module.exports = function (current, nums) {
        var dom = '';
        if (nums <= 1) {
            return '';
        }
        if (current == 1) {
            dom += '<a href="javascript:void(0)" data-page="'+ (current-1) +'" class="prev disabled">上一页</a>';
        } else {
            dom += '<a href="javascript:void(0)" data-page="'+ (current-1) +'" class="prev">上一页</a>';
        }
        dom += '<a href="javascript:void(0)" data-page="1">1</a>';
        if (nums > 7) {
            if (current <= 4) {
                dom += '<a href="javascript:void(0)" data-page="2">2</a>' +
                    '<a href="javascript:void(0)" data-page="3">3</a>' +
                    '<a href="javascript:void(0)" data-page="4">4</a>' +
                    '<a href="javascript:void(0)" data-page="5">5</a>' +
                    '<span>...</span>' +
                    '<a href="javascript:void(0)" data-page="'+ nums +'">' + nums + '</a>';
            } else {
                if (current <= (nums - 4)) {
                    dom += '<span>…</span>' +
                        '<a href="javascript:void(0)" data-page="'+ (current - 1) +'">' + (current - 1) + '</a>' +
                        '<a href="javascript:void(0)" data-page="'+ current +'">' + current + '</a>' +
                        '<a href="javascript:void(0)" data-page="'+ (current + 1) +'">' + (current + 1) + '</a>' +
                        '<a href="javascript:void(0)" data-page="'+ (current + 2) +'">' + (current + 2) + '</a>' +
                        '<span>…</span>' +
                        '<a href="javascript:void(0)" data-page="'+ nums +'">' + nums + '</a>';
                } else {
                    dom += '<span>…</span>' +
                        '<a href="javascript:void(0)" data-page="'+ (nums - 4) +'">' + (nums - 4) + '</a>' +
                        '<a href="javascript:void(0)" data-page="'+ (nums - 3) +'">' + (nums - 3) + '</a>' +
                        '<a href="javascript:void(0)" data-page="'+ (nums - 2) +'">' + (nums - 2) + '</a>' +
                        '<a href="javascript:void(0)" data-page="'+ (nums - 1) +'">' + (nums - 1) + '</a>+' +
                        '<a href="javascript:void(0)" data-page="'+ (nums) +'">' + nums + '</a>';
                }
            }
        } else {
            dom += '<a href="javascript:void(0)" data-page="2">2</a>';
            if (nums > 2) {
                dom += '<a href="javascript:void(0)" data-page="3">3</a>';
            }
            if (nums > 3) {
                dom += '<a href="javascript:void(0)" data-page="4">4</a>';
            }
            if (nums > 4) {
                dom += '<a href="javascript:void(0)" data-page="5">5</a>';
            }
            if (nums > 5) {
                dom += '<a href="javascript:void(0)" data-page="6">6</a>';
            }
            if (nums > 6) {
                dom += '<a href="javascript:void(0)" data-page="7">7</a>';
            }
        }
        if (current == nums) {
            dom += '<a href="javascript:void(0)" data-page="'+ (current+1) +'" class="next disabled">下一页</a>';
        } else {
            dom += '<a href="javascript:void(0)" data-page="'+ (current+1) +'" class="next">下一页</a>';
        }

        return dom;

    }

});
