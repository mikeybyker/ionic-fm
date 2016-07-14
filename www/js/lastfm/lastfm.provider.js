(function(){
    'use strict';
    
    angular
        .module('sw.lastfm', [])
        .provider('LastFM', LastFM);

    function LastFM(){

        var config = {};
        config.api_key = null;
        config.format = 'json';
        var endPoint = 'http://ws.audioscrobbler.com/2.0/';

        this.setAPIKey = function (key) {
            config.api_key = key;
        };
        this.setFormat = function (format) {
            config.format = format;
        };
        this.setEndPoint = function (url) {
            endPoint = url;
        };

        var that = this;

        this.$get = function($q, $http){
                
            function LastFMService() {
                this.version = '1.0.0';
                if(!config.api_key){
                    throw ('LastFm API key NOT set : Use setAPIKey on the provider in config...');
                }
            }

            function get(params){
                return $http.get(endPoint, {params: params});
            }

            function getParams(settings, options){
                return  angular.extend(
                            {},             // So we don't polute the objects
                            config,         // api_key and format
                            settings,       // method etc.
                            options || {}   // user options
                        );
            }

            // Artist

            // Docs: http://www.last.fm/api/show/artist.search
            function searchArtists(artist, options) {
                // console.log('1. this : ', this); // the Artist object
                // console.log('2. that : ', that); // lastfm
                var params,
                    settings = {
                            artist: artist,
                            method: 'artist.search'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/artist.getInfo
            function getArtistInfo(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.getinfo'
                            // autocorrect: 1,
                            // lang: 'de'
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/artist.getTopAlbums
            function getTopAlbums(artist, mbid, options){
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
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/artist.getTopTracks
            function getTopTracks(artist, mbid, options){
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
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/artist.getSimilar
            function getSimilar(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.getsimilar'
                            // limit: 10,
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/artist.getTopTags
            function getArtistTopTags(artist, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            mbid: mbid,
                            method: 'artist.gettoptags'
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }


            // Album

            // Docs: http://www.last.fm/api/show/album.getInfo
            function getAlbumInfo(artist, album, mbid, options){
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
                return get(params);
            }
            // Shortcut : Handy as lastFM returns mbids - preferable to artist name string.
            function getAlbumInfoById(mbid, options){
                return getAlbumInfo('', '', mbid, options);
            }

            // Docs: http://www.last.fm/api/show/album.search
            function searchAlbum(album, options){
                var params,
                    settings = {
                            album: album,
                            method: 'album.search'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/album.getTopTags
            /*
                Note: Docs say artist & album optional if mbid is used...
                That appers wrong - supplying mbid returns error artist/album missing.
                So mbid fairly useless - currently need album and artist to get tags
            */
            function getAlbumTopTags(artist, album, mbid, options){
                var params,
                    settings = {
                            method: 'album.gettoptags',
                            mbid :mbid || '',
                            album :album,
                            artist :artist
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Track
            // Docs: http://www.last.fm/api/show/track.search
            function searchTrack(track, options){
                var params,
                    settings = {
                            track: track,
                            method: 'track.search'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }
            // Docs: http://www.last.fm/api/show/track.getInfo
            function getTrackInfo(artist, track, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            track: track,
                            mbid: mbid || '',
                            method: 'track.getInfo'
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/track.getSimilar
            function getSimilarTrack(artist, track, mbid, options){
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
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/track.getTopTags
            function getTrackTopTags(artist, track, mbid, options){
                var params,
                    settings = {
                            artist: artist,
                            track: track,
                            mbid: mbid || '',
                            method: 'track.gettoptags'
                            // autocorrect: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Charts

            // Docs: http://www.last.fm/api/show/chart.getTopArtists
            function getTopArtists(options){
                var params,
                    settings = {
                            method: 'chart.gettopartists'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/chart.getTopTracks
            function getTopTracks(options){
                var params,
                    settings = {
                            method: 'chart.gettoptracks'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/chart.getTopTags
            function getTopTags(options){
                var params,
                    settings = {
                            method: 'chart.gettoptags'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Geo

            // Docs: http://www.last.fm/api/show/geo.getTopArtists
            function getTopGeoArtists(country, options){
                var params,
                    settings = {
                            country: country,
                            method: 'geo.gettopartists'
                            // limit: 10,
                            // page: 1
                    };
                params = getParams(settings, options);
                return get(params);
            }

            // Docs: http://www.last.fm/api/show/geo.getTopTracks
            function getTopGeoTracks(country, options){
                var params,
                    settings = {
                            country: country,
                            method: 'geo.gettoptracks'
                            // limit: 10,
                            // page: 1,
                            // location: 'Manchester'
                    };
                params = getParams(settings, options);
                return get(params);
            }

            /**
            * Return a rejected promise : Helps testing
            */
            function reject(reason){
                reason = reason || {data:'Not Found', status:404, statusText:'Not Found'};
                var deferred = $q.defer();
                deferred.reject(reason);
                return deferred.promise;
            }

            LastFMService.prototype = {
                Artist: {
                    search:     searchArtists,
                    artist:     getArtistInfo,
                    albums:     getTopAlbums,
                    tracks:     getTopTracks,
                    similar:    getSimilar,
                    topTags:    getArtistTopTags
                },
                Album: {
                    album:      getAlbumInfo,
                    albumById:  getAlbumInfoById,
                    search:     searchAlbum,
                    topTags:    getAlbumTopTags
                },
                Track: {
                    search:     searchTrack,
                    track:      getTrackInfo,
                    similar:    getSimilarTrack,
                    topTags:    getTrackTopTags                    
                },
                Charts: {
                    topArtists: getTopArtists,
                    topTracks:  getTopTracks,
                    topTags:    getTopTags                 
                },
                Geo : {
                    topArtists: getTopGeoArtists,
                    topTracks:  getTopGeoTracks
                }
            }

            return new LastFMService();
        }

    }

}());