define(function (require, exports, module) {
	'use strict';
	/**
	 * 	   阶段颜色
	 *   @color1: #0686B0;
	 *   @color2: #0670CA;
	 *   @color3: #3958DC;
	 *   @color4: #6452EF;
	 *   @color5: #8946D6;
	 */
	var color = ['#0686B0', '#0670CA', '#3958DC', '#6452EF', '#8946D6'];
	var ark = require(STATIC + 'modules/common');
	var id = getQuery('id'),
		cycle_id = getQuery('cycle_id'),
		template_id = getQuery('template_id'),
		source = getQuery('source'),
		user = ark.getUserInfo(),
		hasConfirm = false;//标记是否在确认弹窗中点击确定
	$('#pid').val(id);
	$('#tid').val(template_id);
	$('#source').val(source);

	exports.refreshColor = function () {
		$('.feedback h3').each(function (i, d) {
			$(this).css('color', color[i]);
		});
	};
	exports.updateColNum = function () {
		$('.col').each(function (i, d) {
			var num = i + 1;
			$(this).find('label').text('第' + num + '列');
		});
	};
	exports.updateStepNum = function () {
		$('.step').each(function (i, d) {
			var num = i + 1;
			$(this).find('h3').text('阶段' + num);
		});
	};
	//预览，开启只读
	exports.freeze = function () {
		$('.feedback-remove,.feedback-add').remove();
		$('input').attr('unselectable', 'on');
		$('input').on('focus', function () {
			$(this).blur();
		});
		$('.main h2').text('预览模板');
		$('form').append('<div class="create-button"><a class="red" id="submit" href="javascript:void(0);">确认</a><a class="gray" href="javascript:void(0);">取消</a></div>');

	};
	function checkInput() {
		var valArr = [];
		$(':input[name]:visible').each(function () {
			if ($(this).attr('name') != 'tid' && $(this).attr('name') != 'pid' && $(this).attr('name') != 'file') {
				var value = $(this).val().trim();
				if (value == '' || value == '请输入模版名称') {
					if ($(this).parent().find('.error').length == 0 && $(this).is(':visible')) {
						$(this).parent().append('<p class="error">该项不能为空</p>');
					}
				}
				valArr.push(value);
			}
		});
		for (var i = 0; i < valArr.length; i++) {
			if (valArr[i] == '' || valArr[i] == '请输入模版名称') {
				return false;
			}
		}
		return true;
	};
	function getFocus(_this) {
		_this.focus();
		hasConfirm = true;
		exports.bindEditHandler();
		$('input').off('focus');
	}
	exports.base = function () {
		$('input').on('focus', function () {
			$(this).blur();
		});
		$('body').on('click', 'input', function () {
			if (template_id) {
				if (!hasConfirm) {
					ark.confirm('是否进行更新反馈模版操作？', getFocus, $(this));
				}
			}
			$(this).parent().find('.error').remove();
		});
	};
	exports.bindBtn = function () {
		$('body').on('click', '#submit', function () {
			if (checkInput()) {
				majax({
					url: API.project_savetemplate,
					data: $("form").serialize(),
					success: function (data) {
						console.log(data);
						if (data.code == 200) {
							var type = getQuery('type')
							if (type == 'stock') {
								location.href = "/project/list_stock.html";
							} else {
								location.href = "/project/list_new.html";
							}

						} else if (data.code == 400) {
							ark.alert(data.message);
						} else if (data.code == 800) {
							ark.alert(data.message);
						}
					}
				});
			} else {
				if ($(".error:first").length == 1) {
					$("html,body").animate({ scrollTop: $(".error:first").closest('dl').offset().top }, 500);
				}
			}
		}).on('click', '.create-button a:last', function () {
			var type = getQuery('type')
			if (type == 'stock') {
				location.href = "/project/list_stock.html";
			} else {
				location.href = "/project/list_new.html";
			}
		});
	};
	exports.bindEditHandler = function () {
		$('body').on('click', '.addResult', function () {
			var $wrap = $(this).closest('.create-warp');
			var level = $wrap.closest('.step').data('level');
			var num = $wrap.find('dd').length;
			var item = '<dd><input class="text w87" type="text" readonly="readonly" value="' + num + '" /><input class="text w228" name="' + level + '[value][]" type="text" value="" /><a class="feedback-remove removeResult" href="javascript:void(0);">删除本结果值</a></dd>';
			if (num < 4) {
				$wrap.find('dd:last a').remove();
				$wrap.find('dd:last').after(item);
			} else if (num < 5) {
				$wrap.find('dd:last a').remove();
				$wrap.find('dd:last').after(item);
				$wrap.find('dt').remove();
			}
		}).on('click', '.removeResult', function () {
			var $wrap = $(this).closest('.create-warp');
			var num = $wrap.find('dd').length;
			var delBtn = '<a class="feedback-remove removeResult" href="javascript:void(0);">删除本结果值</a>';
			var addBtn = '<dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt>';
			if (num > 2) {
				$wrap.find('dd:last').remove();
				if (num > 3) {
					if ($wrap.find('dd:last').next('dt').length == 0) {
						$wrap.find('dd:last').append(delBtn).after(addBtn);
					} else {
						$wrap.find('dd:last').append(delBtn);
					}
				}
			}
		}).on('click', '.addInfo', function () {
			var $wrap = $(this).closest('.three-create-warp');
			var level = $wrap.closest('.step').data('level');
			var item = '<dd class="col"><label></label><input class="text" name="' + level + '[ext][]" type="text" /><a class="feedback-remove removeCol" href="javascript:void(0);">删除本列信息</a></dd>';
			if ($wrap.find('dd').length > 0) {
				$wrap.find('dd:last a').remove();
				$wrap.find('dd:last').after(item);
			} else {
				$wrap.find('dt').before(item);
			}
			exports.updateColNum();
		}).on('click', '.removeCol', function () {
			var $wrap = $(this).closest('.three-create-warp');
			var delBtn = '<a class="feedback-remove removeCol" href="javascript:void(0);">删除本列信息</a>';
			$(this).closest('dd').remove();
			$wrap.find('dd:last').append(delBtn);
			exports.updateColNum();
		}).on('click', '.addStep', function () {
			if ($('.step').length < 5) {
				if ($('.step').length == 4) {
					$('.addStep').remove();
				}
				var stepNum = $('.step').length + 1;
				var colNum = $('.col').length + 1;
				var dom = '<div class="feedback col step" data-level="level' + stepNum + '"><h3>阶段' + stepNum + '</h3><dl class="create-warp"><dd><label>第' + colNum + '列</label><input class="text" type="text" value=""  placeholder="转化阶段' + stepNum + '名称" name="level' + stepNum + '[name]"/></dd></dl><h4>转化阶段' + stepNum + '结果</h4><dl class="create-warp"><dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"/><input class="text w228" name="level' + stepNum + '[value][]" type="text" value="成功" readonly="readonly"/></dd><dd><input class="text w87" type="text" value="1" readonly="readonly"/><input class="text w228" name="level' + stepNum + '[value][]" type="text" value=""/></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt></dl><dl class="create-warp three-create-warp"><dt><a class="feedback-add addInfo" href="javascript:void(0);">添加本阶段信息</a></dt></dl><a class="feedback-remove removeStep" href="javascript:void(0);">删除本阶段</a></div>';
				$('.step:last .removeStep').remove();
				$('.step:last').after(dom);
			} else {
				$('.addStep').remove();
			}
		}).on('click', '.removeStep', function () {
			var $step = $(this).closest('.step');
			var stepNum = $('.step').length;
			var delBtn = '<a class="feedback-remove removeStep" href="javascript:void(0);">删除本阶段</a>';
			var addBtn = '<a class="feedback-add addStep" href="javascript:void(0);">添加转化阶段</a>';
			if (stepNum > 1) {
				if (stepNum == 5) {
					$('.step:last').append(delBtn).next('.add-feedback').append(addBtn);
				}
				$step.remove();
				if (stepNum > 2) {
					$('.step:last').append(delBtn);
				}
			}
		});
	};
	exports.bindViewHandler = function () {
		$('body').on('click', '.create-button a', function () {
			if (getQuery('type') == 'stock') {
				location.href = "/project/list_stock.html";
			} else {
				location.href = "/project/list_new.html";
			}
		});
	};
});
