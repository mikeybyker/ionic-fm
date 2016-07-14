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
                        // $log.info('searchArtists > response ::: ', response.data);
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