seajs.use([
	'modules/common',
	'lib/template',
    'dialog/popWindow'
],function(ark,template){
	var items = JSON.parse(window.sessionStorage.errorData),
		classification = getQuery('classification');
	$('body').on('click','.data-error dl dt',function(){
		$(this).closest('dl').toggleClass('open');
	});
	$(function(){
		$('.data-error-title').after(template('error-body',{items: items}));
		if(classification){
			$('#' + classification).addClass('open');			
		}else{
			$('dl:first').addClass('open');
		}
	});
});
