define(function(require, exports, module) {
	$.fn.countTo = function(options) {
		
		return $(this).each(function() {
			//设置参数 settings
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from: $(this).data('from'),
				to: $(this).data('to'),
				speed: $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals: $(this).data('decimals')
			}, options);

			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);
			if (data.interval) {
				clearInterval(data.interval)
			}
			data.interval = setInterval(function() {
				value += increment;
				loopCount++;
				var format = value.toFixed(settings.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
				$self.html(format);
				if (loopCount >= loops) {
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;
				}
			}, settings.refreshInterval);
		})
	};
	$.fn.countTo.defaults = {
		from: 0,
		to: 0,
		speed: 500, //效果持续时间
		refreshInterval: 50, //刷新频率
		decimals: 0 //小数位数
	};
});