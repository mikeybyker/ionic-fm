(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('HomeController', HomeController);

    function HomeController($state, $log, $ionicLoading, Utilities, LastFM) {

        var $ctrl = this;

        this.hideBack = true;
        this.master = {artist: 'The Cure'};
        this.potentials = [];
        this.getImage = Utilities.getImage;       

        this.reset = function() {
            this.user = angular.copy(this.master);
        };

        this.doSearch = function() {
            this.master = angular.copy(this.user);
            if(!this.master.artist){
                return;
            }
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });
            LastFM.Artist.search(this.master.artist, {limit:5})
                .then(function(results) {
                    $ctrl.potentials = results;
                })
                .catch(function(reason) {
                    $log.warn('Error ::: ', reason);
                    Utilities.showDataError(reason);
                })
                .finally(function(){
                    $ionicLoading.hide();
                });
        };

        this.reset();

    }

}());