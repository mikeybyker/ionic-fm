(function() {
    'use strict';

    angular
        .module('ionicfm')
        .component('apiInput', {
            bindings:{
                apiMethods: '<',
                onCall: '&'
            },
            controller: function($log, $scope){

                var $ctrl = this;
                this.selectedOption =  $ctrl.apiMethods[0];
                this.fields = {};
                this.callApi = callApi;
                this.selectChange = selectChange;

                function callApi()
                {
                    var params = getParamsArray($ctrl.selectedOption, $ctrl.fields),
                        o = {data: $ctrl.selectedOption, params: params};
                    // $log.info('Call method with : ', params);
                    $ctrl.onCall(o);
                }

                function getParamsArray(data, fields){
                    var params = [],
                        len = data.params.length;
                    for(var i=0;i<len;i++){
                        params.push(fields[data.params[i].id] || '');
                    }
                    return params;
                }

                // Just to clear the fields...
                function selectChange(){
                    $ctrl.fields = {};
                }
            },
            templateUrl: 'js/explorer/api-input.html'
        });

})();


// Or could $watch the selectedOption : probably overkill
/*
    var unwatch = $scope.$watch(function () {
       return $ctrl.selectedOption;
    },function(newValue, oldValue){
        if(newValue.id !== oldValue.id){
            $ctrl.fields = {};
        }
    });
*/

/*
    this.$onDestroy = function () {
        // If using $watch and if have cache-view="false", then kill the watch
        $log.info('tester component destroyed ');
        unwatch();
    };
*/