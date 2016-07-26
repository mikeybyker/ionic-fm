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
                            {id: 'artistOrMbid', label:'Artist Name Or mbid', required: true, default:'91fa2331-d8b4-4d1f-aa4d-53b1c54853e5'},
                            {id: 'albumName', label:'Album Name', required: true}
                            ]
            },
            {
                id: 2, fn : _getAlbumInfo, name: 'Get Info - Full', group:'Album',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name Or mbid', required: true},
                            {id: 'albumName', label:'Album Name', required: true}
                            ]
            },
            {
                id: 5, fn : searchAlbum, name: 'Search by Album', group:'Album',
                    params:[
                            {id: 'albumName', label:'Album Name', required: true}
                            ]
            },
            {
                id: 6, fn : _searchAlbum, name: 'Search by Album - Full', group:'Album',
                    params:[
                            {id: 'albumName', label:'Album Name', required: true}
                            ]
            },
            {
                id: 8, fn : getAlbumTopTags, name: 'Get Top Tags', group:'Album',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true, default:'The Cure'},
                            {id: 'albumName', label:'Album Name', required: true}
                            ]  // tags do not work with mbid despite what lastfm docs say
            },
            {
                id: 9, fn : _getAlbumTopTags, name: 'Get Top Tags - Full', group:'Album',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true, default:'Faith'},
                            {id: 'albumName', label:'Album Name', required: true}
                            ]  // tags do not work with mbid despite what lastfm docs say
            },

            // Artist
            {
                id: 20, fn : getTopAlbums, name: 'Get Top Albums', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 21, fn : _getTopAlbums, name: 'Get Top Albums - Full', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 23, fn : getArtist, name: 'Get Artist', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 24, fn : _getArtist, name: 'Get Artist - Full', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 26, fn : searchArtist, name: 'Search by Artist', group:'Artist',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true}
                            ]
            },
            {
                id: 27, fn : _searchArtist, name: 'Search by Artist - Full', group:'Artist',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true}
                            ]
            },
            {
                id: 29, fn : getSimilar, name: 'Get Similar', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 30, fn : _getSimilar, name: 'Get Similar - Full', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 32, fn : getArtistTopTags, name: 'Get Top Tags', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 33, fn : _getArtistTopTags, name: 'Get Top Tags - Full', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 35, fn : getTopTracks, name: 'Get Top Tracks', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },
            {
                id: 36, fn : _getTopTracks, name: 'Get Top Tracks - Full', group:'Artist',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'69ee3720-a7cb-4402-b48d-a02c366f2bcf'}
                            ]
            },

            // Charts
            {
                id: 40, fn : getTopArtists, name: 'Get Top Artists', group:'Charts',
                    params:[

                            ]
            },
            {
                id: 41, fn : _getTopArtists, name: 'Get Top Artists - Full', group:'Charts',
                    params:[

                            ]
            },
            {
                id: 43, fn : getChartsTopTags, name: 'Get Top Tags', group:'Charts',
                    params:[

                            ]
            },
            {
                id: 44, fn : _getChartsTopTags, name: 'Get Top Tags - Full', group:'Charts',
                    params:[

                            ]
            },
            {
                id: 46, fn : getChartsTopTracks, name: 'Get Top Tracks', group:'Charts',
                    params:[

                            ]
            },
            {
                id: 47, fn : _getChartsTopTracks, name: 'Get Top Tracks Full', group:'Charts',
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
                id: 61, fn : _getTopGeoArtists, name: 'Get Top Artists - Full', group:'Geo',
                    params:[
                            {id: 'country', label:'Country (United Kingdom, Iceland etc.)', required: true}
                            ]
            },
            {
                id: 63, fn : getTopGeoTracks, name: 'Get Top Tracks', group:'Geo',
                    params:[
                            {id: 'country', label:'Country (United Kingdom, Iceland)', required: true}
                            ]
            },
            {
                id: 64, fn : _getTopGeoTracks, name: 'Get Top Tracks - Full', group:'Geo',
                    params:[
                            {id: 'country', label:'Country (United Kingdom, Iceland)', required: true}
                            ]
            },

            // Track
            {
                id: 80, fn : searchTrack, name: 'Search', group:'Track',
                    params:[
                            {id: 'trackName', label:'Track Name', required: true}
                            ]
            },
            {
                id: 81, fn : _searchTrack, name: 'Search - Full', group:'Track',
                    params:[
                            {id: 'trackName', label:'Track Name', required: true}
                            ]
            },
            {
                id: 83, fn : getSimilarTrack, name: 'Get Similar', group:'Track',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'e7da35ed-ad25-4721-a3b2-43784fa4f856'},
                            {id: 'trackName', label:'Track Name', required: true}
                            ]
            },
            {
                id: 84, fn : _getSimilarTrack, name: 'Get Similar - Full', group:'Track',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'e7da35ed-ad25-4721-a3b2-43784fa4f856'},
                            {id: 'trackName', label:'Track Name', required: true}
                            ]
            },
            {
                id: 86, fn : getTrackTopTags, name: 'Get Top Tags', group:'Track',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'trackName', label:'Track Name', required: true}
                            ]  // tags do not work with mbid despite what lastfm docs say
            },
            {
                id: 87, fn : _getTrackTopTags, name: 'Get Top Tags - Full', group:'Track',
                    params:[
                            {id: 'artistName', label:'Artist Name', required: true},
                            {id: 'trackName', label:'Track Name', required: true}
                            ]  // tags do not work with mbid despite what lastfm docs say
            },
            {
                id: 89, fn : getTrackInfo, name: 'Get Info', group:'Track',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'e7da35ed-ad25-4721-a3b2-43784fa4f856'},
                            {id: 'trackName', label:'Track Name', required: true}
                            ]
            },
            {
                id: 90, fn : _getTrackInfo, name: 'Get Info - Full', group:'Track',
                    params:[
                            {id: 'artistOrMbid', label:'Artist Name or mbid', required: true, default:'e7da35ed-ad25-4721-a3b2-43784fa4f856'},
                            {id: 'trackName', label:'Track Name', required: true}
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
        // 91fa2331-d8b4-4d1f-aa4d-53b1c54853e5
        // function getAlbumInfoX(artistOrMbid, album){
        //     return LastFM.Album.albumX(artistOrMbid, album, {});
        // }
        function _getAlbumInfo(artist, album, mbid){
            return LastFM.Album._album(artist, album, mbid, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getAlbumInfo(artist, album, mbid){
            return LastFM.Album.album(artist, album, mbid, {});
        }
        // function getAlbumInfoById(mbid){
        //     return LastFM.Album.albumById(mbid, {});
        // }


        function _searchAlbum(album){
            return LastFM.Album._search(album, {limit:10})
                .then(function(response) {
                    return response.data.results;
                });
        }
        function searchAlbum(album){
            return LastFM.Album.search(album, {limit:10});
        }


        function _getAlbumTopTags(artistOrMbid, album){
            return LastFM.Album._topTags(artistOrMbid, album, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getAlbumTopTags(artistOrMbid, album){
            // var mbid = '91fa2331-d8b4-4d1f-aa4d-53b1c54853e5'; // The Cure : Disintegration
            // mbid doesn't work (well) with tags
            return LastFM.Album.topTags(artistOrMbid, album, {});
        }

        // Artist
        function _getTopAlbums(artistOrMbid){
            return LastFM.Artist._albums(artistOrMbid, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTopAlbums(artistOrMbid){
            return LastFM.Artist.albums(artistOrMbid, {});
        }


        function _getArtist(artistOrMbid){
            return LastFM.Artist._artist(artistOrMbid, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getArtist(artistOrMbid){
            return LastFM.Artist.artist(artistOrMbid, {});
        }


        function _searchArtist(artist, mbid){
            return LastFM.Artist._search(artist, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function searchArtist(artist, mbid){
            return LastFM.Artist.search(artist, {});
        }


        function _getSimilar(artistOrMbid){
            return LastFM.Artist._similar(artistOrMbid, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getSimilar(artistOrMbid){
            return LastFM.Artist.similar(artistOrMbid, {});
        }

        
        function _getArtistTopTags(artistOrMbid){
            return LastFM.Artist._topTags(artistOrMbid, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getArtistTopTags(artistOrMbid){
            return LastFM.Artist.topTags(artistOrMbid, {});
        }


        function _getTopTracks(artistOrMbid){
            return LastFM.Artist._tracks(artistOrMbid, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTopTracks(artistOrMbid){
            return LastFM.Artist.tracks(artistOrMbid, {});
        }

        // Charts
        function _getTopArtists(){
            return LastFM.Charts._topArtists({limit:10})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTopArtists(){
            return LastFM.Charts.topArtists({limit:10});
        }


        function _getChartsTopTags(){
            return LastFM.Charts._topTags({limit:10})
                .then(function(response) {
                    return response.data;
                });
        }
        function getChartsTopTags(){
            return LastFM.Charts.topTags({limit:10});
        }


        function _getChartsTopTracks(){
            return LastFM.Charts._topTracks({limit:10})
                .then(function(response) {
                    return response.data;
                });
        }
        function getChartsTopTracks(){
            return LastFM.Charts.topTracks({limit:10});
        }


        // Geo
        function _getTopGeoArtists(country){
            return LastFM.Geo._topArtists(country, {limit:10})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTopGeoArtists(country){
            return LastFM.Geo.topArtists(country, {limit:10});
        }


        function _getTopGeoTracks(country){
            return LastFM.Geo._topTracks(country, {limit:10})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTopGeoTracks(country){
            return LastFM.Geo.topTracks(country, {limit:10});
        }


        // Track
        function _searchTrack(track){
            return LastFM.Track._search(track, {limit:10})
                .then(function(response) {
                    return response.data;
                });
        }
        function searchTrack(track){
            return LastFM.Track.search(track, {limit:10});
        }

        
        function _getSimilarTrack(artistOrMbid, track){
            return LastFM.Track._similar(artistOrMbid, track, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getSimilarTrack(artistOrMbid, track){
            return LastFM.Track.similar(artistOrMbid, track, {});
        }

        // mbid does not work (well) for Tags : Have to send artist/tack
        function _getTrackTopTags(artist, track){
            return LastFM.Track._topTags(artist, track, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTrackTopTags(artist, track){
            return LastFM.Track.topTags(artist, track, {});
        }

        // e7da35ed-ad25-4721-a3b2-43784fa4f856
        function _getTrackInfo(artistOrMbid, track){
            return LastFM.Track._track(artistOrMbid, track, {})
                .then(function(response) {
                    return response.data;
                });
        }
        function getTrackInfo(artistOrMbid, track){
            return LastFM.Track.track(artistOrMbid, track, {});
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