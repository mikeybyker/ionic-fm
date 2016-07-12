(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .factory('LastFM', function ($q, CONSTANTS, LastFMService) {

            var lastFmConfig = CONSTANTS.lastfm;

            // Artist
            function searchArtists(artist, options){
                var params = angular.extend(
                                lastFmConfig,
                                {
                                    artist: artist,
                                    method: 'artist.search',
                                    limit: 8,
                                    autocorrect: 0
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }

            function getArtistInfo(artist, options){
                var params = angular.extend(
                                lastFmConfig,
                                {
                                    artist: artist,
                                    method: 'artist.getInfo',
                                    autocorrect: 1
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }

            function getTopAlbums(artist, options){
                var params = angular.extend(
                                lastFmConfig,
                                {
                                    artist: artist,
                                    method: 'artist.getTopAlbums',
                                    limit: 8
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }

            // From similar artist - the name is set by last.fm - so no need to search
            function getArtistByName(artist, options){
                var params = angular.extend(
                                lastFmConfig,
                                {
                                    artist: artist,
                                    method: 'artist.getInfo',
                                    limit: 1
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }

            function getAllArtist(artist, options, optionsAlbums){
                // return reject({data:'ooh', status:404, statusText:'WANNA'});
                return $q.all([getArtistInfo(artist, options), getTopAlbums(artist, optionsAlbums)]);
            }

            // Album
            function getAlbumInfo(mbid, options){
                var params = angular.extend(
                                lastFmConfig,
                                {
                                    mbid: mbid,
                                    method: 'album.getInfo'
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }
            function searchAlbum(album, options){
                var params = angular.extend(
                                lastFmConfig,
                                {
                                    album: album,
                                    method: 'album.search',
                                    limit: 8
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }
            // @todo
            // if mbid, ignore artist, album
            // else - need both
            function getTopTags(artist, album, mbid, options){
                var params,
                    o = {
                            method: 'album.gettoptags',
                            limit: 8
                    };
                if(mbid){
                    o.mbid = mbid;
                } else{
                    o.album = album;
                    o.artist = artist;
                }
                params = angular.extend(
                                lastFmConfig,
                                o,
                                options || {});
                return LastFMService.get(params).$promise;
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

            var API = {
                Artist :{
                    search :        searchArtists,
                    byName :        getArtistByName,
                    info :          getArtistInfo,
                    albums:         getTopAlbums,
                    artist:         getAllArtist  // $q.all of preceding 2
                },
                Album :{
                    info:           getAlbumInfo,
                    search:         searchAlbum,
                    topTags:        getTopTags
                }
            };

            return API;
        })

        .factory('LastFMService', function ($resource, CONSTANTS) {

            return $resource( CONSTANTS.server.host,
                {   mbid: '@mbid',
                    api_key:CONSTANTS.lastfm.api_key,
                    format:CONSTANTS.lastfm.format,
                    method: '@method'
                });
        });
}());