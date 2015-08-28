/**
 * Created by jacksonstone1 on 6/30/15.
 */
'use strict';

angular.module('dolphin.blog')
    .directive('loop', function($compile) {

        return {

            restrict: 'E',
            trasclude: true,
            compile: function(element, attrs) {
                var toLoop = attrs.list;
                var theItem = '';
                var htmlText = '';
                var generating='';
                if(attrs.item !== undefined){
                    theItem = attrs.item;
                }
                else
                    theItem = 'post';

                if(attrs.glist !== undefined) {

                    var methodCalled = attrs.glist.substr(0,attrs.glist.indexOf(' '));
                    var parameters = attrs.glist.substr(attrs.glist.indexOf(' ') + 1);
                    console.log('These are the parameters: ' + parameters);
                    generating= '<div self-destruct ng-bind="generateMethod(\''+methodCalled+'\', '+ parameters +')"></div>';
                    console.log(generating);
                }
                    if(attrs.template !== undefined)
                    {var withStyle = 'blog/views/front/includes/loops/'+ attrs.template;

                        htmlText=generating + '<div ng-repeat="' + theItem + ' in '+ toLoop+'">' +
                        '<div data-ng-include="\''+ withStyle +'\'">' +
                        '</div>' + element.html() + '</div>';
                        element.html(htmlText);
                    }
                    else
                    {
                        htmlText=generating+'<div ng-repeat="'+ theItem + ' in '+ toLoop+'">' + element.html() + '</div>';
                        element.html(htmlText);
                    }





            }
        };
    })
    .directive('selfDestruct', function($rootScope) {
        return {
            restrict: 'A',
        link:function(scope,element,attrs)
        {
                element.remove();
        }};
    });