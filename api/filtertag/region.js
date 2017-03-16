"use strict"

var Mock = require('mockjs');
var Random = Mock.Random;
var result = require('../base');
module.exports = function (req, res) {
    var d = {
        area: [],
        asset: {
            child: [
                {
                    "code": Random.integer(10100100100, 10200100100),
                    "name": '有子女'
                },
                {
                    "code": Random.integer(10100100100, 10200100100),
                    "name": '无子女'
                }
            ],
            car: [
                {
                    "code": Random.integer(10100100100, 10200100100),
                    "name": '有私家车'
                },
                {
                    "code": Random.integer(10100100100, 10200100100),
                    "name": '无私家车'
                }
            ],
            house: [
                {
                    "code": Random.integer(10100100100, 10200100100),
                    "name": '有房产'
                },
                {
                    "code": Random.integer(10100100100, 10200100100),
                    "name": '无房产'
                }
            ]
        }
    };
    for (let i = 0; i < 10; i++) {
        d.area.push({
            "code": Random.integer(10100100100, 10200100100),
            "name": Random.ctitle(6),
            "num": Random.integer(0,10000)
        })
    }
    return result.success(Mock.mock(d));
}