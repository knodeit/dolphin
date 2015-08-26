'use strict';

angular.module('dolphin.dashboard', ['ncy-angular-breadcrumb', 'angular-growl']);

angular.module('dolphin.dashboard').config(['growlProvider', '$breadcrumbProvider', function (growlProvider, $breadcrumbProvider) {
    growlProvider.globalTimeToLive(3000);
    growlProvider.globalPosition('bottom-right');
    growlProvider.globalDisableCountDown(true);
    growlProvider.onlyUniqueMessages(false);

    $breadcrumbProvider.setOptions({
        prefixStateName: 'dashboard.index'
    });
}]);

angular.module('dolphin.dashboard').run(['$location', '$rootScope', '$interpolate', '$state', function ($location, $rootScope, $interpolate, $state) {
    $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
        if (current.pageSettings) {
            $rootScope.pageH1 = current.pageSettings.h1;
        }
    });

    //Acl
    $rootScope.$on('$stateChangeError', function (current, previous, rejection, fromState, fromParams, error) {
        if (error == '403') {
            console.log('Access denied 403');
            $state.go('front.index');
        }
    });
}]);