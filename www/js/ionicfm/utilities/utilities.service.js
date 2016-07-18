(function(){
    'use strict';
    
    angular
        .module('sw.ionicfm')
        .factory('Utilities', Utilities);

    function Utilities($log, ModalService, $ionicLoading) {

        var placeholder = 'http://placehold.it/174x174';

        var Util = {

            getImage : function(collection, size){
                var imgsrc = '';
                if(collection.image && collection.image.length){
                    imgsrc = _.result(_.findWhere(collection.image, { 'size': size }), '#text');
                }
                if(collection && !imgsrc){
                    imgsrc = placeholder + '?text=no+image+for+' + collection.name;
                }
                return imgsrc;
            },
            getDuration : function(duration){
                var mins = ~~(duration / 60),
                    secs = duration % 60,
                    pretty = '' + mins + ':' + (secs < 10 ? '0' : '');
                pretty += '' + secs;
                return pretty;
            },
            openLink : function(url){
                window.open(url, '_blank');
            },
            showDataError :function(reason){
                return this.showAlert({
                                        body: reason.statusText || 'Bit of a problem loading data...Sorry.',
                                        title: reason.title || 'Error'
                                    });
            },
            showAlert :function(message){
                var params = angular.extend(
                            {title:'Error', body:'Sorry, there has been an error.'},
                            message || {});
                return ModalService.show('error-modal.html', 'AlertController as vm', params);
            },
            loadIndicator: {
                show: function(){
                    $ionicLoading.show({
                        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                    });
                },
                hide: function(){
                    $ionicLoading.hide();
                }
            }
        }

        return Util;
    }
    
}());