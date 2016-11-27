angular.module('hackathon', ['ngResource', 'ui.router' ]) // About using multiple js files, look for angular multiple modules, angular multiple module in different files
                                                    // and js importing files.
    .factory('ProductsFactory', function ($http, $state) {
        return {
            get: function (successCallback, errorCallback) {

                var params = $state.params.searchKey;

                console.log(params);
                console.log('oi ' + $state.params.searchKey);

                $http({ url: '/product',
                        method: 'GET',
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

    .controller('MainCtrl', function($scope, $state, $location, $timeout, ProductsFactory) {
        $scope.partial = "partials/home.html"

        $scope.searchProducts = function(key) {
            $state.params.searchKey = key;
            console.log(key);
            // console.log('Should be searching with key: ' + $scope.searchKey);

            ProductsFactory.get(function(data) {
                // Se retornou só um produto, o usuário não precisa
                // marcar qual marca quer. Pula para a próxima tela.
                $scope.produtos = data.arr;

                console.log('Success receiving data!');
            }, function() {
                console.log('Error getting products from ProductsFactory.');
            });
        }

        $scope.choseProduct = function(index) {
            $scope.produto = $scope.produtos[index];
            $scope.partial = 'partials/produto.html';
        }
    })