// Add your Last.fm API key (http://www.last.fm/api/account/create) below
// - then rename this file to constants.js
(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .constant('CONSTANTS',
            {
            server:{
                host: 'http://ws.audioscrobbler.com/2.0/'
            },
            lastfm:{
                format: 'json',
                api_key: 'YOUR_API_KEY'
            }
        })
}());