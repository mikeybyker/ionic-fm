(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('AlbumController', AlbumController);

    function AlbumController ($state, $log, $q, $ionicLoading, $ionicScrollDelegate, LastFM, Utilities) {

        var $ctrl = this;

        this.artistname = $state.params.artistname;
        this.albumId = $state.params.mbid;
        this.album = {};        

        if(this.albumId){
            $ionicLoading.show({
              template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });

            LastFM.Album.albumById(this.albumId, {})
                .then(function(response) {
                    // $log.info('LastFM.Album.albumById > response.data ::: ', response.data);
                    if(response.data.error){
                        var message = {statusText: response.data.message || 'Last.fm couldn\'t find the album', title:'Not Found'};
                        return $q.reject(message);
                    }
                    $ctrl.album = response.data.album;
                    $ctrl.mainimage = $ctrl.getImage($ctrl.album, 'extralarge');
                    $ionicScrollDelegate.resize();
                })
                .catch(function(reason) {
                    Utilities.showDataError(reason)
                        .then(function(result) {
                              $state.go('artist', {artistname: $ctrl.artistname});
                        });
                })
                .finally(function(){
                    $ionicLoading.hide();
                });
        }

        this.getImage = function(collection, size){
            return Utilities.getImage(collection, size);
        }
        this.getDuration = function(duration){
            return Utilities.getDuration(duration);
        }
        this.openLink = function(url){
            Utilities.openLink(url);
        };
    }
    
}());