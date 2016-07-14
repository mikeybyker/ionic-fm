(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('AlbumController', function ($state, $log, $q, $ionicConfig, $ionicLoading, $ionicScrollDelegate, LastFM, Utilities, appModalService) {

            this.artistname = $state.params.artistname;
            this.albumId = $state.params.mbid;
            this.album = {};

            var self = this;

            if(this.albumId){
                $ionicLoading.show({
                  template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });
                // $log.info('this.albumId (mbid) ::: ', this.albumId);

                LastFM.Album.albumById(this.albumId, {})
                    .then(function(response) {
                        $log.info('LastFM.Album.albumById > response.data ::: ', response.data);
                        if(response.data.error){
                            var message = {statusText: response.data.message || 'Last.fm couldn\'t find the album', title:'Not Found'};
                            return $q.reject(message);
                        }
                        self.album = response.data.album;
                        self.mainimage = self.getImage(self.album, 'extralarge');
                        $ionicScrollDelegate.resize();
                    })
                    .catch(function(reason) {
                        Utilities.showDataError(reason)
                            .then(function(result) {
                                  $state.go('artist', {artistname: self.artistname});
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
        });
}());