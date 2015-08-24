/**
 * Created by Vadim on 21.07.2015.
 */
'use strict';

angular.module('dolphin.dashboard').factory('Flash', ['growl', '$rootScope',
    function (growl, $rootScope) {
        var queueInfo = [];
        var queueSuccess = [];
        var queueWarning = [];
        var queueError = [];

        var methods = {
            info: function (message) {
                queueInfo.push(message);
            },
            success: function (message) {
                queueSuccess.push(message);
            },
            warning: function (message) {
                queueWarning.push(message);
            },
            error: function (message) {
                queueError.push(message);
            },
            showInfo: function (message) {
                growl.info(message);
            },
            showSuccess: function (message) {
                growl.success(message);
            },
            showWarning: function (message) {
                growl.warning(message);
            },
            showError: function (message) {
                growl.error(message);
            }
        };

        $rootScope.$on('$stateChangeSuccess', function () {
            while (queueInfo.length) {
                methods.showInfo(queueInfo.shift());
            }
            while (queueSuccess.length) {
                methods.showSuccess(queueSuccess.shift());
            }
            while (queueWarning.length) {
                methods.showWarning(queueWarning.shift());
            }
            while (queueError.length) {
                methods.showError(queueError.shift());
            }
        });

        return methods;
    }
]);
