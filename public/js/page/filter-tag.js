seajs.use([
    'modules/filter-tag',
    'lib/template',
    'modules/common',
    'dialog/popWindow'
],function(Filter,Template,Ark){
    $(function(){

        Filter.init();
        var sequence = Filter.getSequence(),
        apiMap = Filter.getApiMap(),
        selectedLabel = Filter.getSelectedLabel(),
        type = Filter.getType(),
        file = getQuery('file'),
        pageNum = Filter.getPageNum();
        // $(".billing a.changeStep").click(Filter.changeStep);
        $(".scroll-warp").scrollBar();

        var disabled = false ; //提交按钮避免重复提交

        function checkAllData(check,$wrap_ul,_this){
            var type = _this.data('type'),
                klass = _this.closest('.screening-show').attr('id');
                                            
            $wrap_ul.find('li').each(function(i){
                var code = $(this).data('code'),
                    text = $(this).find('.text span').text(),
                    item = {};
                    item.code = code;
                    item.text = text;
                if(check){
                    Filter.addSelLabel(item,klass);
                }else{
                    Filter.removeSelLabel(item,klass);           
                }
            });
        }
        function selLiHandle(_this){
            var code = _this.data('code'),
                text = _this.text(),
                $p_div = _this
                            .closest('.select-warp')
                            .attr('data-code',code)
                            .find('p')
                            .text(text);
        }
        function hidechildren($element) {
            $(document).click(function (e) {
                if (!(e.target == $element || $.contains($element, e.target))) {
                    $($element).find(".select-warp").removeClass("select-open");
                }
            });
        }
        function updateBtnState(){
            if(Filter.checkEmpty()){
                $('.billing .save,.billing .next').addClass('disabled');
            }else{
                $('.billing .next').removeClass('disabled');
            } 
        }
        var sel_time = document.querySelector('.screening-time'),
            sel_assets = document.querySelector('.screening-assets');
        hidechildren(sel_time);
        hidechildren(sel_assets);
        
        
        $('body').on('click','.all-button p',function(){
            var type = $(this).data('type'),
                $wrap_ul = $(this).closest('.screening-right').find('ul'),
                klass = $(this).closest('.screening-show').attr('id');
                // selectedLabel = Filter.getSelectedLable();                
            $(this).toggleClass('checked');
            if ($(this).hasClass('checked')){
                Filter.checkAll(type,true);
                checkAllData(true,$wrap_ul,$(this));                       
            }else{
                Filter.checkAll(type,false);
                checkAllData(false,$wrap_ul,$(this));
            }
            Filter.updateSelectedDom(selectedLabel,klass); 
            updateBtnState();          
        }).on('click','.scroll-content.screening-item li>p.text,.screening-assets li>p.text',function(){
            $(this).closest('li').toggleClass('checked');
            var type = $(this).closest('.screening-right').find('.all-button p').data('type'),
                code = $(this).closest('li').data('code'),
                text = $(this).find('span').text(),
                klass = $(this).closest('.screening-show').attr('id'),
                // selectedLabel = Filter.getSelectedLable(),
                item = {};
                item.code = code;
                item.text = text;
            if($(this).closest('div').hasClass('screening-assets')){
                klass = 'asset';
            }
            Filter.checkState(type);
            if($(this).closest('li').hasClass('checked')){
                Filter.addSelLabel(item,klass);
            }else{
                Filter.removeSelLabel(item,klass);
            }

            Filter.updateSelectedDom(selectedLabel,klass);
            updateBtnState();

        }).on('click','.screening-left li',function(){
            $(this).siblings('li').removeClass('active');
            $(this).addClass('active');
            var type = $(this).closest('.screening-show').attr('id'),
                tagLevel3url = apiMap[type][1],
                selLevel2Code = $(this).data('code'),
                klass = $('.screening-show').attr('id'),
                param = {};
                Filter.copyselectedLabel(param);
                if(type in param){
                    if(type == 'area'){
                        if('asset' in param){
                            delete param.asset;
                        }
                    }
                    delete param[type];
                    
                }
                param.code = selLevel2Code;
                
            Filter.loadLevel3Data(tagLevel3url,type,param);
            // Filter.updateLevel3CheckState(selectedLable,klass);
        }).on('click','.select-warp',function(){
            $(this).siblings('.select-warp').removeClass('select-open');
            $(this).toggleClass('select-open');
        }).on('click','.select-warp li',function(){
            selLiHandle($(this));
            if($(this).closest('.screening-show').attr('id')=='area'){
                var code = $(this).data('code'),
                    text = $(this).text(),
                    klass = $(this).closest('.screening-assets').attr('id'),
                    $sibling = $(this).siblings('li'),
                    sItem = {},
                    sText = $sibling.text(),
                    sCode = $sibling.data('code'),
                    // selectedLabel = Filter.getSelectedLable(),                      
                    item = {};
                    sItem.code = sCode;
                    sItem.text = sText;
                    item.code = code;
                    item.text = text;
                    Filter.removeSelLabel(sItem,klass);
                    Filter.addSelLabel(item,klass);
                Filter.updateSelectedDom(selectedLabel,klass);
            }else if($(this).closest('.screening-show').attr('id')=='action'){
                var cycleCode = $(this).data('code');
                Filter.setCycle(cycleCode);
            }

        }).on('click','.cart-warp .select-center p i',function(){
            var item = {},
                code = $(this).closest('p').data('code'),
                text = $(this).prev('span').text(),
                klass = $('.screening-show').attr('id'),
                type = 'all_'+klass;
                item.code = code;
                item.text = text;
                Filter.updateRightLabelState(code,type);           

            if($(this).closest('li').attr('id')=='asset'){
                klass = 'asset';
                var thisCode = $(this).closest('p').data('code');
                Filter.recoverSel(thisCode);
            }
            Filter.removeSelLabel(item,klass);
            Filter.updateSelectedDom(selectedLabel,klass);
            updateBtnState();
        }).on('click','.save.red',function(){
            /**
             * 判断是否允许保存
             */
            pageNum = Filter.getPageNum(); 
            function showDialog(){
                $('#dialog_submit li input,#dialog_submit li textarea')
                    .removeClass('error')
                    .val('')
                    .siblings('p.error')
                    .hide();

                if(!file){
                    $('#dialog_submit h4').text('创建新客营销项目');
                }

                getWindow('dialog_submit');
            }  
            if(pageNum == 0){
                if(Filter.checkEmpty()){
                    Ark.alert('请选择标签再进行下一步操作！');                    
                }else{
                    showDialog();
                }
            }else{
                showDialog();              
            }
            
        }).on('click','.billing a.changeStep',function(){
            /**
             * 判断是否允许进入下一步骤（第一步骤所选标签非空时可进入下一步骤）
             */
            pageNum = Filter.getPageNum();   
            if(pageNum == 0){
                if(Filter.checkEmpty()){
                    Ark.alert('请选择标签再进行下一步操作！');                    
                }else{
                    Filter.changeStep($(this));
                }
            }else{
                Filter.changeStep($(this));                
            } 
        }).on('click','#dialog_submit a.red',function(){
            var $project_name = $('#dialog_submit li:eq(0) input'),
                $contacts = $('#dialog_submit li:eq(1) input'),
                $describe = $('#dialog_submit li:eq(2) textarea');
                project_name = $project_name.val(),
                contacts = $contacts.val(),
                describe  = $describe.val(),
                cycle_time = Filter.getCycle(),
                param = {};
                Filter.copyselectedLabel(param);
                param.project_name = project_name;
                param.describe = describe;
                param.contacts = contacts;

                pageNum = Filter.getPageNum();
                if(pageNum == 4){
                    param.cycle_time = cycle_time;
                }

                sequence = Filter.getSequence();
                if(sequence[0] == 'preference'){
                    param.type = 1;
                }else if(sequence[0] == 'product'){
                    param.type = 0;
                }
                function showErr(_this,mess){
                    _this
                        .addClass('error')
                        .siblings('p.error')
                        .show()
                    if(mess){
                        _this
                            .siblings('p.error')
                            .find('span')
                            .text(mess);
                    }
                }
                function checkInput(){
                    var errorQueue = [],
                        regExp = new RegExp("^[\u4E00-\u9FFFa-zA-Z0-9]*$");
                        if(!regExp.test(project_name) || project_name == '' ){
                            errorQueue.push($project_name);
                        }
                        if(!regExp.test(contacts) || contacts == '' ){
                            errorQueue.push($contacts);   
                        }
                        if(!regExp.test(describe) || describe == '' ){
                            errorQueue.push($describe);   
                        }
                        if(errorQueue.length == 0){
                            return true;
                        }else{
                            for(var i=0;i<errorQueue.length;i++){
                                showErr(errorQueue[i]);
                            }
                            return false;
                        }
                }

                if(checkInput()){
                    if(disabled==true){
                        return false;
                    }
                    disabled = true;
                    majax({
                        url:API.stockProject_saveProject,
                        data:param,
                        success:function(data){
                            disabled = false
                            if(data.code == 200){
                                if('file' in param){
                                    window.location.href = '/project/list_stock.html';
                                }else{
                                    window.location.href = '/project/list_new.html';
                                }
                            }else if(data.code == 30001){
                                // console.log(data.message)
                                showErr($project_name,data.message);
                            }else if(data.code == 30002){
                                // console.log(data.message)
                                showErr($contacts,data.message);
                            }else if(data.code == 30003){
                                // console.log(data.message)
                                showErr($describe,data.message);
                            }else if(data.code == 30000){
                                // console.log(data.message)
                                showErr($project_name,data.message);
                            }else if(data.code == 300){
                                Ark.alert(data.message);
                            }
                        }
                    });
                }

        }).on('click','#dialog_submit li input,#dialog_submit li textarea',function(){
                $(this)
                    .removeClass('error')
                    .siblings('p.error')
                    .hide();
        });
    });
});