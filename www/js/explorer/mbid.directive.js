(function() {
    'use strict';

    angular
        .module('ionicfm')
        .directive('mbid', mbid);

        function mbid(){
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    ctrl.$validators.mbid = function(modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }
                        return /^[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}$/.test(viewValue);
                    };
                }
            };
        }

})();