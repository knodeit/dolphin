'use strict';

angular.module('dolphin.system').factory('GridService', ['$q', '$http',
    function ($q, $http) {
        var Reader = function (url, filters) {
            var deferred = $q.defer();
            this.url = url;
            this.filters = filters || {};
            this.init().then(function () {
                deferred.resolve(this);
            }.bind(this));
            return deferred.promise;
        };

        Reader.prototype = {
            init: function () {
                this.rows = [];
                this.currentPage = 1;
                this.maxSize = 5;
                this.perPage = 20;
                this.totalRows = 0;
                this.busy = false;
                return this.nextPage();
            },
            nextPage: function (page) {
                if (this.busy) {
                    return;
                }

                var deferred = $q.defer();
                this.busy = true;
                var params = {
                    page: page ? page : this.currentPage,
                    perPage: this.perPage,
                    filters: this.filters
                };
                $http.get(this.url, {params: params}).success(function (data) {
                    this.busy = false;
                    this.rows = data.rows;
                    this.perPage = data.perPage;
                    this.totalRows = data.count;
                    deferred.resolve();
                }.bind(this)).error(function (err) {
                    console.log(err);
                    deferred.resolve();
                });
                return deferred.promise;
            },
            resetFilters: function () {
                this.filters = {};
                this.nextPage(0);
            }
        };
        return Reader;
    }
]);
