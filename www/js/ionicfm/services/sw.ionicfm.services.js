(function(){
    'use strict';

    angular.module('sw.ionicfm')
        .factory('LastFM', function ($q, $http, $log, CONSTANTS, LastFMService) {

            function searchArtists(artist, options){
                var params = angular.extend(
                                CONSTANTS.lastfm,
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
                                CONSTANTS.lastfm,
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
                                CONSTANTS.lastfm,
                                {
                                    artist: artist,
                                    method: 'artist.getTopAlbums',
                                    limit: 8
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }

            // From similar artist - so the name is set by last.fm - so no need to search
            function getArtistByName(artist, options){
                var params = angular.extend(
                                CONSTANTS.lastfm,
                                {
                                    artist: artist,
                                    method: 'artist.getInfo',
                                    limit: 1
                                },
                                options || {});
                return LastFMService.get(params).$promise;
            }

            function getAlbumInfo(mbid, options){
                var params = angular.extend(
                                CONSTANTS.lastfm,
                                {
                                    mbid: mbid,
                                    method: 'album.getInfo'
                                },
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
                getArtistInfo : getArtistInfo,
                searchArtists : searchArtists,
                getTopAlbums: getTopAlbums,
                getSimilarArtist: getArtistByName,
                getAlbumInfo: getAlbumInfo,
                getAllArtist: function(artist, options, optionsAlbums){
                    return $q.all([getArtistInfo(artist, options), getTopAlbums(artist, optionsAlbums)]);
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