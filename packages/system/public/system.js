'use strict';

angular.module('dolphin.system').config(function ($provide, $locationProvider, $urlRouterProvider) {
    $provide.decorator('$state', function ($delegate, $stateParams) {
        $delegate.forceReload = function (state) {
            return $delegate.go(state ? state : $delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });

    $locationProvider.html5Mode(true);

    //fixed bug with slash
    $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.url();

        // check to see if the path has a trailing slash
        if ('/' === path[path.length - 1]) {
            return path.replace(/\/$/, '');
        }

        if (path.indexOf('/?') > -1) {
            return path.replace('/?', '?');
        }

        return false;
    });
});

angular.module('dolphin.system').run(function ($state) {
    if (!window.dolphinInit) {
        setTimeout(function () {
            $state.go('front.setup');
        }, 0);
    }
});