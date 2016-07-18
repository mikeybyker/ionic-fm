(function(){
    'use strict';

    angular
        .module('ionicfm', [
            'ionic',
            'sw.lastfm'
        ])

        .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

            $stateProvider

                .state('home',{
                    url: '/',
                    templateUrl: 'views/home.html',
                    controller: 'HomeController',
                    controllerAs: '$ctrl'
                })

                .state('artist',{
                    url: '/artist/:artistname',
                    templateUrl: 'views/artist.html',
                    controller: 'ArtistController',
                    controllerAs: '$ctrl'
                })

                .state('album',{
                    url: '/artist/:artistname/album/:mbid',
                    templateUrl: 'views/album.html',
                    controller: 'AlbumController',
                    controllerAs: '$ctrl'
                })

                .state('explorer',{
                    url: '/explorer',
                    templateUrl: 'views/explorer.html',
                    controller: 'ExplorerController',
                    controllerAs: '$ctrl'
                });

            $urlRouterProvider.otherwise('/');

            // Just want the icon, not the text, for the back button
            $ionicConfigProvider.backButton.text('');
            $ionicConfigProvider.backButton.previousTitleText('');

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