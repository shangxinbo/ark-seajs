seajs.use([
    'modules/common',
    'lib/template',
    'dialog/popWindow',
    'lib/echarts.min'
], function (ark, template) {
    var color = ["red", "green", "brown", "blue", "violet"];
    var color_value = ['#E94D6A', '#09A88D', '#CC855A', '#398AD6', '#B84BC8'];
 
    function changeArr(arr){
        var max = 0
        var index = 0
        arr.map(function(value,key){
            if(value.proportion>max){
                max = value.proportion
                index = key
            }
        })
        var total = 0
        arr.map(function(value,key){
            if(key!=index){
                total = accAdd(total,value.proportion)
            }
        })
        arr[index].proportion = accSub(100,total)
    }

    majax({
        url: API.tags_stagefail,
        data: {
            id: getQuery('id'),
            stage: getQuery('stage')
        },
        success: function (data) {
            if (data.code == 210) {
                ark.pageForbidden();
            } else if (data.code == 200) {
                var rows = data.detail.fail_reason;
                changeArr(rows)
                var values = []

                for (var i = 0; i < rows.length; i++) {
                    rows[i].color = color[(i % 5)]
                    values.push({
                        value: rows[i].proportion
                    })
                }
                var stage = getQuery('stage')
                $('.main').prepend(template('failer_title', {
                    data: data.detail,
                    stage:stage
                }))
                $('.fail-table').html(template('failer_table', {
                    data: rows,
                    stage:stage
                }))
                $('.line-legend').html(template('failer_legend', {
                    items: rows
                }))

                if (rows.length > 0) {
                    var myChart = echarts.init(document.getElementById('pic'));
                    var option = {
                        color: color_value,
                        series: [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: ['35%', '80%'],
                                hoverAnimation: false,
                                startAngle: 90,
                                avoidLabelOverlap: true,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inner',
                                        formatter: '{c}%',
                                        textStyle: {
                                            fontSize: 16
                                        }
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: 16,
                                        }
                                    }
                                },
                                data: values
                            }
                        ]
                    }
                    myChart.setOption(option);
                }
            } else {
                ark.alert(data.message);
            }
        }
    })
})