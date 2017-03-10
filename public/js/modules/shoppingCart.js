define(function(require, exports, module){
	//转化存储购物车内标签的数据结构
	exports.mktagcode = function (tidArr,store){
		var tagcode = [];
		for (var bag in tidArr) {
			if(tidArr[bag].length>0){
				var codesInBag = [];
				for (var i=0;i<tidArr[bag].length;i++) {
					if(tidArr[bag][i]["checked"]){
						var item = {};
						item["code"] = tidArr[bag][i]["code"];
						item["text"] = tidArr[bag][i]["text"];
						if(store){
							item["level"] = tidArr[bag][i]["level"];
						}
						console.log(item)
						codesInBag.push(item);
					}
				}
				if(codesInBag.length>0)
					tagcode.push(codesInBag);
				console.log(codesInBag);
			}
		}
		return tagcode;
	}
	//初始化购物车
	exports.initShoppingCar = function (tidArr,currentBagId){
		var initShoppingBagDom = '<div class="cart" id="cart_1"><h4>购物篮1</h4><ul class="active"><li data-init="1"><strong>请在左侧选择标签，加入购物篮</strong></li></ul><div class="all-item"></div></div>';
	
		$(".cart-warp .scroll-content").html(initShoppingBagDom);
		currentBagId = "cart_1";//重置当前选中shoppingBagid
		tidArr = {};
		tidArr[currentBagId] = [];
		return tidArr;
	}
	//恢复购物车状态
	exports.showTagInCart = function(tidArr,currentBagId,tagLevel){
		if(Object.keys(tidArr).length > 0){
			$(".cart-warp .scroll-content").html('');
			var num = 1,canAddCart = true;
			for (var cart in tidArr) {
				var item = tidArr[cart];
				if(item.length>0){
					var dom = '<div class="cart" id="'+cart+'"><h4>购物篮'+num+'</h4><ul>';
					for (var i=0;i<item.length;i++) {
						if(item[i]["level"]<100){
							dom += '<li class="checked" data-tid="'+item[i]["code"]+'" data-level="'+item[i]["level"]+'" title="'+ item[i]["text"]+ '（' + tagLevel[item[i]["level"]] + '）'+'"><i class="icon checkbox"></i><span>'+item[i]["text"].slice(0,18)+'（'+ tagLevel[item[i]["level"]]+'）'+'</span><em class="icon delete"></em></li>';
						}else{
							dom += '<li class="checked" data-tid="'+item[i]["code"]+'" data-level="'+item[i]["level"]+'" title="'+ item[i]["text"] +'"><i class="icon checkbox"></i><span>'+item[i]["text"].slice(0,25)+'</span><em class="icon delete"></em></li>';
						}
					}
					
					dom += '</ul><div class="all-item checked"></div></div>';
					$(".cart-warp .scroll-content").append(dom);
				}else{
					canAddCart = false;
				}
				if($('#' + cart).find(".all-item").children().length==0){
					console.log($('#' + cart).find("ul").children());
					if($('#' + cart).find("ul").children().length>1){
						$('#' + cart).find(".all-item").addClass("checked").html('<p class="checked"><i class="icon"></i><span>全选</span></p>');
					}
				}
				num++;
			}
			
			if(canAddCart){
				$(".add-cart a").removeClass("disabled");				
			}
			$("#"+currentBagId).find("ul").addClass("active");
		}
	}
	exports.initCurrentBagId = function (currentBagId){
		$(".cart ul").removeClass("active");
		currentBagId = $(".cart:first").attr("id");
		$("#"+currentBagId+" ul").addClass("active");
		return currentBagId;
	}
	exports.delObjInArr = function (obj,arr){
		for (var i=0;i<arr.length;i++) {
			if(obj["code"]==arr[i]["code"]){
	//					console.log(i);
						console.log(arr);
				arr.splice(i,1);
				break;
			}
			else{
				console.log("error");
			}
		}
	}
	exports.uncheckedAll = function(tidArr,cart,checked){
		for (i=0;i<tidArr[cart].length;i++) {
			tidArr[cart][i]["checked"] = checked;
		}
	}
	//全选函数
	exports.toCheckAll = function (_this,parentDomofTags,tidArr){
		var id = _this.closest(".cart").attr("id");
		if(_this.hasClass("checked")){
			_this.removeClass("checked");
			if(_this.closest("div").parent("div").hasClass("cart"))
				exports.uncheckedAll(tidArr,id,false);
		}
		else{
			_this.addClass("checked");
			if(_this.closest("div").parent("div").hasClass("cart"))
				exports.uncheckedAll(tidArr,id,true);
		}
		parentDomofTags.find("li:visible").each(function(){
			if(_this.hasClass("checked"))
				$(this).addClass("checked");
			else
				$(this).removeClass("checked");
		})
		console.log(tidArr);
		return tidArr;
	}
	exports.canAddCart = function (){
		$(".cart").each(function(i,d){
			if($(this).find("ul").children("li[data-init]").length==0)
				return false;
		})
		return true;
	}
	//添加购物车
	exports.addCart = function (tidArr,currentBagId){
		var bagNum = $(".cart").length+1; 
		var bagId = Object.keys(tidArr).length+1;
		currentBagId = "cart_"+bagId;
		tidArr[currentBagId]=[];
		console.log(tidArr);
		var dom = '<div class="cart" id="'+currentBagId+'"><h4>购物篮'+bagNum+'</h4><ul><li data-init="1"><strong>请在左侧选择标签，加入购物篮</strong></li></ul><div class="all-item"></div></div>';
		$(".cart-warp .scroll-content").append(dom);			
		exports.changeShoppingBag(currentBagId);
		$(".add-cart a").addClass("disabled");
		return tidArr;
	}
	//更新购物篮编号
	exports.updateShoppingbagNum = function (){
		$(".cart").each(function(i){
			$(this).find("h4").text("购物篮"+(i+1));
		})
	}
	//切换至指定购物袋
	exports.changeShoppingBag = function (currentBagId) {
		var thisUl = $("#"+currentBagId).find("ul");
	//			console.log(spanofTitle.text());
		if(!thisUl.hasClass("active"))
			thisUl
				.addClass("active")
				.closest(".cart")
				.siblings(".cart")
				.find("ul")
				.removeClass("active");
	}
	exports.refreshCheckAll = function (currentBagId){
		var $currentBag = $("#"+currentBagId);
		if($currentBag.find(".all-item").children().length==0){
			if($currentBag.find("ul").children("li").length>1){
				$currentBag.find(".all-item").html('<p class="checked"><i class="icon"></i><span>全选</span></p>');
			}
		}else if($currentBag.find(".all-item")){
			if($currentBag.find("ul").children("li").length<2){
				$currentBag.find(".all-item").removeClass("checked").empty();
			}
		}
	}
});
