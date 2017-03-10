/**
 * NAME 2016/8/16
 * DATE 2016/8/16
 * AUTHOR shangxinbo
 */

define([
    STATIC + 'lib/china',
    STATIC + 'modules/common',
    STATIC + 'lib/template'
], function (require, exports, module) {

    'use strict';

    var ark = require(STATIC + 'modules/common');
    var template = require(STATIC + 'lib/template');

    exports.sexChart = function (data) {
        if(!data) return false;
        var myChart = echarts.init(document.getElementById('genders'));
        var key = ['男', '女'], value = [data['男'] ? data['男'] : 0, data['女'] ? data['女'] : 0];
        var option = {
            legend: {
                orient: 'horizontal',
                top: 5,
                icon: 'rect',
                data: key,
                textStyle: {
                    color: "#FFF",
                    fontSize: '12'
                },
                selectedMode:false
            },
            series: [
                {
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            position: "inside",
                            formatter: function (data) {
                                return data.percent + '%'
                            }
                        }
                    },
                    data: [
                        {
                            value: parseFloat(value[0]),
                            name: key[0],
                            itemStyle: {
                                normal: {
                                    color: "#E94D6A"
                                }
                            }
                        },
                        {
                            value: parseFloat(value[1]),
                            name: key[1],
                            itemStyle: {
                                normal: {
                                    color: "#09A88D"
                                }
                            }
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    };
    exports.areas = function (data) {
        if(!data) return false;
        var myChart = echarts.init(document.getElementById('areas'));
        var arr_default = [
            {"name": "江西", "value": 0}, {"name": "云南", "value": 0}, {"name": "北京", "value": 0},
            {"name": "江苏", "value": 0}, {"name": "吉林", "value": 0}, {"name": "海南", "value": 0},
            {"name": "湖南", "value": 0}, {"name": "黑龙江", "value": 0}, {"name": "湖北", "value": 0},
            {"name": "福建", "value": 0}, {"name": "河南", "value": 0}, {"name": "河北", "value": 0},
            {"name": "内蒙古", "value": 0}, {"name": "辽宁", "value": 0}, {"name": "宁夏", "value": 0},
            {"name": "天津", "value": 0}, {"name": "甘肃", "value": 0},{"name": "浙江", "value": 0},
            {"name": "安徽", "value": 0}, {"name": "贵州", "value": 0},{"name": "广西", "value": 0},
            {"name": "西藏", "value": 0}, {"name": "广东", "value": 0},{"name": "香港", "value": 0},
            {"name": "重庆", "value": 0}, {"name": "山西", "value": 0}, {"name": "上海", "value": 0},
            {"name": "陕西", "value": 0}, {"name": "四川", "value": 0}, {"name": "青海", "value": 0},
            {"name": "山东", "value": 0}, {"name": "台湾", "value": 0}, {"name": "南海诸岛", "value": 0},
            {"name": "新疆", "value": 0}];
        var arr = [];
        var max = 0;var min =0;
        for (var i in data) {
            arr.push({
                name: i.replace(/特别行政区|回族自治区|壮族自治区|自治区|省|市/, ''),
                value: accDiv(Math.round(parseFloat(data[i])*100),100)
            });

            if(max==0){
                max = data[i];
            }else{
                if(data[i]>max){
                    max = data[i];
                }
            }
            if(min==0){
                min = data[i];
            }else{
                if(data[i]<min){
                    min = data[i];
                }
            }
        }
        max = parseFloat(max);min = parseFloat(min);
        var diff = accDiv(accSub(max,min),3);
        if(diff<=0){diff = 1}
        var option = {
            visualMap: {
                type: 'piecewise',
                top: 'top',
                left: 'center',
                itemGap: 1,
                itemHeight: 10,
                hoverLink: false,
                textStyle: {
                    color: '#FFF'
                },
                orient: 'horizontal',
                text: ['高', '低'],
                inRange: {
                    color: ['#313161', '#3E2649', '#5E2F53', '#8A365A', '#E94D6A'],
                    symbol: 'rect'
                },
                pieces:[
                    {gte:Math.max(max,accAdd(min, accMul(diff,3)))},
                    {gte: accAdd(min, accMul(diff,2)), lt: accAdd(min, accMul(diff,3))},
                    {gte: accAdd(min, diff), lt: accAdd(min, accMul(diff,2))},
                    {gte: min, lt: accAdd(min,diff)},
                    {lt: min}
                ]
            },
            tooltip: {
                trigger: 'item',
                fontFamily: 'Microsoft Yahei',
                fontSize: '12',
                formatter: function (param) {
                    if (param.value > 0) {
                        return param.name + '：' + accMul(param.value,10);
                    } else {
                        return param.name;
                    }
                }
            },
            series: [
                {
                    type: 'map',
                    map: 'china',
                    data: arrMerge(arr_default, arr),
                    silent: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#292952'
                        },
                        emphasis: {
                            areaColor: false,
                            borderColor: '#595990',
                            borderWidth: 1
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    };
    exports.histogram1 = function (data, ele) {
        if(!data) return false;
        var Obj = [];
        for (var j in data) {
            Obj.push({
                index: j,
                value: parseInt(data[j])
            });
        }
        Obj.sort(function(a,b){
            if(a.index>b.index){
                return 1;
            }else{
                return -1;
            }
        });
        ele.html(template('histogram1', {lists: Obj}));
    };
    exports.histogram2 = function (data, ele) {
        if(!data) return false;
        var arr = [];
        for (var j in data) {
            arr.push({
                name: j,
                value: parseFloat(data[j])
            });
        }
        arr.sort(function (a, b) {
            return b.value - a.value;
        });
        arr = arr.slice(0, 10);
        ele.html(template('histogram2', {lists: arr}));
    };

    exports.line = function (data) {
        if(!data) return false;
        data = data.slice(0, 5);
        var xArr = [], itemArr = [], legend = [];
        var lineColor = ['#E94D6A', '#09A88D', '#398AD6', '#B84BC8', '#CC855A'];
        var lineSybol = ['ring-red.png', 'ring-green.png', 'ring-blue.png', 'ring-violet.png', 'ring-brown.png']
        for (var i = 0; i < data.length; i++) {
            var ob = {
                type: 'line',
                symbolSize: 9,
                symbol: 'image://'+ STATIC +'../img/' + lineSybol[i],
                smooth: true,
                lineStyle: {
                    normal: {
                        color: lineColor[i]
                    }
                },
                name: data[i]['label'],
                connectNulls: false,
                data: []
            };
            xArr = [];
            for (var j = 0; j < data[0]['vals'].length; j++) {
                xArr.push(data[0]['vals'][j]['date']);
                ob.data.push(data[i]['vals'][j]['val']);
            }
            itemArr.push(ob);
            legend.push({
                id: i,
                color: lineColor[i],
                name: data[i]['label'].replace(/特别行政区|回族自治区|壮族自治区|自治区|省|市/, '')
            });
        }
        $('.line-legend-item').replaceWith(template('legend', {legend: legend}));

        var myChart = echarts.init(document.getElementById('chart-line'));
        var option = {
            xAxis: {
                name:"日期",
                type: 'category',
                boundaryGap: false,
                data: xArr,
                splitLine: {
                    show:true,
                    lineStyle: {
                        color: '#60597C'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#60597C'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: [
                {
                    name: "人数",
                    nameTextStyle: {
                        color: '#8E87A5',
                        fontSize: '14'
                    },
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            color: '#60597C'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0)', '#3F3D66']
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#60597C'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                }
            ],
            grid: {
                left: '3%',
                right: '5%',
                containLabel: true
            },
            tooltip : {
                show: true,
                formatter: function(obj){
                    console.log(obj);
                    return obj.seriesName + '<br />' + obj.name + ' : ' + formatBigNumber(obj.value)
                }
            },
            series: itemArr
        };
        myChart.setOption(option);

        $('.line-legend-item li').on('click', function (event) {
            $(this).toggleClass('checked');
            var sele = $('.line-legend-item li.checked');
            var tmpArr = [];
            for (var i = 0; i < sele.length; i++) {
                tmpArr.push(itemArr[$(sele[i]).data('id')]);
            }

            option.series = tmpArr;
            myChart.clear();
            myChart.setOption(option);
        });
        $(window).resize(function(){
            myChart.resize()
        })
    };

    function arrMerge(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            var item = arr1[i];
            for (var j = 0; j < arr2.length; j++) {
                if (arr2[j].name == item.name) {
                    item.value = arr2[j].value;
                }
            }
        }
        return arr1;
    }

});
