(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .controller('APIController', function ($state, $log, $q, $ionicConfig, $ionicLoading, $ionicHistory, $ionicScrollDelegate, LastFM, Utilities) {
            var $ctrl = this;

            $ctrl.output = '';

            $ctrl.apiMethods = [
                    {
                        id: 1, fn : searchAlbum, name: 'Search by Album', group:'Album',
                            params:[
                                    {id: 'albumName', label:'Album Name', required: true}
                                    ]
                    },
                    {
                        id: 2, fn : getAlbumTopTags, name: 'Get Top Tags (Album)', group:'Album',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'albumName', label:'Album Name', required: true}
                                    ]
                    },
                    {
                        id: 3, fn : getAlbumInfo, name: 'Get Info (Album)', group:'Album',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'albumName', label:'Album Name', required: true},
                                    {id: 'mbid', label:'Mbid', required: false}
                                    ]
                    },
                    {
                        id: 4, fn : getAlbumInfoById, name: 'Get Info by mbid (Album)', group:'Album', 
                            params:[
                                    {id: 'mbid', label:'Mbid', required: true}
                                    ]
                    },
                    {
                        id: 20, fn : getArtist, name: 'Get Artist', group:'Artist',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 21, fn : getSimilar, name: 'Get Similar (Artist)', group:'Artist',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 22, fn : getTopAlbums, name: 'Get Top Albums (Artist)', group:'Artist', 
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 23, fn : getTopTracks, name: 'Get Top Tracks (Artist)', group:'Artist', 
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 24, fn : getArtistTopTags, name: 'Get Top Tags (Artist)', group:'Artist',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 40, fn : searchTrack, name: 'Search by Track', group:'Track',
                            params:[
                                    {id: 'trackName', label:'Track Name', required: true}
                                    ]
                    },
                    {
                        id: 41, fn : getTrackInfo, name: 'Get Info (Track)', group:'Track',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'trackName', label:'Track Name', required: true},
                                    {id: 'mbid', label:'Mbid', required: false}
                                    ]
                    },
                    {
                        id: 42, fn : getSimilarTrack, name: 'Get Similar (Track)', group:'Track',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'trackName', label:'Track Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 43, fn : getTrackTopTags, name: 'Get Top Tags (Track)', group:'Track',
                            params:[
                                    {id: 'artistName', label:'Artist Name', required: true},
                                    {id: 'trackName', label:'Track Name', required: true},
                                    {id: 'mbid', label:'Mbid (takes precedence if entered)', required: false}
                                    ]
                    },
                    {
                        id: 60, fn : getTopArtists, name: 'Get Top Artists', group:'Charts',
                            params:[
                                    
                                    ]
                    },
                    {
                        id: 61, fn : getTopTracks, name: 'Get Top Tracks', group:'Charts',
                            params:[
                                    
                                    ]
                    },
                    {
                        id: 62, fn : getTopTags, name: 'Get Top Tags', group:'Charts',
                            params:[
                                    
                                    ]
                    },
                    // Geo
                    {
                        id: 80, fn : getTopGeoArtists, name: 'Get Top Artists', group:'Geo',
                            params:[
                                    {id: 'country', label:'Country (United Kingdom, Iceland etc.)', required: true}
                                    ]
                    },
                    {
                        id: 81, fn : getTopGeoTracks, name: 'Get Top Tracks', group:'Geo',
                            params:[
                                    {id: 'country', label:'Country (United Kingdom, Iceland)', required: true}
                                    ]
                    },
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
                        $ctrl.output = reason.statusTest || 'Error';
                    })
                    .finally(function(){
                        $ionicLoading.hide();
                    });
            }


            // Calls
            function searchAlbum(album){
                return LastFM.Album.search(album, {limit:2})
                    .then(function(response) {
                        return response.data.results.albummatches.album;
                    });
            }

            function getAlbumInfo(artist, album, mbid){
                return LastFM.Album.album(artist, album, mbid, {})
                    .then(function(response) {
                        return response.data.album || response.data.message;
                    });
            }
            function getAlbumInfoById(mbid){
                return LastFM.Album.albumById(mbid, {})
                    .then(function(response) {
                        return response.data.album || response.data.message;
                    });
            }

            function getAlbumTopTags(artist, album, mbid){
                // var mbid = '91fa2331-d8b4-4d1f-aa4d-53b1c54853e5'; // The Cure : Disintegration
                // mbid doesn't work (well)
                return LastFM.Album.topTags(artist, album, mbid, {})
                    .then(function(response) {
                        return response.data.toptags || []; // $http
                        // return response.toptags || [];   // $resource
                    });
            }

            // Artist
            function getArtist(artist, mbid){
                return LastFM.Artist.artist(artist, mbid, {})
                    .then(function(response) {
                        return response.data.artist || [];
                    });
            }
            function getSimilar(artist, mbid){
                return LastFM.Artist.similar(artist, mbid, {})
                    .then(function(response) {
                        return response.data.similarartists || [];
                    });
            }
            function getArtistTopTags(artist, mbid){
                return LastFM.Artist.topTags(artist, mbid, {})
                    .then(function(response) {
                        return response.data.toptags || [];
                    });
            }
            function getTopAlbums(artist, mbid){
                return LastFM.Artist.albums(artist, mbid, {})
                    .then(function(response) {                        
                        return response.data.topalbums || [];
                    });
            }
            function getTopTracks(artist, mbid){
                return LastFM.Artist.tracks(artist, mbid, {})
                    .then(function(response) {               
                        return response.data.toptracks || [];
                    });
            }

            // Track
            function searchTrack(track){
                return LastFM.Track.search(track, {limit:2})
                    .then(function(response) {
                        return response.data.results.trackmatches.track;
                    });
            }
            function getTrackInfo(artist, track, mbid){
                return LastFM.Track.track(artist, track, mbid, {})
                    .then(function(response) {
                        return response.data.track || response.data.message;
                    });
            }

            function getSimilarTrack(artist, track, mbid){
                return LastFM.Track.similar(artist, track, mbid, {})
                    .then(function(response) {
                        return response.data.similartracks || [];
                    });
            }

            // mbid does not work (well) for Tags : Have to send artist/tack
            function getTrackTopTags(artist, track, mbid){
                return LastFM.Track.topTags(artist, track, mbid, {})
                    .then(function(response) {
                        return response.data.toptags || [];
                    });
            }

            // Charts
            function getTopArtists(){
                return LastFM.Charts.topArtists({limit:2})
                    .then(function(response) {
                        return response.data.artists;
                    });
            }
            function getTopTracks(){
                return LastFM.Charts.topTracks({limit:2})
                    .then(function(response) {
                        return response.data.tracks;
                    });
            }
            function getTopTags(){
                return LastFM.Charts.topTags({limit:2})
                    .then(function(response) {
                        return response.data.tags;
                    });
            }

            // Geo
            function getTopGeoArtists(country){
                return LastFM.Geo.topArtists(country, {limit:2})
                    .then(function(response) {
                        console.log(response);
                        return response.data.topartists;
                    });
            }
            function getTopGeoTracks(country){
                return LastFM.Geo.topTracks(country, {limit:2})
                    .then(function(response) {
                        console.log(response);
                        return response.data.tracks;
                    });
            }
            

        });

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
/*

$ctrl.apiCallDirect = function(){
    
    
    var id,
        fn,
        args = Array.prototype.slice.call(arguments); // old skool
    //  args = Array.from(arguments); // or... (browser support!)
    // args = [...arguments]; // or... new skool (browser support!)

    id = args.shift() || null;
    if(!id){
        $log.warn('no id!');
        return;
    }
    $ctrl.output = '';

    fn = apiLookup[id];
    if(!fn) return;

    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    fn.apply(this, args)
        .then(function(data) {
            // $log.info('data ::: ', data);
            $ctrl.output = JSON.stringify(data, null, '    ');
        })
        .catch(function(reason) {
            $log.info('Error ::: ', reason);
            $ctrl.output = reason.statusTest || 'Error';
        })
        .finally(function(){
            $ionicLoading.hide();
        });
}
*/