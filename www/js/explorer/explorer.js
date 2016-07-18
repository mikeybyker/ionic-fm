(function(){
    'use strict';

    angular
        .module('ionicfm')
        .controller('ExplorerController', ExplorerController);

    function ExplorerController($log, $ionicLoading, $ionicScrollDelegate, LastFM) {
        
        var $ctrl = this;

        $ctrl.output = '';

        $ctrl.apiMethods = [
            // Album
            {
                id: 1, fn : getAlbumInfo, name: 'Get Info', group:'Album',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'albumName', label:'Album Name', required: true},
                            {id: 'mbid', label:'Mbid', required: false}
                            ]
            },
            {
                id: 2, fn : getAlbumInfoById, name: 'Get Info by mbid', group:'Album', 
                    params:[
                            {id: 'mbid', label:'Mbid', required: true}
                            ]
            },
            {
                id: 4, fn : searchAlbum, name: 'Search by Album', group:'Album',
                    params:[
                            {id: 'albumName', label:'Album Name', required: true}
                            ]
            },
            {
                id: 6, fn : getAlbumTopTags, name: 'Get Top Tags', group:'Album',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'albumName', label:'Album Name', required: true}
                            ]
            },

            // Artist
            {
                id: 20, fn : getTopAlbums, name: 'Get Top Albums', group:'Artist', 
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },
            {
                id: 22, fn : getArtist, name: 'Get Artist', group:'Artist',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },
            {
                id: 24, fn : searchArtist, name: 'Search by Artist', group:'Artist',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true}
                            ]
            },
            {
                id: 26, fn : getSimilar, name: 'Get Similar', group:'Artist',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },
            {
                id: 28, fn : getArtistTopTags, name: 'Get Top Tags', group:'Artist',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },
            {
                id: 30, fn : getTopTracks, name: 'Get Top Tracks', group:'Artist', 
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },

            // Charts
            {
                id: 40, fn : getTopArtists, name: 'Get Top Artists', group:'Charts',
                    params:[
                            
                            ]
            },
            {
                id: 42, fn : getChartsTopTags, name: 'Get Top Tags', group:'Charts',
                    params:[
                            
                            ]
            },
            {
                id: 44, fn : getChartsTopTracks, name: 'Get Top Tracks', group:'Charts',
                    params:[
                            
                            ]
            },

            // Geo
            {
                id: 60, fn : getTopGeoArtists, name: 'Get Top Artists', group:'Geo',
                    params:[
                            {id: 'country', label:'Country (United Kingdom, Iceland etc.)', required: true}
                            ]
            },
            {
                id: 62, fn : getTopGeoTracks, name: 'Get Top Tracks', group:'Geo',
                    params:[
                            {id: 'country', label:'Country (United Kingdom, Iceland)', required: true}
                            ]
            },

            // Track
            {
                id: 80, fn : searchTrack, name: 'Search by Track', group:'Track',
                    params:[
                            {id: 'trackName', label:'Track Name', required: true}
                            ]
            },
            {
                id: 82, fn : getSimilarTrack, name: 'Get Similar', group:'Track',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'trackName', label:'Track Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },
            {
                id: 84, fn : getTrackTopTags, name: 'Get Top Tags', group:'Track',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'trackName', label:'Track Name', required: true},
                            {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                            ]
            },
            {
                id: 88, fn : getTrackInfo, name: 'Get Info', group:'Track',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'trackName', label:'Track Name', required: true},
                            {id: 'mbid', label:'Mbid', required: false}
                            ]
            }
        ];

        $ctrl.apiCall = function(data, params){
            var fn;
            $ctrl.output = '';

            fn = data.fn;
            if(!fn) return;
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner></ion-spinner>'
            });
            fn.apply(this, params)
                .then(function(data) {
                    $ctrl.output = JSON.stringify(data, null, '    ');
                })
                .catch(function(reason) {
                    $log.warn('Error ::: ', reason);
                    $ctrl.output = reason.statusText || 'Error';
                })
                .finally(function(){
                    $ionicLoading.hide();
                    $ionicScrollDelegate.resize();
                });
        }


        // Calls

        // Album
        function getAlbumInfo(artist, album, mbid){
            return LastFM.Album.album(artist, album, mbid, {});
        }

        function getAlbumInfoById(mbid){
            return LastFM.Album.albumById(mbid, {});
        }

        function searchAlbum(album){
            return LastFM.Album.search(album, {limit:2});
        }

        function getAlbumTopTags(artist, album, mbid){
            // var mbid = '91fa2331-d8b4-4d1f-aa4d-53b1c54853e5'; // The Cure : Disintegration
            // mbid doesn't work (well)
            return LastFM.Album.topTags(artist, album, mbid, {});
        }


        // Artist
        function getTopAlbums(artist, mbid){
            return LastFM.Artist.albums(artist, mbid, {});
        }

        function getArtist(artist, mbid){
            return LastFM.Artist.artist(artist, mbid, {});
        }

        function searchArtist(artist, mbid){
            return LastFM.Artist.search(artist, {});
        }

        function getSimilar(artist, mbid){
            return LastFM.Artist.similar(artist, mbid, {});
        }

        function getArtistTopTags(artist, mbid){
            return LastFM.Artist.topTags(artist, mbid, {});
        }

        function getTopTracks(artist, mbid){
            return LastFM.Artist.tracks(artist, mbid, {});
        }


        // Charts
        function getTopArtists(){
            return LastFM.Charts.topArtists({limit:2});
        }

        function getChartsTopTags(){
            return LastFM.Charts.topTags({limit:2});
        }

        function getChartsTopTracks(){
            return LastFM.Charts.topTracks({limit:2});
        }


        // Geo        
        function getTopGeoArtists(country){
            return LastFM.Geo.topArtists(country, {limit:2});
        }

        function getTopGeoTracks(country){
            return LastFM.Geo.topTracks(country, {limit:2});
        }


        // Track
        function searchTrack(track){
            return LastFM.Track.search(track, {limit:2});
        }

        function getSimilarTrack(artist, track, mbid){
            return LastFM.Track.similar(artist, track, mbid, {});
        }

        // mbid does not work (well) for tags : Have to send artist/tack
        function getTrackTopTags(artist, track, mbid){
            return LastFM.Track.topTags(artist, track, mbid, {});
        }

        function getTrackInfo(artist, track, mbid){
            return LastFM.Track.track(artist, track, mbid, {});
        }


    }

}());

/*
Some mbids to try out...

    The Cure :
    69ee3720-a7cb-4402-b48d-a02c366f2bcf

    The Cure : Disintegration :
    91fa2331-d8b4-4d1f-aa4d-53b1c54853e5

    The Cure : Close To Me :
    b3f2fb94-2633-4c85-a796-94d231ec3026

*/