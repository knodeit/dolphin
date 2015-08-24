'use strict';

angular.module('dolphin.system').config(function ($provide, $locationProvider) {
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
});

angular.module('dolphin.system').run(function ($state) {
    if (!window.dolphinInit) {
        setTimeout(function () {
            $state.go('front.setup');
        }, 0);
    }
});