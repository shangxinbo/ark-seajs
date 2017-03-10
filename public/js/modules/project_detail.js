define([
    STATIC + 'modules/common'
],function(require, exports, module){
    var ark = require(STATIC + 'modules/common');

	exports.showTable = function(data){
		var list = {};
		list.level = data.level;
		list.isGeneral = exports.isGeneral();
		list.lItem = [];
		for (var i=0; i<data.list.length; i++) {
			var item = {};
			if(i%2 == 0){
				item.bg = true;				
			}else{
				item.bg = false;
			}
			item.id = data.list[i].id;
			item.cycleName = '周期' + (i + 1);
			item.clue_time = data.list[i].clue_time;
			item.effect_time = data.list[i].effect_time;
			item.effect_total = data.list[i].effect_total;
			item.change_vs = [];
			if(data.list[i].levelScore){
				for (var j=0;j<data.list[i].levelScore.length;j++) {
					var vs = {};
					vs.change_score = data.list[i].levelScore[j];
					if(data.list[i].level){
						vs.change_value = data.list[i].level[j];	
					}else{
						vs.change_value = '';
					}
					item.change_vs.push(vs);
				}
			}else if(data.list[i].level){
				for (var j=0;j<data.list[i].level.length;j++) {
					var vs = {};
					if(data.list[i].levelScore){
						vs.change_score = data.list[i].levelScore[j];
					}else{
						vs.change_score = '';
					}
					vs.change_value = data.list[i].level[j];
					item.change_vs.push(vs);
				}
			}else{
				for (var j=0;j<data.level.length;j++) {
					var vs = {};
					vs.change_score = '';
					vs.change_value = '';
					item.change_vs.push(vs);					
				}
			}

			if(data.list[i].clue_create_status){
				if(data.list[i].clue_create_status == 0){
					item.stat = '正在生成';
				}else{
					item.stat = '已完成';
				}
			}else{
				item.stat = '未开始';
			}

			if(data.list[i].upload_status && data.list[i].upload_status == 1){
				item.isUpload = true;
			}else{
				item.isUpload = false;
			}
//			item.isGeneral = list.isGeneral;
			list.lItem.push(item);
		}
		list.all = {};
		list.all.effect_time = data.all.effect_time;
		list.all.effect_total = data.all.effect_total;
		list.all.list = data.all.level;
		if(data.list.length % 2 == 0){
			list.all.bg = true;
		}else{
			list.all.bg = false;
		}
		$('.case-table').html(ark.renderDom($('#case-table'), {list: list}));
	};
	exports.line = function (data) {
        if(!data) return false;
//      data = data.slice(0, 5);
        var itemArr = [], legend = [];
        var lineColor = ['#E94D6A', '#09A88D', '#398AD6', '#B84BC8', '#CC855A'];
        var lineSybol = ['ring-red.png', 'ring-green.png', 'ring-blue.png', 'ring-violet.png', 'ring-brown.png']
        for (var i = 0; i < data.ciclyName.length; i++) {
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
                name: data.ciclyName[i],
                connectNulls: false,
                data: []
            };
            for (var j = 0; j < data.change_score.length; j++) {
                ob.data.push(data.change_score[j][i]);
            }
            itemArr.push(ob);
            legend.push({
                id: i,
                color: lineColor[i],
                name: data.ciclyName[i].slice(0,5),
                title: data.ciclyName[i]
            });
        }
        $('.line-legend-item').replaceWith(ark.renderDom($('#legend'), {legend: legend}));

        var myChart = echarts.init(document.getElementById('cutline'));
        var option = {
            xAxis: {
                name:"周期",
                type: 'category',
                boundaryGap: false,
                data: data.date,
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
                    name: "转化率",
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
                        },
                  		formatter: '{value} %'
                    }
                }
            ],
            grid: {
                left: '3%',
                right: '5%',
                containLabel: true
            },
            series: itemArr
        };
        myChart.setOption(option);
    };
});
