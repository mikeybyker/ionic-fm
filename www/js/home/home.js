(function(){
    'use strict';

    angular
        .module('ionicfm')
        .controller('HomeController', HomeController);

    function HomeController($state, $log, Utilities, LastFM) {

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

            Utilities.loadIndicator.show();

            LastFM.Artist.search(this.master.artist, {limit:5})
                .then(function(results) {
                    $ctrl.potentials = results;
                })
                .catch(function(reason) {
                    $log.warn('Error ::: ', reason);
                    Utilities.showDataError(reason);
                })
                .finally(function(){
                    Utilities.loadIndicator.hide();
                });
        };

        this.reset();

    }

}());