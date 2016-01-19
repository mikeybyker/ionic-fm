(function(){
    'use strict';

    angular.module('sw.ionicfm')
        .controller('ArtistController', function ($state, $log, $ionicConfig, $ionicLoading, $ionicHistory, $ionicScrollDelegate, LastFM, Utilities) {

            this.artistname = $state.params.artistname;
            this.artist = {};
            this.albums = [];
            this.mainimage = '';
            // $ionicConfig.backButton.text('Search');

            if(this.artistname){
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });

                var self = this;
                LastFM.getAllArtist(this.artistname, {}, {limit: 6})
                    .then(function(response) {
                        $log.info('getAllArtist > response ::: ', response);
                        self.artist = response[0].artist;
                        $log.info('self.artist ::: ', self.artist);
                        self.albums = response[1].topalbums.album;
                        self.mainimage = Utilities.getImage(self.artist, 'extralarge');
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
            };

            this.getAlbum = function(album){
                $log.info(album);
                if(album.mbid){
                    $state.go('album', {artistname: this.artistname, mbid: album.mbid});
                }
            };

            // For similar artists, lastfm don't provide the mbid, just the name.
            // Safe to get artist by name though, given they provided it...
            this.selectArtist = function(artist) {
                $log.info('selectArtist ', artist, artist.name);
                if(artist.name){
                    $state.go($state.current, {artistname: artist.name}, {});
                }
            };

            this.getImage = function(artist, size){
                return Utilities.getImage(artist, size);
            };

            this.openLink = function(url){
                Utilities.openLink(url);
            };
        });

}());