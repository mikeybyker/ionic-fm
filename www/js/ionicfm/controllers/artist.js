(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('ArtistController', ArtistController);

    function ArtistController($state, $log, $q, $ionicScrollDelegate, LastFM, Utilities) {

        var $ctrl = this;

        this.artistname = $state.params.artistname;
        this.artist = {};
        this.albums = [];
        this.mainimage = '';
        this.getImage = Utilities.getImage;
        this.openLink = Utilities.openLink;

        if(this.artistname){
            
            Utilities.loadIndicator.show();

            var info = LastFM.Artist.artist(this.artistname, '', {}),
                albums = LastFM.Artist.albums(this.artistname, '', {limit: 6});

            $q.all([info, albums])
                .then(function(response) {
                    $log.info('LastFM.Artist.artist > response ::: ', response);
                    if(!response[0] || !response[1]){
                        var message = {statusText: response.message || 'Bad data returned, sorry.', title:'Data Error'};
                        return $q.reject(message);
                    }
                    $ctrl.artist = response[0];
                    $ctrl.albums = response[1];
                    $ctrl.mainimage = Utilities.getImage($ctrl.artist, 'extralarge');
                    $ionicScrollDelegate.resize();
                })
                .catch(function(reason) {
                    Utilities.showDataError(reason)
                        .then(function(result) {
                            $state.go('home');
                        });
                })
                .finally(function(){
                    Utilities.loadIndicator.hide();
                });
        };

        this.getAlbum = function(album){
            if(album.mbid){
                $state.go('album', {artistname: this.artistname, mbid: album.mbid});
            } else {
                $log.warn('No mbid - can not lookup...');
            }
        };

        // For similar artists, lastfm don't provide the mbid, just the name.
        // Safe to get artist by name though, given they provided it...
        this.selectArtist = function(artist) {
            if(artist.name){
                $state.go($state.current, {artistname: artist.name}, {});
            }
        };

        
    }

}());