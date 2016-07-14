(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('ArtistController', function ($state, $log, $q, $ionicLoading, $ionicScrollDelegate, LastFM, Utilities) {

            this.artistname = $state.params.artistname;
            this.artist = {};
            this.albums = [];
            this.mainimage = '';

            if(this.artistname){
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });

                var self = this,
                    info = LastFM.Artist.artist(this.artistname, '', {}),
                    albums = LastFM.Artist.albums(this.artistname, '', {limit: 6});

                $q.all([info, albums])
                    .then(function(response) {
                        // $log.info('LastFM.Artist.artist > response ::: ', response);
                        if(!response[0].data.artist || !response[1].data.topalbums){
                            var message = {statusText: response.message || 'Bad data returned, sorry.', title:'Data Error'};
                            return $q.reject(message);
                        }
                        self.artist = response[0].data.artist;
                        self.albums = response[1].data.topalbums.album;
                        self.mainimage = Utilities.getImage(self.artist, 'extralarge');
                        $ionicScrollDelegate.resize();
                    })
                    .catch(function(reason) {
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
                // $log.info(album);
                if(album.mbid){
                    $state.go('album', {artistname: this.artistname, mbid: album.mbid});
                } else {
                    $log.warn('No mbid - can not lookup...');
                }
            };

            // For similar artists, lastfm don't provide the mbid, just the name.
            // Safe to get artist by name though, given they provided it...
            this.selectArtist = function(artist) {
                // $log.info('selectArtist ', artist, artist.name);
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