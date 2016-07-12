(function(){
    'use strict';

    angular
        .module('sw.common')
        .controller('AlertCtrl', function($scope, parameters) {
            this.message = parameters;
            this.confirm = function(message){
                $scope.closeModal(message);
            };
            this.cancel = function(){
                $scope.closeModal(null);
            };
        });
}());