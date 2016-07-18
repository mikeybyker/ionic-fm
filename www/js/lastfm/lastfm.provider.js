(function(){
    'use strict';

    angular
        .module('sw.lastfm', [])
        .provider('LastFM', LastFM);

    function LastFM(){

        var endPoint = 'http://ws.audioscrobbler.com/2.0/',
            that = this,
            config = {api_key: null, format: 'json'};

        this.setAPIKey = function (key) {
            config.api_key = key;
            return config.api_key;
        };
        this.getAPIKey = function () {
            return config.api_key;
        };
        this.setFormat = function (format) {
            config.format = format;
            return config.format;
        };
        this.getFormat = function () {
            return config.format;
        };
        this.setEndPoint = function (url) {
            endPoint = url;
            return endPoint;
        };
        this.getEndPoint = function () {
            return endPoint;
        };

        this.$get = function($q, $http){

            function LastFMService() {
                this.version = '1.0.0';
                if(!config.api_key){
                    throw ('LastFm API key NOT set : Use setAPIKey on the provider in config...');
                }
            }

            function http(params){
                return $http.get(endPoint, {params: params});
            }

            function getParams(settings, options){
                return  angular.extend(
                            {},             // So we don't pollute the objects
                            config,         // api_key and format
                            settings,       // method etc.
                            options || {}   // user options
                        );
            }


            // Album

            // Docs: http://www.last.fm/api/show/album.getInfo
            function _getAlbumInfo(artist, album, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            album: album,
                            mbid: mbid || '',
                            method: 'album.getinfo'
                            // autocorrect: 1,
                            // lang: 'de'
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getAlbumInfo(artist, album, mbid, options){
                 return _getAlbumInfo.apply(_p, arguments)
                            .then(function(response){
                                if(response.data.error || !response.data.album){
                                    return reject(response, 'Couldn\'t find this album');
                                }
                                return response.data.album;
                            });
            }
            // Shortcut : Handy as lastFM returns mbids - preferable to artist name string.
            function getAlbumInfoById(mbid, options){
                return getAlbumInfo('', '', mbid, options);
            }

            // Docs: http://www.last.fm/api/show/album.search
            function _searchAlbum(album, options){
                var params,
                    settings = {
                            album: album,
                            method: 'album.search'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            // Return the actual albums found, rather than end user digging the data for them...
            function searchAlbum(album, options){
                return _searchAlbum.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.results.albummatches){
                            return reject(response, 'Couldn\'t find this album');
                        }
                        return response.data.results.albummatches.album;
                    });
            }

            // Docs: http://www.last.fm/api/show/album.getTopTags
            /*
                Note: Docs say artist & album optional if mbid is used...
                That appers wrong - supplying mbid returns error artist/album missing.
                So mbid fairly useless - currently need album and artist to get tags
            */
            function _getAlbumTopTags(artist, album, mbid, options){
                var params,
                    settings = {
                            method: 'album.gettoptags',
                            mbid :mbid || '',
                            album :album,
                            artist :artist
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getAlbumTopTags(artist, album, mbid, options){
                return _getAlbumTopTags.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptags){
                            return reject(response, 'Error looking up tags');
                        }
                        return response.data.toptags.tag;
                    });
            }


            // Artist

            // Docs: http://www.last.fm/api/show/artist.getTopAlbums
            function _getTopAlbums(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.gettopalbums'
                            // limit: 10,
                            // autocorrect: 1,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTopAlbums(artist, mbid, options){
                return _getTopAlbums.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.topalbums){
                            return reject(response, 'Couldn\'t find albums');
                        }
                        return response.data.topalbums.album;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.getInfo
            function _getArtistInfo(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.getinfo'
                            // autocorrect: 1,
                            // lang: 'de'
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getArtistInfo(artist, mbid, options){
                return _getArtistInfo.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.artist){
                            return reject(response, 'Couldn\'t find artist');
                        }
                        return response.data.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.search
            function _searchArtists(artist, options) {
                var params,
                    settings = {
                            artist: artist,
                            method: 'artist.search'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function searchArtists(artist, options) {
                return _searchArtists.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.results){
                            return reject(response, 'Couldn\'t find artist');
                        }
                        return response.data.results.artistmatches.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/artist.getSimilar
            function _getSimilar(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.getsimilar'
                            // limit: 10,
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getSimilar(artist, mbid, options){
                return _getSimilar.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.similarartists){
                            return reject(response, 'Couldn\'t find similar artists');
                        }
                        return response.data.similarartists.artist;
                    });
            }


            // Docs: http://www.last.fm/api/show/artist.getTopTags
            function _getArtistTopTags(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.gettoptags'
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getArtistTopTags(artist, mbid, options){
                return _getArtistTopTags.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptags){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.toptags.tag;
                    });
            }


            // Docs: http://www.last.fm/api/show/artist.getTopTracks
            function _getTopTracks(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.gettoptracks'
                            // limit: 10,
                            // autocorrect: 1,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTopTracks(artist, mbid, options){
                return _getTopTracks.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptracks){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.toptracks.track;
                    });
            }


            // Charts

            // Docs: http://www.last.fm/api/show/chart.getTopArtists
            function _getTopArtists(options){
                var params,
                    settings = {
                            method: 'chart.gettopartists'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTopArtists(options){
                return _getTopArtists.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.artists){
                            return reject(response, 'Couldn\'t find artist');
                        }
                        return response.data.artists.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/chart.getTopTags
            function _getChartsTopTags(options){
                var params,
                    settings = {
                            method: 'chart.gettoptags'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getChartsTopTags(options){
                return _getChartsTopTags.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.tags){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.tags.tag;
                    });
            }

            // Docs: http://www.last.fm/api/show/chart.getTopTracks
            function _getChartsTopTracks(options){
                var params,
                    settings = {
                            method: 'chart.gettoptracks'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getChartsTopTracks(options){
                return _getChartsTopTracks.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.tracks){
                            return reject(response, 'Couldn\'t find tracks');
                        }
                        return response.data.tracks.track;
                    });
            }


            // Geo

            // Docs: http://www.last.fm/api/show/geo.getTopArtists
            function _getTopGeoArtists(country, options){
                var params,
                    settings = {
                            country: country,
                            method: 'geo.gettopartists'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTopGeoArtists(country, options){
                return _getTopGeoArtists.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.topartists){
                            return reject(response, 'Couldn\'t find artists');
                        }
                        return response.data.topartists.artist;
                    });
            }

            // Docs: http://www.last.fm/api/show/geo.getTopTracks
            function _getTopGeoTracks(country, options){
                var params,
                    settings = {
                            country: country,
                            method: 'geo.gettoptracks'
                            // limit: 10,
                            // page: 1,
                            // location: 'Manchester'
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTopGeoTracks(country, options){
                return _getTopGeoTracks.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.tracks){
                            return reject(response, 'Couldn\'t find tracks');
                        }
                        return response.data.tracks.track;
                    });
            }


            // Track

            // Docs: http://www.last.fm/api/show/track.search
            function _searchTrack(track, options){
                var params,
                    settings = {
                            track: track,
                            method: 'track.search'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function searchTrack(track, options){
                // console.log(LastFMService.prototype);
                return _searchTrack.apply(LastFMService.prototype, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.results){
                            return reject(response, 'Couldn\'t find track');
                        }
                        return response.data.results.trackmatches.track;
                    });
            }

            // Docs: http://www.last.fm/api/show/track.getSimilar
            function _getSimilarTrack(artist, track, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            track: track,
                            mbid: mbid || '',
                            method: 'track.getsimilar'
                            // autocorrect: 1,
                            // limit: 10
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getSimilarTrack(artist, track, mbid, options){
                return _getSimilarTrack.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.similartracks){
                            return reject(response, 'Couldn\'t find similar artists');
                        }
                        return response.data.similartracks.track;
                    });
            }

            // Docs: http://www.last.fm/api/show/track.getTopTags
            function _getTrackTopTags(artist, track, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            track: track,
                            mbid: mbid || '',
                            method: 'track.gettoptags'
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTrackTopTags(artist, track, mbid, options){
                return _getTrackTopTags.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.toptags){
                            return reject(response, 'Couldn\'t find tags');
                        }
                        return response.data.toptags.tag;
                    });
            }

            // Docs: http://www.last.fm/api/show/track.getInfo
            function _getTrackInfo(artist, track, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            track: track,
                            mbid: mbid || '',
                            method: 'track.getInfo'
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return http(params);
            }
            function getTrackInfo(artist, track, mbid, options){
                return _getTrackInfo.apply(_p, arguments)
                    .then(function(response){
                        if(response.data.error || !response.data.track){
                            return reject(response, 'Couldn\'t find track');
                        }
                        return response.data.track;
                    });
            }

            function reject(response, reason){
                var error = {
                        statusText: response.data.message || (reason || 'Error')
                    };
                return $q.reject(error);
            }

            LastFMService.prototype = {
                getParams :     getParams,
                Album: {
                    album:      getAlbumInfo,
                    _album:      _getAlbumInfo,
                    albumById:  getAlbumInfoById,
                    search:     searchAlbum,
                    _search:    _searchAlbum,
                    topTags:    getAlbumTopTags,
                    _topTags:    _getAlbumTopTags
                },
                Artist: {
                    albums:     getTopAlbums,
                    _albums:     _getTopAlbums,
                    _artist:     _getArtistInfo,
                    artist:     getArtistInfo,
                    _search:     _searchArtists,
                    search:     searchArtists,
                    _similar:    _getSimilar,
                    similar:    getSimilar,
                    _topTags:    _getArtistTopTags,
                    topTags:    getArtistTopTags,
                    _tracks:     _getTopTracks,
                    tracks:     getTopTracks
                },
                Charts: {
                    _topArtists: _getTopArtists,
                    topArtists: getTopArtists,
                    _topTags:    _getChartsTopTags,
                    topTags:    getChartsTopTags,
                    _topTracks:  _getChartsTopTracks,
                    topTracks:  getChartsTopTracks
                },
                Geo : {
                    _topArtists: _getTopGeoArtists,
                    topArtists: getTopGeoArtists,
                    _topTracks:  _getTopGeoTracks,
                    topTracks:  getTopGeoTracks
                },
                Track: {
                    _search:     _searchTrack,
                    search:     searchTrack,
                    _similar:    _getSimilarTrack,
                    similar:    getSimilarTrack,
                    _topTags:    _getTrackTopTags,
                    topTags:    getTrackTopTags,
                    _track:      _getTrackInfo,
                    track:      getTrackInfo
                }
            }

            var _p = LastFMService.prototype;

            return new LastFMService();
        }

    }

}());

// console.log('LastFMService.prototype : ', LastFMService.prototype);
// console.log('_p : ', _p); // Same as above
// console.log('this : ', this); // the Album object
// console.log('that : ', that); // LastFM