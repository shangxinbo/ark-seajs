
define(function (require) {

    window.STATIC = '/js/';

    var commonDependences = [
        STATIC+'modules/api',
        STATIC+'lib/jquery-1.9.1.min'
    ];

    require.async(commonDependences, function () {

        if (window.localStorage && localStorage.getItem('autoplay')) {
            seajs.use(STATIC+'modules/autoplay');
        }

        require.async(STATIC+'modules/functions', function () {
            var runJs = $('#js-run').data('js');
            if (runJs) {
                require.async(STATIC+runJs, function (exp) {
                    exp && exp.run && exp.run();
                });
            }
        });
    });
});