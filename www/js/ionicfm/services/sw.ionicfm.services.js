(function(){
    'use strict';
    
    angular.module('sw.ionicfm')
        .factory('LastFM', function ($q, $http, $log, CONSTANTS, LastFMService) {

            function searchArtists(artist, options){
                var params = angular.extend(
                                options || {},
                                CONSTANTS.lastfm,
                                {
                                    artist: artist,
                                    method: 'artist.search',
                                    limit: 5,
                                    autocorrect: 0
                                });
                return LastFMService.get(params).$promise;
            }

            function getArtistInfo(artist, options){
                var params = angular.extend(
                                options || {},
                                CONSTANTS.lastfm,
                                {
                                    artist: artist,
                                    method: 'artist.getInfo',
                                    autocorrect: 1
                                });      
                // $log.info('getArtistInfo params : ', params);
                return LastFMService.get(params).$promise;
            }

            function getTopAlbums(artist, options){
                var params = angular.extend(
                                options || {},
                                CONSTANTS.lastfm,
                                {
                                    artist: artist,
                                    method: 'artist.getTopAlbums'
                                });
                // $log.info('getTopAlbums ::: params : ', params);
                return LastFMService.get(params).$promise;
            }

            // From similar artist - so the name is set by last.fm - so no need to search
            function getArtistByName(artist, options){
                var params = angular.extend(
                                options || {},
                                CONSTANTS.lastfm,
                                {
                                    artist: artist,
                                    method: 'artist.getInfo',
                                    limit: 1
                                });
                return LastFMService.get(params).$promise;
            }

            function getAlbumInfo(mbid, options){
                var params = angular.extend(
                                options || {},
                                CONSTANTS.lastfm,
                                {  
                                    mbid: mbid,
                                    method: 'album.getInfo'
                                });
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
                getArtistInfo : function(mbid, options){
                    return getArtistInfo(mbid, options);
                },
                searchArtists : function(artist, options){
                    return searchArtists(artist, options);
                },
                getTopAlbums: function(mbid, options){
                    // $log.info('getTopAlbums ::: ', mbid);
                    return getTopAlbums(mbid);
                },
                getAllArtist: function(artist, options, optionsAlbums){
                    return $q.all([getArtistInfo(artist, options), getTopAlbums(artist, optionsAlbums)]);
                },
                getSimilarArtist: function(artist, options){
                    // $log.info('getArtist ::: ', artist);
                    return getArtistByName(artist, options);
                },
                getAlbumInfo: function(mbid, options){
                    // $log.info('getAlbumInfo ::: ', mbid);
                    return getAlbumInfo(mbid, options);
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