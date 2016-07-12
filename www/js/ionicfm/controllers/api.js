(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('APIController', function ($state, $log, $q, $ionicConfig, $ionicLoading, $ionicHistory, $ionicScrollDelegate, LastFM, Utilities) {
            var vc = this;
            var apiLookup = {
                1 : searchAlbum,
                2 : getTopTags
            };
            vc.apiCall = function(id, searchString){
                vc.output = '';
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                });
                apiLookup[id](searchString);
            }
            vc.output = '';

            function searchAlbum(album){
                LastFM.Album.search(album, {limit:2})
                    .then(function(response) {
                        vc.output = JSON.stringify(response.results.albummatches.album, null, '    ');
                    }, function(reason) {
                        $log.info('Error ::: ', reason);
                        vc.output = reason;
                    })
                    .finally(function(){
                        $ionicLoading.hide();
                    });
            }

            function getTopTags(){
                console.log('getTopTags');
                // getTopTags(artist, album, mbid, options)
                LastFM.Album.topTags('The Cure', 'Disintegration', null, {limit:2})
                    .then(function(response) {
                        $log.info(response);
                        if(!response.toptags){
                            return;
                        }
                        vc.output = JSON.stringify(response.toptags, null, '    ');
                    }, function(reason) {
                        $log.info('Error ::: ', reason);
                        vc.output = reason;
                    })
                    .finally(function(){
                        $ionicLoading.hide();
                    });
            }
        });

}());