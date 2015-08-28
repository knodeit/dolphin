'use strict';

angular.module('dolphin.blog', ['ngTagsInput', 'ckeditor', 'ngSanitize', 'facebook']).config(function (FacebookProvider) {
    // Set your appId through the setAppId method or
    // use the shortcut in the initialize method directly.
    FacebookProvider.init('1458865941081471');
});


/*.run(['$rootScope', '$window',
 function($rootScope, $window) {
 console.log('ran the thing');
 var testAPI = function() {
 console.log('Welcome!  Fetching your information.... ');
 FB.api('/me', {fields:['first_name','email']}, function(response1) {

 $rootScope.$apply(function(){
 $rootScope.FBinfo = response1;
 console.log('just called apply');
 });

 console.log($rootScope.FBinfo);

 });
 };
 $rootScope.user = {};

 function statusChangeCallback(response) {
 console.log('statusChangeCallback');
 console.log(response);
 if (response.status === 'connected') {
 // Logged into your app and Facebook.
 console.log('logged into it');
 testAPI();
 } else if (response.status === 'not_authorized') {
 // The person is logged into Facebook, but not your app.
 console.log('not logged into app');
 } else {
 console.log('not logged into facebook');
 }
 }
 $window.fbAsyncInit = function() {
 console.log('called fbAsyncInit');
 FB.init({
 appId      : '1458865941081471',
 xfbml      : true,
 version    : 'v2.4',
 channel    : './front/includes/facebook.html'
 });


 var getUserInfo = function() {
 console.log('just got user data');
 FB.api('/me', function(res) {

 $rootScope.$apply(function() {
 testAPI();
 console.log('called getUserInfo');

 });

 });

 };
 var logout = function() {
 $rootScope.$apply(function() {
 $rootScope.FBinfo = undefined;
 });
 };

 FB.getLoginStatus(function(response) {
 console.log('FB asyncInit getLoginStatus');
 statusChangeCallback(response);
 });

 FB.Event.subscribe('auth.login', function(res) {

 getUserInfo();
 console.log('just login');
 console.log(res.authResponse);
 });
 FB.Event.subscribe('auth.logout', function(res) {

 logout();
 console.log('just logged out');
 });
 FB.Event.subscribe('auth.authResponseChange', function(res) {
 if (res.status === 'connected') {
 getUserInfo();

 }
 else {
 console.log('wants to end session');

 }

 });
 };
 (function(d){
 // load the Facebook javascript SDK
 console.log('loading fb sdk');
 var js,
 id = 'facebook-jssdk',
 ref = d.getElementsByTagName('script')[0];

 if (d.getElementById(id)) {
 return;
 }

 js = d.createElement('script');
 js.id = id;
 js.async = true;
 js.src = 'http://connect.facebook.net/en_US/sdk.js';

 ref.parentNode.insertBefore(js, ref);

 }(document));
 }]);
 */

angular.module('dolphin.blog').filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});
