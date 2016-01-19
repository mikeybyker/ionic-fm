(function(){
    'use strict';
    
    angular
        .module('ionicfm', [
            'ionic',
            'ngResource',
            'sw.ionicfm',
            'sw.common'
        ])

        .config(function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('home',{
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeController',
                controllerAs: 'vc'
            });

            $stateProvider.state('artist',{
                url: '/artist/:artistname',
                templateUrl: 'views/artist.html',
                controller: 'ArtistController',
                controllerAs: 'vc',
                cache: false
            });

            $stateProvider.state('album',{
                url: '/artist/:artistname/album/:mbid',
                templateUrl: 'views/album.html',
                controller: 'AlbumController',
                controllerAs: 'vc'
            });

            $urlRouterProvider.otherwise('/');

        })

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

        .run(function($ionicPlatform) {
            $ionicPlatform.ready(function() {
                if(window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if(window.cordova && window.cordova.InAppBrowser) {
                    window.open = window.cordova.InAppBrowser.open;
                }
                if(window.StatusBar) {
                    StatusBar.styleDefault();
                }
          });
        });
}());