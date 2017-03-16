seajs.use([
    'modules/project_create_marketing',
    'modules/common',
    'dialog/popWindow'
], function (Proj, ark) {
    var user = ark.getUserInfo();

    function hidechildren($element) {
        $(document).click(function (e) {
            if (!(e.target == $element || $.contains($element, e.target))) {
                $($element).closest(".select-warp").removeClass("select-open");
            }
        });
    }


    $(document).ready(function () {
        var project = Proj.getProject();
        	$comboBox = $(".comboBox"),
            $dropDown = $(".select-warp"),
            $selWrap = $comboBox.closest(".li-input-warp"),
            $marketingCycle = $("#marketing-cycle"),
            $submitBtn = $("#submit"),
            $projName = $("#projName"),
            $projArea = $("#projArea"),
            $projDesc = $("#projDesc"),
            $filterBtn = $(".filters-item"),
            $datePickerWrap = $(".calendar-warp");

        //取消按钮
        $('.create-button a:eq(1)').on('click', function () {
            window.location.href = "/project/list_new.html";
        });

        //默认人群选中
        var user_id = user.id;
        var _filter = getCookie('_filter_['+ user_id + ']');
        if(_filter){
            _filter = JSON.parse(_filter);
            project.filterId = _filter.id;
            project = Proj.updateProject("filterId", _filter.id, false);
            $('.filters-item').html('<span data-dialog="filter">' + _filter.name + '<i class="delete"></i></span><i class="modify" data-dialog="filter"></i>');
        }

        //datepicker
		$( "#datepicker" ).datepicker({
			minDate: +0,
			dateFormat: "yy.mm.dd",
			altFormat: "yy.mm.dd",
			monthNames: [ "01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月" ],
			dayNamesMin: [ "日", "一", "二", "三", "四", "五", "六" ],
			yearSuffix: "年",
			showMonthAfterYear: true
		});

        //$("#ui-datepicker-div").css("fontSize", "1.57em");


        $("input,textarea,.calendar-warp,.filters-item a").on("click", function () {
			$(this).next('.error').remove();
			$(this).find('.error').remove();
        });

        $comboBox.on("click", function () {
            if (!$(this).closest(".select-warp").hasClass("select-open")) {
                $dropDown.removeClass("select-open");
                $(this).closest(".select-warp").addClass("select-open");
            } else {
                $dropDown.removeClass("select-open");
                $(this).closest(".select-warp").removeClass("select-open");
            }
        });
        $comboBox.each(function (i, d) {
            hidechildren($comboBox[i]);
        });


        $selWrap.on("click", "li", function () {
            var $btn = $(this).closest("ul").prev(".comboBox"),
                selVal = $(this).text();
            $dropDown.removeClass("select-open");
            $btn.text(selVal);
            //周期项目/单次项目判断
            if ($(this).data("cycle") == 0) {
                $marketingCycle.closest('li').hide();
                project.cycle = 0;
            } else if ($(this).data("cycle") == 1) {
                $marketingCycle.closest('li').show();
                $marketingCycle.find("p").addClass("comboBox").text("周");
                project.cycle = 2;
            }
            //选择下拉列表项，更新数据
            if ($btn.data("type")) {
                project = Proj.updateProject($btn.data("type"), $btn.text(), true);
            }
        });

        //选择人群
        $("body").on("click", "#filterHistory .dialog-footer>a.red", function () {
            var sel = $('#filterHistory .checked');
            if (sel.length > 0) {
                var selId = sel.parents('tr').data('id'),
                    sel = {
                        selName: sel.parents('tr').data('name'),
                        selId: selId
                    };
                project.filterId = selId;
                project = Proj.updateProject("filterId", selId, false);
                $('.filters-item').html('<span data-dialog="filter">' + sel.selName + '<i class="delete"></i></span><i class="modify" data-dialog="filter"></i>')
                hideDialog();
            }
        }).on("click", ".filters-item .delete", function (e) {
            $('.filters-item').html('<a href="javascript:void(0);" data-dialog="filter"><i class="filter"></i><em>筛选人群</em></a>');
            project = Proj.updateProject("filterId", "-1", false);
            return false;
        });

        //提交
        $submitBtn.on("click", function () {
        	$("input,textarea,.calendar-warp,.filters-item a").each(function(){
        		$(this).next('.error').remove();
				$(this).find('.error').remove();
        	});
            var projKeys = {},
                projName = $projName.val(),
                projArea = $projArea.val(),
                projDesc = $projDesc.val(),
                filterId = project.filterId,
                selDate = $datePickerWrap.find("#datepicker").val(),
                canSub = false,
                state = [],
                regExp = new RegExp("^[\u4E00-\u9FFFa-zA-Z0-9]*$"),
           		datearr = selDate.split('.'),
            	dd = datearr[2],
            	mm = datearr[1],
            	yy = datearr[0],
            	beginTime = mm + '/' + dd + '/' + yy;
            /**
             * canSub
             * 0 空字符串
             * 1 通过验证
             * 2 超长
             * 3 格式错误
             */

            state.push(Proj.checkVal(projName, 20, regExp));
            (Proj.checkVal(projName, 20, regExp)!==1)&&$projName.after('<p class="error">'+ Proj.getErrMes(Proj.checkVal(projName, 20, regExp), "项目名称", 20, projName) +'</p>');
            state.push(Proj.checkVal(projArea, 20, null));
            (Proj.checkVal(projArea, 20, null)!==1)&&$projArea.after('<p class="error">'+ Proj.getErrMes(Proj.checkVal(projArea, 20, null), "地域", 20, projArea) +'</p>');
            state.push(Proj.checkVal(projDesc, 50, null));
            (Proj.checkVal(projDesc, 50, null)!==1)&&$projDesc.after('<p class="error">'+ Proj.getErrMes(Proj.checkVal(projDesc, 50, null), "描述", 50, projDesc) +'</p>');
            state.push(Proj.checkVal(filterId, 50, null));
			(Proj.checkVal(filterId, 50, null)!==1)&&$filterBtn.append('<p class="error">'+ Proj.getErrMes(Proj.checkVal(filterId, 50, null), "筛选人群", 50) +'</p>');
            state.push(Proj.checkVal(selDate, 50, null));
			(Proj.checkVal(selDate, 50, null)!==1)&&$datePickerWrap.after('<p class="error">'+ Proj.getErrMes(Proj.checkVal(selDate, 50, null), "开始时间", 50) +'</p>');
            canSub = Proj.canSub(state);
            //验证通过，可以提交数据
            if (canSub) {
                projKeys.projectName = projName;
                projKeys.area = projArea;
                projKeys.detailRequirement = projDesc;
                projKeys.beginTime = beginTime;
                project = Proj.updateProject(null, projKeys);
                majax({
                    url: "/php/project/saveproject",
                    data: project,
                    success: function (data) {
                        if (data.code == 200) {
                            window.location.href = '/project/list_new.html';
                        } else if (data.code == 300) {

                        } else if (data.code == 700) {
                            $projName.after('<p class="error">'+ data.message +'</p>');
                            $("html,body").animate({scrollTop: $(".error").closest('li').offset().top}, 500);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            }else{
				for (var i=0; i<$('.error').length; i++) {
					if($($('.error')[i]).text().trim().length>0){
            			$("html,body").animate({scrollTop: $(".error:eq("+i+")").closest('li').offset().top}, 500);						
						break;
					}
				}

            }
        });
    });
});