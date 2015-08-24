'use strict';

angular.module('dolphin.setup').factory('SetupService', ['Upload', function (Upload) {
    return {
        isInitialized: function () {
            return window.dolphinInit;
        },
        save: function (form, file) {
            return Upload.upload({
                url: '/setup/front/init',
                fields: form,
                file: file
            });
        }
    };
}]);
