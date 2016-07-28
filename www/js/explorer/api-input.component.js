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

                var $ctrl = this,
                    mbidPattern = /^[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}$/;

                $ctrl.selectedOption =  $ctrl.apiMethods[0];
                $ctrl.fields = {};
                $ctrl.callApi = callApi;
                $ctrl.change = change;
                $ctrl.selectChange = selectChange;

                $ctrl.validMbid = false;

                function callApi()
                {
                    var params = getParamsArray($ctrl.selectedOption, $ctrl.fields),
                        o = {data: $ctrl.selectedOption, params: params};
                    // $log.info('Call method with : ', params);
                    $ctrl.onCall(o);
                }

                function change(value){
                    $ctrl.validMbid = mbidPattern.test(value);
                }
                function initFields(option){
                    var id;
                    $ctrl.acceptsMbid = false;
                    for(var i=0, len=option.params.length;i<len;i++)
                    {
                        id = option.params[i].id;

                        if(option.params[i].default){
                            $ctrl.fields[id] = option.params[i].default;
                        }
                        if(id === 'artistOrMbid')
                        {
                            $ctrl.acceptsMbid = true;
                            change($ctrl.fields[id] || '');
                        }
                    }
                    return false;
                }

                function getParamsArray(data, fields){
                    var params = [],
                        len = data.params.length;
                    for(var i=0;i<len;i++){
                        params.push(fields[data.params[i].id] || '');
                    }
                    return params;
                }

                function selectChange(){
                    $ctrl.fields = {};
                    $ctrl.validMbid = false;
                    initFields($ctrl.selectedOption);
                }

                // Init
                initFields($ctrl.selectedOption);
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