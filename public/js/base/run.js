define(function (require) {
    var commonDependences = [
        'modules/api',
        'lib/jquery-1.9.1.min'
    ];
    require.async(commonDependences, function () {

        if (window.localStorage && localStorage.getItem('autoplay')) {
            seajs.use('modules/autoplay');
        }

        require.async('modules/functions', function () {
            var runJs = $('#js-run').data('js');
            if (runJs) {
                require.async(runJs, function (exp) {
                    exp && exp.run && exp.run();
                });
            }
        });
    });
});