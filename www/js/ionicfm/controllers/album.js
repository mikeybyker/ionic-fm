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
        this.getImage = Utilities.getImage;
        this.getDuration = Utilities.getDuration;
        this.openLink = Utilities.openLink;      

        if(this.albumId){
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });

            LastFM.Album.albumById(this.albumId, {})
                .then(function(response) {
                    // $log.info('LastFM.Album.albumById > response.data ::: ', response.data);
                    $ctrl.album = response;
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
        

    }
    
}());