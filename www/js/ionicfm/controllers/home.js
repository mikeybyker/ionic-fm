(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('HomeController', function ($state, $log, $ionicLoading, Utilities, LastFM) {

            this.hideBack = true;
            this.master = {artist: 'The Cure'};
            this.potentials = [];

            this.reset = function() {
                this.user = angular.copy(this.master);
            };

            this.doSearch = function() {
                var self = this;
                this.master = angular.copy(this.user);
                if(!this.master.artist){
                    return;
                }
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });
                LastFM.Artist.search(this.master.artist, {limit:5})
                    .then(function(response) {
                        $log.info('searchArtists > response ::: ', response.data);
                        // self.potentials = response.results.artistmatches.artist; // $resource
                        self.potentials = response.data.results.artistmatches.artist;
                    }, function(reason) {
                        $log.info('Error ::: ', reason);
                        Utilities.showDataError(reason);
                    })
                    .finally(function(){
                        $ionicLoading.hide();
                    });
            };
            this.getImage = function(artist, size){
                return Utilities.getImage(artist, size);
            }

            this.reset();

        });
}());

/*

Testing...

// $log.info('?? Version : ', LastFM.version);

// Artist
// LastFM.Artist.search('The Cure', {limit:2})
// LastFM.Artist.artist('The Cure', '', {})
// LastFM.Artist.albums('The Cure', '', {limit:2})
// LastFM.Artist.tracks('The Cure', '', {limit:2})
// LastFM.Artist.similar('The Cure', '', {limit:2})
// LastFM.Artist.topTags('The Cure', '', {})
// Album
// LastFM.Album.album('The Cure', 'Faith', '', {})
// LastFM.Album.albumById('91fa2331-d8b4-4d1f-aa4d-53b1c54853e5', {})
// LastFM.Album.search('Disintegration', {limit:2})
LastFM.Album.topTags('The Cure', 'Disintegration', '', {})
 .then(function(response) {
                        $log.info('NEW ::: ', response.data);
                        // self.potentials = response.data.results.artistmatches.artist;
                    }, function(reason) {
                        $log.info('Error ::: ', reason);
                    });
//

*/