seajs.use([
	STATIC + 'modules/alter-feedback',
	STATIC + 'modules/common',
    STATIC + 'lib/template',
	STATIC + 'dialog/popWindow'
],function(Fb,ark,template){

	var pid = getQuery('id');
	var initFeedback = function($container){
		var dom = '';
		for (var i=1;i<=5;i++) {
			if(i<5){
				dom += '<div class="feedback col step" data-level="level'+i+'"><h3>阶段'+i+'</h3><dl class="create-warp"><dd><label>第'+(i+1)+'列</label><input class="text" type="text" value=""  placeholder="转化阶段'+i+'名称" name="level'+i+'[name]"/></dd></dl><h4>转化阶段'+i+'结果</h4><dl class="create-warp"><dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"/><input class="text w228" name="level'+i+'[value][]" type="text" value="成功" readonly="readonly"/></dd><dd><input class="text w87" type="text" value="1" readonly="readonly"/><input class="text w228" name="level'+i+'[value][]" type="text" value=""/></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt></dl><dl class="create-warp three-create-warp"><dt><a class="feedback-add addInfo" href="javascript:void(0);">添加本阶段信息</a></dt></dl></div>';
			}else{
				dom += '<div class="feedback col step" data-level="level'+i+'"><h3>阶段'+i+'</h3><dl class="create-warp"><dd><label>第'+(i+1)+'列</label><input class="text" type="text" value=""  placeholder="转化阶段'+i+'名称" name="level'+i+'[name]"/></dd></dl><h4>转化阶段'+i+'结果</h4><dl class="create-warp"><dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"/><input class="text w228" name="level'+i+'[value][]" type="text" value="成功" readonly="readonly"/></dd><dd><input class="text w87" type="text" value="1" readonly="readonly"/><input class="text w228" name="level'+i+'[value][]" type="text" value=""/></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt></dl><dl class="create-warp three-create-warp"><dt><a class="feedback-add addInfo" href="javascript:void(0);">添加本阶段信息</a></dt></dl><a class="feedback-remove removeStep" href="javascript:void(0);">删除本阶段</a></div>';
			}

		}
		$container.after(dom);
	};
	
	$(document).ready(function(){
		$('[name="pid"]').val(pid);
		$container = $($('.feedback')[1]);
		initFeedback($container);
		Fb.bindEditHandler();
		Fb.bindBtn();
		Fb.updateColNum();
		Fb.updateStepNum();
		Fb.refreshColor();
	});
});