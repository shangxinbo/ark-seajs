define([
    STATIC + 'lib/scrollBar',
    STATIC + 'lib/template',
    STATIC + 'modules/common'
],function(require, exports, module){
    var Ark = require(STATIC + 'modules/common'),
        Template = require(STATIC + 'lib/template'),
        sequence = ['channel','area','action'],
        pageNum = 0,
        selectedLabel = {},
        typeMap = {
            'product':'产品类型',
            'preference':'权益偏好',
            'channel':'渠道',
            'area':'地域',
            'asset':'资产',
            'action':'上网行为'
        },
        apiMap = {
            'product':[API.filtertag_produces,API.filtertag_produce],
            'preference':[API.filtertag_preferences,API.filtertag_preference],
            'channel':[API.filtertag_channels,API.filtertag_channel],
            'area':[API.filtertag_region],
            'action':[API.filtertag_actions,API.filtertag_action]           
        }
        type = '',
        tagLevel2url = '',
        tagLevel3url = '',
        file = getQuery('file'),
        cycle = 1,
        queryParam = {},
        timer = 0;
        
        if(file){
            queryParam.file = file;
        }

    /** 
     * 浅拷贝selectedLabel到dist
     * @param {Object} dist 目标对象
     */    
    exports.copyselectedLabel = function(dist){
        if(file){
            dist.file = file;
        }
        for(var type in selectedLabel){
            dist[type] = [];
            var arr = selectedLabel[type],
                len = arr.length;
            for(var i=0;i<len;i++){
                dist[type].push(arr[i].code);
            }
        }
    }

    module.exports.getSequence = function(){
        return sequence;
    }
    module.exports.getPageNum = function(){
        return pageNum;
    }
    module.exports.getSelectedLabel = function(){
        return selectedLabel;
    }
    module.exports.getTypeMap = function(){
        return typeMap;
    }
    module.exports.getType = function(){
        return type;
    }
    exports.setType = function(newType){
        type = newType;
    }
    exports.getCycle = function(){
        return cycle;
    }
    exports.setCycle = function(newCycle){
        cycle = newCycle;
    }
    exports.getApiMap = function(){
        return apiMap;
    }
    exports.getFile = function(){
        return file;
    }

    /**
     * 数组排序规则 根据数组元素的key值倒序排序
     * @param {any} key
     * @returns
     */
    function sortRule(key){
        return function(obj1,obj2){
            var val1 = obj1[key],
                val2 = obj2[key];
            return val2 - val1;
        }
    }

    /**
     * 全选
     * @param {String} btn_class 当前全选按钮class
     * @param {Boolean} check    是否全选
     */
    exports.checkAll = function(btn_class,check){
        var $btn = $('.all-button .' + btn_class),
            $ul = $('.screening-right .' + btn_class);
        $ul.find('li').each(function(i,$li){
            if(check){
                $($li).addClass('checked');     
            }else{
                $($li).removeClass('checked');
            }
        });
    }

    /**
     * 根据当前类型下对应二级标签下已选三级标签数更新对应全选按钮勾选状态
     * @param {String} type 类型
     */
    exports.checkState = function (type){
        var $wrap = $('.screening-right .' + type + ' ul'),
            $list = $wrap.find('li'),
            len = $list.length,
            checkedNum = 0;
            $list.each(function(){
                if($(this).hasClass('checked')){
                    checkedNum++;
                }
            });

            if(checkedNum == len){
                $wrap.closest('.screening-right').find('.all-button p').addClass('checked');
            }else{
                $wrap.closest('.screening-right').find('.all-button p').removeClass('checked');                    
            }
    }

    /**
     * 勾选三级标签数据去重
     * @param {Object} item 标签数据
     * @param {Array} arr   当前类型对应已选标签数组
     */
    function exist(item,arr){
        var len = arr.length;
        for(var i=0; i<len; i++){
            if(item.code == arr[i].code){
                return true;
            }
        }
        return false;
    } 

    /**
     * 恢复资产筛选下某个下拉列表默认状态
     * @param {String} code 该下拉列表当前绑定的data-code值
     */
    exports.recoverSel = function(code){
        // console.log(code);
        var $selWrap = $('.screening-assets .select-warp');
        $selWrap.each(function(){
            if($(this).data('code') == code){
                $(this)
                    .attr('data-code','')
                    .find('p')
                    .text('请选择');
            }
        });
    }

    /**
     * 添加某个类别的某个已选标签数据
     * @param {Object} item     需要被移除的标签数据
     * @param {String} klass    类别
     */
    exports.addSelLabel = function (item,klass){
        if(selectedLabel[klass]){
            if(!exist(item,selectedLabel[klass])){
                selectedLabel[klass].push(item);
            }
        }else{
            selectedLabel[klass] = [];
            selectedLabel[klass].push(item);
        }
    }

    /**
     * 移除对应类型某个已选标签数据
     * @param {Object} item     需要被移除的标签数据
     * @param {String} klass    类别
     */
    exports.removeSelLabel = function (item,klass){
        var items = selectedLabel[klass],
            len = items && items.length;
        if(items){
            for(var i=0; i<len; i++){
                if(items[i]&&items[i].code == item.code){
                    items.splice(i,1);
                }
            }
            if(items.length == 0){
                delete(selectedLabel[klass]);           
            }
        }     
    } 

    /**
     * 移除对应类型全部已选标签数据
     * @param {String} klass    类别
     */
    exports.delSelLabel = function(klass){
        delete selectedLabel[klass];
    }

    /**
     * 渲染周期下拉列表
     * @param {arr} cycle 周期数据
     */
    exports.renderCycleSel = function(cycle){

        var html = Template('cycle_wrap',{
            cycle:cycle
        });
        $('.screening-time .select-warp').html(html);
    }

    /**
     * 载入type分类下的二级标签
     * @param {String} url      请求url
     * @param {String} type     当前步骤容器id值
     * @param {Object} param    请求参数
     */
    exports.loadLevel2Data = function(url,type,param){
        majax({
            url:url,
            data:param,
            success:function(data){
                if(data.code == 200){
                    data = data.detail;
                    if(type=='area'){
                        exports.renderLevel2Html(data,type);
                    }else{
                        if(type=='action'){
                            cycle = data.cycle;
                            data = data.data;
                            exports.renderCycleSel(cycle);
                            exports.setCycle(cycle[0].code);
                        }
                        
                        exports.renderLevel2Html(data,type);
                        tagLevel3url = apiMap[type][1];
                        selLevel2Code = data[0].code;
                        var param = {};
                        exports.copyselectedLabel(param);
                        param.code = selLevel2Code
                        exports.loadLevel3Data(tagLevel3url,type,param);
                    }
                }else if(data.code == 300){
                    Ark.alert(data.message);
                }


            }

        })
    }

    /**
     * 渲染二级标签为dom
     * @param {Array||Object}   lables
     * @param {Sring}   type    当前步骤容器id值
     */
    exports.renderLevel2Html = function(lables,type){
        if(type=='area'){
            var area = lables.area,
                asset = lables.asset;
            area.sort(sortRule('num'));
            var maxNum = area[0].num;
            for(var i=0; i<area.length; i++){
                area[i].percent = (area[i].num / maxNum).toFixed(2)*100+'%';
                area[i].shortName = area[i].name.slice(0,3);
            } 
            var areaHtml = Template('area_list',{
                lables:area
            });
            var assetHtml = Template('asset_group',{
                lables:asset
            });
            // console.log(assetHtml);
            // console.log(area);
            // console.log(areaHtml);
            $('.scroll-warp#area ul').html(areaHtml);
            $('.screening-assets#asset').html(assetHtml);       
        }else{
            var tagLevel2html = Template('tagLevel2',{
                lables:lables
            })
            $("#" + type +' .screening-left .scroll-warp ul').html(tagLevel2html);
            $("#" + type +' .screening-left li:first').addClass('active');
        }
    }

    /**
     * 请求三级标签数据
     * @param {String} url      请求url
     * @param {String} type     当前步骤容器id值
     * @param {Object} param    请求参数 
     */
    exports.loadLevel3Data = function(url,type,param){
        majax({
            url:url,
            data:param,
            success:function(data){
                if(data.code == 200){
                    data = data.detail;
                    data.sort(sortRule('num'));
                    if(type == 'action'){

                    }else{
                        var maxNum = data[0].num;
                        for(var i=0; i<data.length; i++){
                            data[i].percent = (data[i].num / maxNum).toFixed(2)*100+'%';
                        }
                    }

                    // console.log(data);
                    exports.renderLevel3Html(data);
                }else if(data.code == 300){
                    Ark.alert(data.message);
                }

            }

        })
    }
    exports.renderLevel3Html = function(lables){
        var tagLevel3html = Template('tagLevel3',{
            lables:lables
        });
                var klass = $('.screening-show').attr('id');
            selectedLabel = module.exports.getSelectedLabel();
        $("#" + type +' .screening-right .scroll-warp ul').html(tagLevel3html);
        exports.checkState('all_' + type);

        exports.updateLevel3CheckState(selectedLabel,klass)
    }
    exports.updateLevel3CheckState = function(selectedLabel,klass){
        var labels = selectedLabel[klass],
            type = 'all_' + klass,
            len = labels && labels.length;
            if (labels){
                for(var i=0;i<len;i++){
                    var code = labels[i].code;
                    exports.updateRightLabelState(code,type,true);
                }
            }

    }

    /**
     * 更新已选客户数
     * 
     * @param {Object} selectedLabel
     */
    exports.updateSelectedCrowd = function (selected,timeStamp){
            var crowd = 0,
                $saveBtn = $('.billing .red.save'),
                selectedLabel = selected;
            majax({
                url:API.filtertag_selectnumber,
                data:selectedLabel,
                success:function(data){
                    if(data.code == 200){
                        if(timeStamp == newtimeStamp){
                            crowd = data.detail;
                            if(crowd == 0){
                                $saveBtn.addClass('disabled')
                            }else if(sequence[0] in selectedLabel){
                                $saveBtn.removeClass('disabled')                                
                            }
                            crowd = numberFormatter(crowd);
                            // console.log('显示本次请求结果')
                            var $span = $('.select-number span');
                            $span.find('b').text(crowd);
                            $span.removeClass('load');
                        }

                        // console.log('timeStamp:'+timeStamp);
                        // console.log('newtimeStamp:'+newtimeStamp);
                    }else if(data.code == 300){
                        Ark.alert(data.message);
                    }
        
                }
            })
        }
    
    /**
     * 更新已选标签DOM
     * 
     * @param {Object} selectedLabel    已选标签数据
     * @param {String} type             当前步骤容器id值
     */
    exports.updateSelectedDom = function (selectedLabel,type){
        var pageNum = module.exports.getPageNum(),
            $saveBtn = $('.billing .red.save');       

        if(pageNum>2){
            var seq = sequence.slice();
            for(var i=0;i<sequence.length;i++){
                if(sequence[i] == 'area'){
                    seq.splice(i+1,0,'asset');
                    break;
                }
            }
            var selectedLabelHtml = Template(
                'selectedLabelList',
                {
                selectedLabel:selectedLabel,
                typeMap:typeMap,
                sequence:seq
            });
        }else{
            var selectedLabelHtml = Template(
                'selectedLabelList',
                {
                selectedLabel:selectedLabel,
                typeMap:typeMap,
                sequence:sequence
            });
        }

        $('#selected-wrap .scroll-content').html(selectedLabelHtml);
        

        if(pageNum == 3){
            $('#selected-wrap .scroll-content li#asset,#selected-wrap .scroll-content li#area')
                .addClass('active');            
        }else{
            $('#selected-wrap .scroll-content li')
                .removeClass('active')
                .closest('#'+type)
                .addClass('active');
        }
        var param = {};
        exports.copyselectedLabel(param);
        
        if(type=='action'){  //互联网行为不用再次请求已选客户数
            return false;
        }else{
            $saveBtn.addClass('disabled')
        }

        var $span = $('.select-number span');
        $span.addClass('load');
        clearTimeout(timer);
        var timeStamp = new Date().getTime();
        
        window.newtimeStamp = timeStamp;

        timer = setTimeout(function(){
            exports.updateSelectedCrowd(param,timeStamp)
        },1000);


        // timer = setTimeout(exports.updateSelectedCrowd,1000,param,timeStamp);
        // exports.updateSelectedCrowd(param);
    }

    /**
     * 更新三级标签勾选状态
     * @param code(@Sring)      需要更新状态的标签code值
     *        type(@String)     当前所属步骤类型
     *        tocheck(@Boolean) 是否更新为勾选状态
     */
    exports.updateRightLabelState = function(code,type,toCheck){
        var right_list = $('.screening-right li');
        right_list.each(function(){
            if($(this).data('code')==code){
                if(toCheck){
                    $(this).addClass('checked');    
                }else{
                    $(this).removeClass('checked');
                }
            }
        });
        exports.checkState(type);
    }

    /**
     * 根据sequence初始化筛选步骤
     * @param sequence(@Array) 筛选漏斗的步骤队列（队列顺序受入口影响）
     */
    exports.initLayout = function(sequence){
        var layoutHtml = Template('layout',{
            typeMap:typeMap,
            sequence:sequence
        });
        $('.main').html(layoutHtml);

    }

    /**
     * 将下拉列表置为初始状态（未选择状态，移除data-code属性绑定数据）
     */
    exports.initSelectWarp = function(){
        $('.screening-assets#asset .select-warp').each(function(){
            $(this).attr('data-code','');
            $(this).find('p').text('请选择');
        });
    }

    /**
     * 筛选页初始化
     */
    module.exports.init = function(){
        //确定进入标签筛选页的入口
        var entrance = getQuery('entrance');
        if(entrance=='product'){
            sequence = ['product','preference'].concat(sequence);
        }else if(entrance=='preference'){
            sequence = ['preference','product'].concat(sequence);
        }
        //type为当前正在操作部分标签分类的id
        type = sequence[pageNum];
        //初始化
        exports.initLayout(sequence);
        tagLevel2url = apiMap[type][0];
        exports.loadLevel2Data(tagLevel2url,type,queryParam);
        $('#' + sequence[pageNum]).removeClass('screening-show').addClass('screening-show');
        // selectedLabel[sequence[pageNum]] = [];

        exports.updateSelectedDom(selectedLabel,type);
        exports.updateBillingByStep(pageNum);
    }

    /**
     * 根据当前type载入筛选标签
     * @param type(@String)     本步骤type值（当前步骤容器id）
     *        param(@Object)    二级标签请求参数
     */
    exports.loadLablesByType = function(type,param){
        var url = apiMap[type][0];
        exports.loadLevel2Data(url,type,param);
        // console.log($($('.screening-left li')[0]));
    }

    /**
     * 根据当前步骤更新切换步骤按钮
     * 第一步无上一步、跳过
     * 最后一步无下一步、跳过
     * @param pageNum(@Number)  当前步骤序号
     */
    exports.updateBillingByStep = function(pageNum){
        if(pageNum==0){
            $('.billing .prev ,.billing  .skip').hide();
        }else{
            $('.billing .prev').show();
        }
        if(pageNum==4){
            $('.billing .next,.billing  .skip').hide();
        }else{
            $('.billing .next').show();
        }
        if(pageNum != 0 && pageNum != 4){
            $('.billing .next,.billing  .skip').show();            
        }
    }

    /**
     * 检查当前筛选第一步已选标签是否为空
     * return @Boolean
     */
    exports.checkEmpty = function(){
        var isEmpty = sequence[0] in selectedLabel;
        if(isEmpty){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 切换步骤（根据当前点击按钮的class确定下一步、上一步、跳过）
     * @param _this(jQuery Object)
     */
    exports.changeStep = function (_this) {
            var show = $(".screening-show");
            if ( _this.hasClass("prev")){
                if( show.prev().hasClass("screening")){
                    show.removeClass("screening-show").prev(".screening").addClass("screening-show");
                }
                pageNum--;
            var klass = sequence[pageNum];
            /**
             * 点击上一步时在地域资产页，额外舍弃资产类已选标签
             */
            if(pageNum == 2){
                exports.delSelLabel('asset');    
            }
            skipType = sequence[pageNum+1];
            exports.delSelLabel(skipType);
            }
            if (_this.hasClass("next")||_this.hasClass("skip")){

                if(pageNum == 4){

                }else{
                    if( show.next().hasClass("screening")){
                        show.removeClass("screening-show").next(".screening").addClass("screening-show");
                    }
                    pageNum++;
                }
                if(_this.hasClass("skip")){
                    // pageNum = exports.getPageNum();
                    var klass = sequence[pageNum];
                    skipType = sequence[pageNum-1];
                    // console.log('pageNum:'+pageNum);
                    // console.log('sequence:'+sequence);
                    // console.log('skipType:'+skipType);
                    if(pageNum == 4){
                        exports.delSelLabel('asset');
                        exports.initSelectWarp();    
                    }
                    exports.delSelLabel(skipType);
                    exports.checkAll('all_'+skipType,false);
                    exports.updateSelectedDom(selectedLabel,klass);
                    console.log(skipType);
                    exports.checkState('all_'+skipType);
                    console.log(selectedLabel)
                }
                

            }
            console.log('pageNum: '+pageNum);
            var type = $('.screening-show').attr('id');
            if (_this.hasClass("next")||_this.hasClass("skip")){
                var param = {};
                exports.copyselectedLabel(param);
                console.log('selectedLabel:');
                console.log(selectedLabel)
                exports.loadLablesByType(type,param);
            }
            exports.setType(type);
            exports.updateBillingByStep(pageNum);
            exports.updateSelectedDom(selectedLabel,type);
            console.log(type);
    }



});