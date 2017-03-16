seajs.use([
    'dialog/popWindow'
], function () {
	var id = getQuery('id');

    $(document).ready(function(){
    	if(id){
			$(".left-nav li[data-id="+id+"]").addClass('active').siblings().removeClass("active");
		}else{
			$(".left-nav li[data-id=2]").addClass('active').siblings().removeClass("active");
		}

        $(".left-nav li").bind("mouseover",function(){
            var liNum = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            $(this).parent().next().find('li').eq(liNum).addClass('active').siblings().removeClass("active");
        });
        
        $(".left-nav").on('click','li',function(){
        	var $modelLi = $(this);
        	useModel($modelLi);
        });
        
        $(".modeling-screening li a").on('click',function(){
        	var $modelLi = $(".left-nav li.active");
			useModel($modelLi);
        });
    });
    function useModel($modelLi){
	    var modelId = $modelLi.data('id'),
			modelname = $modelLi.text();
		var ucmodel = {
	        id:modelId,
	        name:modelname
	    };
	    saveSelectedInSessionStorage('ucmodel',ucmodel);
	    window.location.href = '/report.html';
    }
});