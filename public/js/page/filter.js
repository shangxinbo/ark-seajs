seajs.use([
	'modules/fixedPro',
	'modules/shoppingCart',
	'modules/common',
	'lib/kendo.core',
	'lib/kendo.data.min',
	'lib/kendo.treeview.min',
	'dialog/popWindow'
],function(Fixed,Cart,ark){
	var dataPath = "/data";
var tidArr = {};//记录购物袋内标签id
var currentBagId = "cart_1";//当前购物袋id
var filterCondition = {};//已选固定筛选条件
//var filterUrl = dataPath + "/filter/getFixedProperty";//固定筛选条件数据获取URL
var expandedItem;//treeview当前展开tag数据
var param = {};//筛选参数对象
var path = [];//面包屑
var treeTag = {};//已勾选树上节点
var preSelList = {};//存储预选区标签数据，updatePreSel函数更新数据
var pageNum = getQuery("showpage");
var tags = sessionStorage.getItem("tags");
var tagLevelMap = {
	"1":"一级标签",
	"2":"二级标签",
	"3":"三级标签",
	"4":"四级标签",
	"5":"五级标签",
	"6":"六级标签"
};
var session = getCookie('MLG');
if(pageNum){
	if(tags){
	    tags = JSON.parse(tags);
	    for (var i = 0; i < tags.tagcode.length; i++) {
	        var item = tags.tagcode[i];
	        tidArr['cart_'+(i+1)] = [];
	        for (var j = 0; j < item.length; j++) {
	        	//标签去重
	        	var willAdd = true;
	        	item[j]["checked"] = true;
	        	for (var k=0;k<tidArr['cart_'+(i+1)].length;k++) {
	        		if(item[j]["code"]===tidArr['cart_'+(i+1)][k]["code"]){
		        		willAdd = false;
	        		}
	        	}
	        	if(willAdd){
					tidArr['cart_'+(i+1)].push(item[j]);        		
	        	}
	        }
	    }
	    if(tags.fixedpros)
	    	filterCondition = tags.fixedpros;
	}
}else{
	$(".warp>.main").css('display','block');
}
if(pageNum == 2){
	$(".base-main").css('display','block');
}else if(pageNum == 1){
	$(".warp>.main").css('display','block');
}

//重置wrap dom
function mkdata2Dom(data,wrap) {
	if (data.length > 0){
		var dom = "";
		data.forEach(function (item) {
			dom += '<li data-tid="' + item.code + '" data-level="' + item.tagLevel + '" title="' + item.tagName + '"><p><i class="icon"></i><span>' + item.tagName.slice(0, 6) + '</span></p></li>'
		});
		wrap.html(dom);
		if ($('.screening-right .all-button p').length == 0)
			$('.screening-right .all-button').prepend('<p><i class="icon"></i><span>全选</span></p>');
		//更新全选框状态
		var container = $(".screening-right");
		var checkedAll = container.find(".all-button>p");
		checkTreeTag(wrap);
		checkAllstate(container, checkedAll);
	}else {
		wrap.html('');
		
	}

}

	/**
	 * 将wrap中对应treetag中数据的tag置为勾选
	 * @param wrap
     */
    function checkTreeTag(wrap) {
		wrap.find('li').each(function () {
			var liCode = $(this).data('tid');
			for (var code in treeTag) {
				if (isFather(String(liCode), String(code)) || liCode == code) {
					if (!$(this).hasClass('checked'))
						$(this).addClass('checked');
				}
			}
		});
	}

//请求标签数据（非分页）
function  loadAll(param,commonWrap,callBack) {
	setTimeout(function () {
		majax({
			url: API.filter_getTagChildren,
			data: param,
			timeout: '6000',
			cache: 'false',
			success: function (data) {
				if (data.code==200){
					//追加数据至文档
					mkdata2Dom(data.detail,commonWrap,param);
					callBack();//回调处理选中状态同步的问题
				}else if(data.code == 500){
					ark.serverError();
				}else if(data.code == 404){
					ark.pageNotFound();
				}else if(data.code == 403){
					ark.pageForbidden();
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});

	},100);
}

//更新面包屑数据
function updataPath() {
	var item = {};
	item["code"] = expandedItem["code"];
	item["tagName"] = expandedItem["tagName"];
	if (path.length>0&&path[path.length-1]){
		if (isFather(expandedItem["code"],path[path.length-1]["code"])){
			if(expandedItem["code"]==path[path.length-1]["code"]){
				path.splice(path.length-1,1);
			}
			path.push(item);
		}else {
			path.splice(path.length-1,1);
			updataPath();
		}
	}else{
		path.push(item);
	}
}
function refreshPathDom() {
	var dom = '<dt>全部</dt>';
	for (var i=0;i<path.length;i++){
		dom += '<dd title="'+ path[i]["tagName"] +'">'+ path[i]["tagName"] + '</dd>';
	}
	$(".breadcrumb>dl").html(dom);
}

/**
 * 更新预选区数据
 */
//var preSelList = {};
function updatePreSel() {
	var selTagData = $(".all-button>p").data();
	try {
		if (!selTagData["hasChidren"]) {
			var checkedItems = [];
			$('.screening-right li:visible.checked').each(function () {
				var checkedItem = {};
				checkedItem["code"] = $(this).data('tid');
				checkedItem["text"] = $(this).attr('title');
				checkedItem["level"] = $(this).data('level');
				checkedItem["checked"] = true;
				checkedItems.push(checkedItem);
			});
			if (checkedItems.length > 0) {
				preSelList[selTagData["code"]] = checkedItems;
			}
		}
	}catch (e){}
}
function onSelect(e) {
	//清空搜索框
	$('.breadcrumb input').val('');

	//禁止loading动画
	kendo.ui.progress($("#treeview"), false);
	expandedItem = this.dataItem(e.node);

	var code  = expandedItem["code"];
	//更新面包屑数据
	updataPath();
	//更新dom
	refreshPathDom();
	updatePreSel();
//创建一个初始化请求参数对象
	var initParam = {
		code: expandedItem.code,
		level: expandedItem.tagLevel
	};
	//发起请求
	var commonWrap = $(".screening-right .scroll-content");
	loadAll(initParam,commonWrap,callBack);

	/*备选区选中状态同步 start*/
	function callBack() {
		//全选按钮添加关联tag数据
		var tagItem = $.extend(true,{},initParam);
		tagItem["name"] = expandedItem.tagName;
		tagItem["hasChidren"] = expandedItem.hasChildren;
		$(".all-button>p").data(tagItem);
		var $checkAll = $(".all-button>p");
		if($checkAll.data())
			updataSelDom($checkAll.data()["code"]);
		if (expandedItem.tagLevel > 1){
			if (expandedItem.checked) {
				if (!$checkAll.hasClass("checked")) {
					$checkAll.click();
				}
			} else {
				if ($checkAll.hasClass("checked")) {
					$checkAll.click();
				}
			}
		}
	}

	/*备选区选中状态同步 end*/
};
	/**
	 * 更新选中状态至预选区
	 * @param selCode
     */
    function updataSelDom(selCode) {
		$('.screening-right li').each(function () {
			var liCode = $(this).data('tid');
			if (preSelList && preSelList[selCode]) {
				for (var i = 0; i < preSelList[selCode].length; i++) {
					if (preSelList[selCode][i]["code"] == liCode) {
						if (!$(this).hasClass('checked'))
							$(this).addClass('checked');
					}
				}
			}
		});
	}
function addToTreeTag(newCheckedCode,name,level){

	// if (Object.keys(treeTag).length>0){
	treeTag[newCheckedCode] = {};
	treeTag[newCheckedCode]["name"] = name;
	treeTag[newCheckedCode]["level"] = level;
		for (var checkedCode in treeTag){
			// if (checkedCode !== newCheckedCode){
				if (isFather(String(checkedCode), String(newCheckedCode))){
					//将移入的tag是已存在tag的父tag，移除已存在子tag，push父tag
					delete treeTag[checkedCode];
				}else{
					//判断是否已经将某父tag的全部子tag移入treetag
					//如果是，则移除全部子tag并移入父tag
					var treeview = $("#treeview").data("kendoTreeView"),
						barDataItem = treeview.dataSource.get(checkedCode),
						barElement = treeview.findByUid(barDataItem.uid),
						$parentNode = treeview.parent(barElement),
						parentdata = treeview.dataItem($parentNode);
					if (parentdata){
						if (parentdata.tagLevel == 1){
						}else {
							if (parentdata.checked) {
								delete treeTag[checkedCode];
								addToTreeTag(parentdata.code, parentdata.tagName, parentdata.tagLevel);
							}
						}
					}

				}
		}
}
function removeFromTreeTag(newCheckedCode){
	for (var checkedCode in treeTag){
		if (checkedCode == newCheckedCode){
			//反勾选treeTag[i]
			delete treeTag[checkedCode];
		}else if(isFather(newCheckedCode.toString(), checkedCode.toString())){
			//反勾选treeTag[i]的后代节点，移除tree[i]
			delete treeTag[checkedCode];
			//tree[i]是否有已勾选子节点的子节点，如果是，则将已勾选子节点全部push进treeTag
			try{
				var treeview = $("#treeview").data("kendoTreeView");
				var DataItem = treeview.dataSource.get(checkedCode);
				var children = DataItem["items"];
				for (var i=0;i<children.length;i++){
					if (children[i]["checked"] == true){
						treeTag[children[i]["code"]] = {};
						treeTag[children[i]["code"]]["name"] = children[i]["tagName"];
						treeTag[children[i]["code"]]["level"] = children[i]["tagLevel"];
					}
				}				
			}catch(e){}
		}else if(isFather(checkedCode.toString(),newCheckedCode.toString())){
			delete treeTag[checkedCode];
		}
		//反勾选treetag[i]的父节点
	}
}
function toCheckTag(code,isChecek) {
	$(".screening-right .screening-item li").each(function () {
		if (isFather(String($(this).data("tid")), String(code)) || $(this).data("tid") == code){
			if(isChecek){
				if (!$(this).hasClass("checked")) {
					$(this).addClass("checked");
				}
			}else {
				if ($(this).hasClass("checked")) {
					$(this).removeClass("checked");
				}
			}
		}
	});
}
function onCheck(e) {
	var dataItem = this.dataItem(e.node);
	var newCheckedCode = dataItem["code"];
	var level = dataItem["tagLevel"]
	var name = dataItem["tagName"]
	var $checkAll = $(".all-button>p");
	var currentTagData = $checkAll.data();
	var code = currentTagData["code"];
	/*
	 * 同步treetag与预选区选中状态
	 */
	toCheckTag(dataItem["code"], dataItem.checked);
	if (dataItem.checked){
		//勾选treetag同步被选区选中状态
		if (currentTagData["code"] == dataItem["code"]&&(!$checkAll.hasClass("checked"))){
			/**
			 * 勾选当前点选的标签
			 */
			$checkAll.click();
		}else if (isFather(String(currentTagData["code"]),String(newCheckedCode))){
			/**
			 * 勾选当前点选标签的父标签
			 */
			if (!$checkAll.hasClass("checked")){
				$checkAll.click();
			}
				//移除所有子标签数据（包括点选子标签）
				removeSon(newCheckedCode);
		}
		//更新欲加入购物车的treetag数据
		addToTreeTag(newCheckedCode,name,level);

	}else {
		//更新反勾选状态
		if (isFather(String(newCheckedCode), String(currentTagData['code']))){
			/**
			 * 反勾选点选标签的子标签
			 * 同步预选区状态
			 * 移除点选标签数据，添加勾选状态子标签数据
			 */

			//移除当前反勾选标签数据
			removeFromTreeTag(newCheckedCode);
			//移除父标签数据
			for (var code in treeTag){
				if (isFather(String(newCheckedCode), code)){
					delete treeTag[code];
				}
			}
			//加入当前反勾选标签的兄弟标签
			findSiblings(e.node, this);
		}else if (isFather(String(currentTagData['code']), String(newCheckedCode))){
			/**
			 * 反勾选当前点选标签的父标签
			 * 反勾选全部子标签，同步预选区
			 * 移除以该父标签code开头的所有子标签
			 */
			removeSon(newCheckedCode);
			if ($checkAll.hasClass("checked"))
				$checkAll.click();
		}else {
			if (currentTagData["code"] == dataItem["code"] && ($checkAll.hasClass("checked"))) {
				/**
				 * 反勾选当前点选标签
				 * 更新预选区全选状态
				 * 移除点选标签数据
				 * 移除点选标签父标签数据
				 */
				$checkAll.click();
				removeFromTreeTag(newCheckedCode);
			}else{
				removeFromTreeTag(newCheckedCode);
			}
		}
	//同步叶节点预选数据
	updatePreSelList(newCheckedCode);
	}
	var checkedAll = $('.screening-right').find(".all-button>p");
	checkAllstate($('.screening-right'), checkedAll);
}
function isFather(sonCode,fatherCode) {
	var fCodeArr = fatherCode.split('|');
	var sCodeArr = sonCode.split('|');
	for (var i = 0; i < fCodeArr.length; i++ ){
		for (var j = 0; j < sCodeArr.length; j++){
			if (sCodeArr[j].indexOf(fCodeArr[i]) == 0 && (sCodeArr[j] != fCodeArr[i]))
				return true;
		}
	}
	return false;
}

/**
 * @desc 移除treetag中子标签数据
 * @param pCode
 */
function removeSon(pCode) {
	var pCodeArr = pCode.split('|');
	for (var i = 0; i < pCodeArr.length; i++){
		for (var code in treeTag){
			if (code.indexOf(pCodeArr[i]) == 0)
				delete treeTag[code];
		}
	}
}
function findSiblings(unCheckednode,_this) {
	var pNode = _this.parent(unCheckednode);

	var pData = _this.dataItem(pNode);
	var siblings = pData.items;
	var siblingsArr = [];
	for (var i = 0; i < siblings.length; i++) {
		if (siblings[i].checked) {
			siblingsArr.push(siblings[i]);
		}
	}
	if (siblingsArr.length + 1 == siblings.length) {
		for (var i = 0; i < siblingsArr.length; i++) {

			treeTag[siblingsArr[i].code] = {};
			treeTag[siblingsArr[i].code]['level'] = siblingsArr[i].tagLevel;
			treeTag[siblingsArr[i].code]['name'] = siblingsArr[i].tagName;
		}
	}
	if (pData.tagLevel > 1) {
		findSiblings(pNode, _this);
	}
}

//全选检查
function checkAllstate(container,checkedAll){
	var allItemNum = container.find("li:visible").length;
	var checkedNum = container.find("li:visible.checked").length;

	if(checkedNum<allItemNum){
		if(checkedAll.hasClass("checked")){
			checkedAll.removeClass("checked");
		}
	}else if(checkedNum==allItemNum){
		if(allItemNum==0){
			checkedAll.removeClass("checked");
		}else if(!checkedAll.hasClass("checked")){
			checkedAll.addClass("checked");
		}
	}
}

function initTreeviewdata(){
	homogeneous = new kendo.data.HierarchicalDataSource({
        transport: {                  
            read: {
                url: API.filter_getTagStructure,
                dataType: "json",
                type: "post",
                beforeSend: function (xhr) {
	                xhr.setRequestHeader("api-token",session);
	            },
				data: function(){//定义lazy-load参数
	                if(expandedItem){
	                    return {
	                        code: expandedItem.code,
							level: expandedItem.tagLevel
	                    }
	                }
    			}
            }
        },
        schema: {
            model: {
                id: "code",
                hasChildren: "hasChildrend"
            },
			parse:function (result) {
				if (result["code"] ==200){
					var data = result["detail"];
					for (var i=0;i<data.length;i++){
//						data[i]["sprit"] = spritClassMap[data[i]["code"]];
						if(data[i]["tagLevel"] == 1){
							if(data[i]["spritClass"]){
								data[i]["sprit"] = data[i]["spritClass"];
							}else{
								data[i]["sprit"] = "icon04";
							}
						}
					}
					return data;
				}else if(result.code == 500){
					ark.serverError();
				}else if(result.code == 404){
					ark.pageNotFound();
				}else if(result.code == 403){
					ark.pageForbidden();
				}

			}
        }
   });
}
initTreeviewdata();

//isObjectInArr函数判断对象是否已存在于数组中
function isObjectInArr(obj,arr){
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i]["code"].toString()===obj["code"].toString()) {
			return true;
		}
	}
	return false;
}


//切换标签展开状态
function toggletag() {
	var treeview = $("#treeview"),
		kendoTreeView = treeview.data("kendoTreeView");

	treeview.on("dbclick click", ".k-in", function(e) {
		kendoTreeView.collapse ($(e.target).parents(".k-item").siblings());//collapse同级tags
		kendoTreeView.collapse ($(e.target).parents(".k-item").siblings().find(".k-item"));//collapse同级tags的后代tags
		kendoTreeView.collapse ($(e.target).closest(".k-item").find(".k-item"));//collapse target的后代tags
		kendoTreeView.expand($(e.target).closest(".k-item"));
	});
}

//判断预选区是否筛选后结果
function isSearchResult(){
	return ($('.screening-right ul li:visible').length == $('.screening-right ul li').length) ? false : true;
};

//筛选后，标签树上对应tag是否勾选
function ischeck(){
	var isChecked;
	if($(".screening-right").find(".all-button>p").hasClass('checked')){
		isChecked = true;
	}else{
		isChecked = false;
	}
	if(!isChecked){
		return false;
	}else{
		if(isSearchResult()){
			return false;
		}else{
			return true;						
		}
	}
}
/**
 * 删除当前标签
 * @param {Object} $this
 */
function delOneTag($this){
	var code = $this.closest("li").data("tid");
	var tagtext = $this.prev().text();
	var tag2Del = {
		code: code,
		text: tagtext
	};
	var thisBagId = $this.closest(".cart").attr("id");//进行删除操作的购物袋id
	//遍历数组，删除选中标签对象对应的数组元素
	Cart.delObjInArr(tag2Del,tidArr[thisBagId]);
	//购物袋为空时，移除btngroup
	//移除空购物袋
	//更新购物篮标号
	if(tidArr&&tidArr[thisBagId]&&tidArr[thisBagId].length==0){
		if($(".cart").length>1){
            $("#"+thisBagId).remove();
//                  console.log(tidArr);
			Cart.updateShoppingbagNum();
			currentBagId = Cart.initCurrentBagId(currentBagId);
		}else{
			$("#"+thisBagId+" ul").html('<li data-init="1"><strong>请在左侧选择标签，加入购物篮</strong></li>');
			$(".add-cart a").addClass("disabled");
		}
		
	}
	$this.closest("li").remove();
	Cart.refreshCheckAll(thisBagId);
	return false;
}
/**
 * 删除全部勾选标签
 */
function delCheckedTags(){
	$(".cart-warp li").each(function(){
		if($(this).hasClass("checked")){
			var thisTagId = $(this).data("tid");
			var thisBagId = $(this).closest(".cart").attr("id");
				for (var i=0;i<tidArr[thisBagId].length;i++) {
					if(tidArr[thisBagId][i].code==thisTagId){
						tidArr[thisBagId].splice(i,1);//移除记录
					}
				}
			if($(this).closest(".cart").find("li").length==1){
				if($(".cart").length>1){
                    $(this).closest(".cart").remove();
					Cart.updateShoppingbagNum();
					currentBagId = Cart.initCurrentBagId(currentBagId);
				}else{
					$(this).closest(".cart").find("ul").html('<li data-init="1"><strong>请在左侧选择标签，加入购物篮</strong></li>');
					$(".add-cart a").addClass("disabled");
				}	
			}
			
                // $(this).parents(".shoppingBag").remove();
			//移除dom
			$(this).remove();	    			
			Cart.refreshCheckAll(thisBagId);
		}
	});
}
/**
 * 清空购物车
 */
function delAllTags(){
	tidArr = Cart.initShoppingCar();
	currentBagId = "cart_1";
	$(".add-cart a").addClass("disabled");
}
/**
 * 反勾选标签时，移除preselList中对应子标签数据
 * @param 当前移除的标签code： currentCode
 */
function updatePreSelList(currentCode){
	for (var code in preSelList) {
		if(isFather(code,currentCode) || code == currentCode){
			delete preSelList[code];
		}
	}
}

$(function(){

		console.log(kendo.treeView);

		$(".scroll-warp").scrollBar();
		$('.scroll-warp').scrollUnique();
		$tree = $("#treeview");
		$filterContainer = $(".base-main .dl-warp");
		var $search = $('.breadcrumb input');
		if(tags){
			if(pageNum==1){
				if(Object.keys(tidArr).length>0){
					Cart.showTagInCart(tidArr,currentBagId,tagLevelMap);						
				}
			}
			else if(pageNum==2){
				$(".main").css("display","none").next(".base-main").css("display","block");
				Fixed.initFixed(filterCondition);
				Cart.showTagInCart(tidArr,currentBagId,tagLevelMap);
			}
				
		}else{
			tidArr = Cart.initShoppingCar(tidArr,currentBagId);
		}

		console.log($tree);
		$tree.kendoTreeView({
	    	//隐藏根节点checkbox
	    	checkboxes: {
	        	checkChildren: true,
		        	template:
			            "# if (item.level() > 0) { #" +
			                "<input type='checkbox' #= item.checked ? 'checked' : '' #>" +
			            "# } #"
	        },
			autoBind: false,//禁止数据自动绑定
	        check: onCheck,
			select: onSelect,
	        dataSource: homogeneous,
			dataSpriteCssClassField:"sprit",
	        dataTextField: "tagName"
	    });
		homogeneous.read({
	    	code: -1,
			level: 0
	    });//treeview初始化		

		toggletag();//点选切换标签展开状态

		//固定筛选条件追加
		Fixed.bindHandler(filterCondition);

		//搜索
		$search.on('keyup',function(){
			var value = $(this).val().trim().toUpperCase();
			var currentTagData = $(".screening-right").find(".all-button>p").data();
			
			//清除全部勾选及数据
			//清除预选
			preSelList = {};

			//遍历标签树上已勾选标签并取消勾选&清除数据
			for (code in treeTag) {
				var tagData = {};
				tagData['code'] = code;
				tagData['level'] = treeTag[code].level;
				tagData['name'] = treeTag[code].name;
				toCheckTreeItem(tagData,false);
				delete treeTag[code];
			}

			$('.screening-right li').hide();
//			$('.screening-right li:contains('+value+')').show();
			$('.screening-right li').each(function(){
				$(this).removeClass('checked');//清除预选区选中
				if($(this).attr('title').toUpperCase().indexOf(value) > -1){
					$(this).show();
				}
			});

			checkAllstate($(".screening-right"),$(".screening-right").find(".all-button>p"));				


			//更新标签树勾选状态
			toCheckTreeItem(currentTagData,ischeck());
			if($(this).val().length > 0){
				$(this).next('em').show();
			}else{
				$(this).next('em').hide();
			}
		});
		
		$search.next('em').on('click',function(){
			$(this).prev('input').val('');
			$(this).hide();
			$search.keyup();
			return false;
		});

		
		//标签筛选区
		//复选框
		$(".screening-right ul").on("click","li",function(){
			/*
			 * 同步treetag start
			 */
			var currentTagData = {};
			currentTagData["name"] = $(this).attr('title');
			currentTagData["code"] = $(this).data("tid");
			currentTagData["level"] = $(this).data("level");
			if ($(this).hasClass("checked")) {
				$(this).removeClass("checked");
				if ($(this).data("level") < 100) {
					toCheckTreeItem(currentTagData, false);
					removeFromTreeTag(currentTagData["code"]);
				}
			} else {
				$(this).addClass("checked");
				if ($(this).data("level") < 100) {
					toCheckTreeItem(currentTagData, true);
					addToTreeTag(currentTagData["code"],currentTagData["name"],currentTagData["level"]);	
				}
			}
//			console.log(treeTag);
			/*
			 * 同步treetag end
			 */
			var container = $(".screening-right");
			var checkedAll = container.find(".all-button>p");
			checkAllstate(container,checkedAll);
			//更新全选按钮状态后，同时更新treetag数据
			var tagCode = checkedAll.data().code;
			var tagName = checkedAll.data().name;
			var tagLevel = checkedAll.data().level;
			//点击全选，将当前点选的标签加入treetag
			//一级标签不可加入
			if(checkedAll.hasClass("checked")){
				if(checkedAll.data().level>1){
					//判断是否筛选后标签
					//如果是筛选后标签，将筛选出的全部标签加入预选
					//否则可以将当前点选标签加入treetag
					if(isSearchResult()){
						if(ischeck()){
							addToTreeTag(tagCode,tagName,tagLevel);							
							toCheckTreeItem(checkedAll.data(),true);
						}else{
							removeFromTreeTag(tagCode);
							toCheckTreeItem(checkedAll.data(), false);
							updatePreSelList(tagCode);
						}
					}else{
						addToTreeTag(tagCode,tagName,tagLevel);
						toCheckTreeItem(checkedAll.data(),true);
					}

				}
			}else{
				if (treeTag[tagCode]){
					removeFromTreeTag(tagCode);
				}
				updatePreSelList(tagCode);
				if (checkedAll.data().hasChidren){
					if (container.find('li.checked').length == 0) {
						toCheckTreeItem(checkedAll.data(), false);
					}
				}else {
					toCheckTreeItem(checkedAll.data(), false);
				}

			}
		});


	    //全选
	    $(".screening-right .all-button").on("click","p",function(){
	    	Cart.toCheckAll($(this),$(".screening-right"));
			//备选框全选按钮与tree同步
			var currentTagData = $(this).data();
			var tagCode = currentTagData["code"];
//			console.log(currentTagData);
			var isChecked = $(this).hasClass("checked");
			//同步treetag
			var treeview = $("#treeview").data("kendoTreeView");
			var dataItem = treeview.dataSource.get(tagCode);			
			var tagName = dataItem["tagName"];
			var tagLevel = dataItem["tagLevel"]
			if(isChecked){
				$('.screening-right').find('li:visible').each(function () {
					var code = $(this).data('tid');
					var level = $(this).data('level');
					var name = $(this).attr('title');
					if (level < 100) {
						addToTreeTag(code, name, level);							
					}
				});
				if($(this).data().level>1){
						if(isSearchResult()){
							if(ischeck()){
								addToTreeTag(tagCode, tagName, tagLevel);														
							}else{
								removeFromTreeTag(tagCode);						
							}
						}else{
							addToTreeTag(tagCode, tagName, tagLevel);							
						}
//					addToTreeTag(tagCode,tagName,tagLevel);
				}
				$('.screening-right li:visible').each(function(){
					var tagData = {};
					tagData['code'] = $(this).data('tid');
					tagData['level'] = $(this).data('level');
					tagData['name'] = $(this).attr('title');
					if(isSearchResult()){
						if(ischeck()){
							toCheckTreeItem(tagData,true);													
						}else{
							toCheckTreeItem(tagData,false);													
						}
					}else{
						toCheckTreeItem(tagData,true);						
					}
				});
			}else{
				$('.screening-right').find('li').each(function () {
					var code = $(this).data('tid');
					removeFromTreeTag(code);
				});
				removeFromTreeTag(tagCode);
				updatePreSelList(tagCode);
				
				$('.screening-right li').each(function(){
					var tagData = {};
					tagData['code'] = $(this).data('tid');
					tagData['level'] = $(this).data('level');
					tagData['name'] = $(this).attr('title');
					toCheckTreeItem(tagData,false);
//					updatePreSelList(tagData['code']);
				});
			}
//			toCheckTreeItem(currentTagData,isChecked);
			toCheckTreeItem(currentTagData,ischeck());
			
	    });

		//购物袋
		//复选框
		$(".cart-warp").on("click","li i",function(){
			$(this).toggleClass("checked");
//			console.log($(this).parents(".shoppingBag").attr("id"));
			var currentBag = $(this).parents(".cart");
			var checkedAll = currentBag.find(".all-item");
			var bagId = currentBag.attr("id");
			var thisCode = $(this).closest("li").data("tid");
			//当前点击的标签toggle checked状态
			for(var i=0;i<tidArr[bagId].length;i++){
				if(tidArr[bagId][i]["code"] == thisCode){
					tidArr[bagId][i]["checked"] = !tidArr[bagId][i]["checked"];	
				}
			}
			$(this).closest("li").toggleClass("checked");
			checkAllstate(currentBag,checkedAll);//全选框状态检查
		});
		//全选
	    $(".cart-warp").on("click",".all-item i",function(){
	    	var currentBag = $(this).closest(".cart");
	    	tidArr = Cart.toCheckAll($(this).closest('.all-item'),currentBag,tidArr);
	    });

		function willAdd(currentTagCode,treeTag) {
			for (var code in treeTag){
				if (currentTagCode.toString() == code){
					return false;
				}else if (isFather(String(currentTagCode), String(code))){
					return false;
				}
			}
			return true;
		}

	    //加入购物车
		var $checkedAll = $(".all-button>p");
	    $(".all-button input").click(function(){
	    	var preLen = Object.keys(preSelList).length;
	    	if(!isEmpty(treeTag)||$(".screening-right li:visible.checked").length>0||preLen>0){
		    	if($("#" + currentBagId + " ul").find("li[data-init]")){
		    		$("#" + currentBagId + " ul").find("li[data-init]").remove();
		    	}
		    	//当前购物车标签数据记录
				if(!currentBagId){
					currentBagId = "cart_1";
					tidArr[currentBagId]=[];
				}else if(!tidArr[currentBagId]){
					tidArr[currentBagId]=[];
				}
				var currentTagCode = $checkedAll.data().code;//当前点选tag的id
	
	
				//加入treetag数据
				for (var code in treeTag) {
					var item = {};
					item["code"] = code;
					item["text"] = treeTag[code]["name"];
					item["level"] = treeTag[code]["level"];
					item["checked"] = true;
					//购物袋去重
					if (!isObjectInArr(item, tidArr[currentBagId])) {
						tidArr[currentBagId].push(item);
						
	//					'<li class="checked" data-tid="'+code+'"><i class="icon checkbox"></i><span>'+treeTag["code"]+'</span><em class="icon delete"></em></li>';
						$("#" + currentBagId + " ul").append('<li class="checked" data-tid="'+item["code"]+'" data-level="'+item["level"]+'" title="'+ item["text"] + '（' + tagLevelMap[item["level"]] + '）'+'"><i class="icon checkbox"></i><span>'+item["text"].slice(0,18)+'（'+tagLevelMap[item["level"]]+'）'+'</span><em class="icon delete"></em></li>');
					}
				}
	
	
				if (willAdd(currentTagCode,treeTag)){
					$(".screening-right li:visible.checked").each(function(){
						var queryItem = {
							code: $(this).data("tid"),
							// parentid: $(this).parent().data("parentid"),
							text: $(this).attr("title"),
							level: $(this).data("level"),
							checked:true
						};
	
						//数组去重
						if(!isObjectInArr(queryItem,tidArr[currentBagId])){
							var dom;
							tidArr[currentBagId].push(queryItem);
//							console.log(tidArr);
							//克隆选中标签
							//改变标签样式
							//追加至目标购物袋
							if(queryItem["level"]<100){
								dom = '<li class="checked" data-tid="'+queryItem["code"]+'" data-level="'+queryItem["level"]+'" title="'+ queryItem["text"]+ '（' + tagLevelMap[queryItem["level"]] + '）'+'"><i class="icon checkbox"></i><span>'+queryItem["text"].slice(0,18)+'（'+ tagLevelMap[queryItem["level"]]+'）'+'</span><em class="icon delete"></em></li>';
							}else{
								dom = '<li class="checked" data-tid="'+queryItem["code"]+'" data-level="'+queryItem["level"] + '" title="' + queryItem["text"]+'"><i class="icon checkbox"></i><span>'+queryItem["text"].slice(0, 25)+'</span><em class="icon delete"></em></li>';
							}
							
							$("#"+currentBagId+" ul").append(dom);
						}
					});
				}

				/**
				 * 添加预选区非当前页的勾选tag数据至dom
				 * @type {*|jQuery|HTMLElement}
                 */
				if(Object.keys(preSelList).length > 0){
					for (var code in preSelList) {
						if (willAdd(code, treeTag)) {
							for (var i = 0; i < preSelList[code].length; i++) {
								var queryItem = $.extend(true, {}, preSelList[code][i]);
								//数组去重
								if (!isObjectInArr(queryItem, tidArr[currentBagId])) {
									var dom;
									tidArr[currentBagId].push(queryItem);
//									console.log(tidArr);
									//克隆选中标签
									//改变标签样式
									//追加至目标购物袋
									if (queryItem["level"] < 100) {
										dom = '<li class="checked" data-tid="' + queryItem["code"] + '" data-level="' + queryItem["level"] + '" title="' + queryItem["text"] + '（' + tagLevelMap[queryItem["level"]] + '）' + '"><i class="icon checkbox"></i><span>' + queryItem["text"].slice(0, 18) + '（' + tagLevelMap[queryItem["level"]] + '）' + '</span><em class="icon delete"></em></li>';
									} else {
										dom = '<li class="checked" data-tid="' + queryItem["code"] + '" data-level="' + queryItem["level"] + '" title="' + queryItem["text"] + '"><i class="icon checkbox"></i><span>' + queryItem["text"].slice(0, 25) + '</span><em class="icon delete"></em></li>';
									}

									$("#" + currentBagId + " ul").append(dom);
								}
							}
						}
					}
				}


		    	//添加全选按钮
		    	//只添加一次
		    	var $currentBag = $("#"+currentBagId);
				if($currentBag.find(".all-item").children().length==0){
					if($currentBag.find("ul").children().length>1){
						$currentBag.find(".all-item").addClass("checked").html('<p class="checked"><i class="icon"></i><span>全选</span></p>');
					}
				}
				
				if(Cart.canAddCart()){
					$(".add-cart a").removeClass("disabled");
				}
//				console.log(tidArr);
	    	}
	    });
		
		//添加购物篮
		$(".add-cart a").on("click",function(){
			if(!$(this).hasClass("disabled")){
				tidArr = Cart.addCart(tidArr,currentBagId);
				currentBagId = $(".cart").find("ul.active").closest(".cart").attr("id");
			}
		});

	    	
	    //逐一删除购物车内标签
	    $(".cart-warp").on("click",".cart em",function(){
	    	ark.confirm('是否删除此标签？',delOneTag,$(this));			
	    });
	    //删除多个选定标签
	    $(".billing >a:nth-child(1)").on("click",function(){
	    	if($(".cart-warp li.checked").length>0){    		
				ark.confirm('是否删除选中标签？',delCheckedTags);
	    	}
	    });

		//购物袋点击切换
		$(".cart-warp").on("click",".cart",function(){
			currentBagId = $(this).attr("id");
			Cart.changeShoppingBag(currentBagId);		
		});

		
		//清空购物车
		$(".billing >a:nth-child(2)").on("click",function(){
			if($('.cart:first').find('strong').length == 0){
				ark.confirm('是否清空购物车？',delAllTags);				
			}
		});
			
	//跳转至固定筛选
	$(".billing >input").on("click",function(){
		$(this).closest(".main").css("display","none").next(".base-main").css("display","block");
		if(tags){
			Fixed.initFixed(filterCondition);
		}else{
			Fixed.initFixed(filterCondition);			
		}
	});
	//从固定筛选页返回至标签筛选页
	$(".base-main .edit-btn>.prev").on("click",function(){
		$(this).closest(".base-main").css("display","none").prev(".main").css("display","block");
	});
	

	
	//下一步 保存数据至sessionStorage
	$(".base-main .edit-btn>.next ").click(function(){
		checkAndStore(filterCondition);
		window.location.href = "/report.html";
	});
	//跳过 保存数据至sessionStorage
	$(".base-main .edit-btn>.pass ").click(function(){
		checkAndStore();
		window.location.href = "/report.html";
	});
	
});

function checkAndStore(filterCondition){
	var tagcode = Cart.mktagcode(tidArr,true);//购物车内标签id
	var storage = window.sessionStorage;
	param = {};
	param["tagcode"] = tagcode;
	if(filterCondition){
		param["fixedpros"] = filterCondition;
	}else{}
	var val = JSON.stringify(param);
	storage.setItem("tags",val);
}


//勾选tree上对应元素
function toCheckTreeItem(item,isChecked) {
	if(item["level"] > 1){
		try{
			var treeview = $("#treeview").data("kendoTreeView");
			var DataItem = treeview.dataSource.get(item["code"]);
			var Element = treeview.findByUid(DataItem.uid);
			if (isChecked){
				treeview.dataItem(Element).set("checked", true);
			}else{
				treeview.dataItem(Element).set("checked", false);
			}
		}catch(e){
			console.log(e);
			console.log("treeview上无预选区对应tag！");
		}

	}
}

});
