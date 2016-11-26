angular.module('seek', ['ngResource', 'ui.router'
                       ,'ui.bootstrap']) // About using multiple js files, look for angular multiple modules, angular multiple module in different files
                                                    // and js importing files.
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '../partials/home.html'
            })
            .state('about', {
                url: '/about',
                templateUrl: '../partials/about.html'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '../partials/contact.html'
            })
            .state('shop', {
                url: '/shop',
                templateUrl: '../partials/shop.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: '../partials/login.html'
            })
        $urlRouterProvider.otherwise("/home");
    })

    .factory('UsersFactory', function ($http, $state) {
        return {
            post: function (successCallback, errorCallback) {

                var params = $state.params.login;

                // console.log(params);

                $http({ url: '/api/users',
                        method: 'POST',
                        data: { 'data': params }
                    })
                    .success(function (data) {
                        if (successCallback) {
                            successCallback(data);
                        }
                    })
                    .error(function (data) {
                        if (errorCallback) {
                            errorCallback(data);
                        }
                    });
            }
        }
    })

    .directive('new', function ($compile) {
        return {
            restrict: 'E',
            scope : {
                param : '=attrs'
                , size : '=size'
            },
            link: function (scope, element, attr, ctrl) {
            }
        }
    })

    .controller('LoginCtrl',function($scope, $state, $uibModal, NewsFactory, UsersFactory) {
    })

    /* Controller que gerencia a página de notícias. */
    .controller('HomeCtrl',function($scope) {
    })

    .controller('MainCtrl', function($scope, $location, $timeout) {
    })
