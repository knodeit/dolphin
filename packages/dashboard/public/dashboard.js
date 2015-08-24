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

angular.module('dolphin.dashboard').run(['$location', '$rootScope', '$interpolate', function ($location, $rootScope, $interpolate) {
    $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
        if (current.pageSettings) {
            $rootScope.pageH1 = current.pageSettings.h1;
        }
    });
}]);