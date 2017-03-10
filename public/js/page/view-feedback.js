seajs.use([
	STATIC + 'modules/alter-feedback',
	STATIC + 'modules/common',
    STATIC + 'lib/template',
	STATIC + 'dialog/popWindow'
],function(Fb,ark,template){
	var pid = getQuery('id');
	var levelMap = {
		'level1' :'阶段1',
		'level2' :'阶段2',
		'level3' :'阶段3',
		'level4' :'阶段4',
		'level5' :'阶段5',
	}
	function showVal(data,readonly){
		if(readonly){
			$('input').attr('readonly','readonly');
		}
		$('[name="template_name"]').val(data.template_name);
		$('[name="level[name]"]').val(data.level.name);
		var reg = new RegExp('^level[0-9]$');
		var dom = '';
		var keys = [];
		for (var item in data) {
			if(reg.test(item)){
				keys.push(item);
			}
		}
		var keys = keys.sort();
		var delBtn = '<a class="feedback-remove removeResult" href="javascript:void(0);">删除本结果值</a>';		
		if(readonly){
			for (var i=1;i<=keys.length;i++) {
				dom += '<div class="feedback col step" data-level="level'+
						i+'"><h3>阶段'+i+'</h3><dl class="create-warp"><dd><label>第'+
						(i+1)+'列</label><input readonly="readonly" class="text" type="text" value="" name="level'+i+'[name]"/></dd></dl><h4>转化阶段'+
						i+'结果</h4><dl class="create-warp"><dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"/><input class="text w228" name="level'+
						i+'[value][]" type="text" value="成功" readonly="readonly"/></dd><dd><input class="text w87" type="text" value="1" readonly="readonly"/><input class="text w228" name="level'+
						i+'[value][]" type="text" value=""  readonly="readonly"/></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt></dl><dl class="create-warp three-create-warp"><dt><a class="feedback-add addInfo" href="javascript:void(0);">添加本阶段信息</a></dt></dl></div>';
	
			}				
		}else{
			for (var i=1;i<=keys.length;i++) {
				dom += '<div class="feedback col step" data-level="level'+
						i+'"><h3>阶段'+i+'</h3><dl class="create-warp"><dd><label>第'+
						(i+1)+'列</label><input class="text" type="text" value="" name="level'+i+'[name]"/></dd></dl><h4>转化阶段'+
						i+'结果</h4><dl class="create-warp"><dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"/><input class="text w228" name="level'+
						i+'[value][]" type="text" value="成功" readonly="readonly"/></dd><dd><input class="text w87" type="text" value="1" readonly="readonly"/><input class="text w228" name="level'+
						i+'[value][]" type="text" value=""/></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt></dl><dl class="create-warp three-create-warp"><dt><a class="feedback-add addInfo" href="javascript:void(0);">添加本阶段信息</a></dt></dl></div>';
	
			}			
		}

		
		$($('.feedback')[1]).after(dom);
		if($('.step').length>1){
			$('.feedback:last').append('<a class="feedback-remove removeStep" href="javascript:void(0);">删除本阶段</a>');			
		}
		if($('.step').length<5){
			$('.feedback:last').after('<div class="add-feedback"><a class="feedback-add addStep" href="javascript:void(0);">添加转化阶段</a></div>'); 
		}else{}

		for (var i=0;i<keys.length;i++) {
			try{
				var value = data[keys[i]].value,
					name = data[keys[i]].name,
					ext = data[keys[i]].ext,
					$wrap = $($('.step')[i]).find('.create-warp'),
					$wrap1 = $($wrap[1]),
					$wrap2 = $($wrap[2]);
				if(name){
					$('[name="'+keys[i]+'[name]"]').val(name);
				}
				if(value){
					var dom = '';
					if(readonly){
						for (var j=0;j<value.length;j++) {
							if(j==0){
								dom += '<dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"><input class="text w228" name="level'+(i+1)+'[value][]" type="text" value="成功" readonly="readonly"></dd>'
							}else if(j==value.length-1){
	//							console.log('level'+ (i+1));
								dom += '<dd><input class="text w87" type="text" value="'+j+'" readonly="readonly"><input readonly="readonly" class="text w228" name="level'+ (i+1) +'[value][]" type="text" value="'+ value[j] +'"></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt>'					
							}else{
	//							console.log('level'+ (i+1));
								dom += '<dd><input class="text w87" type="text" value="'+j+'" readonly="readonly"><input readonly="readonly" class="text w228" name="level'+ (i+1) +'[value][]" type="text" value="'+ value[j] +'">'
							}
							
						}						
					}else{
						for (var j=0;j<value.length;j++) {
							if(j==0){
								dom += '<dd><h5><span>结果值</span><span>代表含义</span></h5><input class="text w87" type="text" value="0" readonly="readonly"><input class="text w228" name="level'+(i+1)+'[value][]" type="text" value="成功" readonly="readonly"></dd>'
							}else if(j==value.length-1){
	//							console.log('level'+ (i+1));
								dom += '<dd><input class="text w87" type="text" value="'+j+'" readonly="readonly"><input class="text w228" name="level'+ (i+1) +'[value][]" type="text" value="'+ value[j] +'"></dd><dt><a class="feedback-add addResult" href="javascript:void(0);">添加结果值</a></dt>'					
							}else{
	//							console.log('level'+ (i+1));
								dom += '<dd><input class="text w87" type="text" value="'+j+'" readonly="readonly"><input class="text w228" name="level'+ (i+1) +'[value][]" type="text" value="'+ value[j] +'">'
							}
							
						}						
					}

					$wrap1.html(dom);
					if($wrap1.find("dd").length > 2){
						$wrap1.find("dd:last").append(delBtn);
						if($wrap1.find("dd").length >= 5){
							$wrap1.find('dt').remove();
						}
					}
				}
				if(ext){
					var dom = '';
					for (var j=0;j<ext.length;j++) {
						if(j==ext.length-1){
							dom += '<dd class="col"><label>第3列</label><input class="text" name="level1[ext][]" type="text" value="'+ext[j]+'"><a class="feedback-remove removeCol" href="javascript:void(0);">删除本列信息</a></dd>'							
						}else{
							dom += '<dd class="col"><label>第3列</label><input class="text" name="level1[ext][]" type="text" value="'+ext[j]+'"></dd>'							
						}

					}
					$wrap2.find('dt').before(dom);
				}
			}catch(e){}

		}
		Fb.updateColNum();
		Fb.updateStepNum();
	}
	function showFeedback(){
	    var template_id = getQuery('template_id');
		majax({
			url:API.templateInfo,
			async: false,
			data:{
				tid:template_id
			},
			success:function(data){
				if(data.code == 200){
					datas = data.detail;
					majax({
						url:API.project_isuploadfeed,
						data:{
							pid:pid
						},
						success:function(data){
							showVal(datas,!data.detail.pid);
							if(data.detail.pid){
								$('form').append('<div class="create-button"><a class="red" id="submit" href="javascript:void(0);">提交</a><a class="gray" href="javascript:void(0);">取消</a></div>');								
								Fb.base();
								Fb.bindBtn();
							}else{
								Fb.freeze();
								Fb.bindViewHandler();
							}
							Fb.refreshColor();
						}
					});


				}
			}
		});
	};
	$(document).ready(function(){
		$('[name="pid"]').val(pid);
		showFeedback();
	});
});

