(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('AlbumController', function ($state, $log, $ionicConfig, $ionicLoading, $ionicScrollDelegate, LastFM, Utilities, appModalService) {

            this.artistname = $state.params.artistname;
            this.albumId = $state.params.mbid;
            this.album = {};
            // $ionicConfig.backButton.text(this.artistname);

            var self = this;

            if(this.albumId){
                $ionicLoading.show({
                  template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });
                // LastFM.getAlbumInfo(this.albumId, {})
                LastFM.Album.info(this.albumId, {})
                    .then(function(response) {
                        $log.info('getAlbumInfo > response ::: ', response);
                        if(response.error){
                            $log.warn('Last FM ERROR ::: ', response.message || 'Last.fm couldn\'t find the album');
                            var message = {body: response.message || 'Last.fm couldn\'t find the album', title:'Not Found'};
                            Utilities.showAlert(message)
                                .then(function(result) {
                                      $state.go('artist', {artistname: self.artistname});
                                });
                            return;
                        }
                        self.album = response.album;
                        self.mainimage = self.getImage(self.album, 'extralarge');
                        $ionicScrollDelegate.resize();
                    }, function(reason) {
                        $log.warn('Error ::: ', reason);
                        Utilities.showDataError(reason)
                            .then(function(result) {
                                  $state.go('home');
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