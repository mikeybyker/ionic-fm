(function(){
    'use strict';

    angular
        .module('sw.ionicfm')
        .directive('breadcrumbs', function () {
            return {
                template: '   <ul class="breadcrumbs clearfix">' +
                        '       <li ng-repeat="link in links" ng-class="{\'disabled\':$last}">' +
                        '           <span ng-switch on="$last && !$first">' +
                        '               <span ng-switch-when="true">' +
                        '                   {{link.title}}' +
                        '               </span>' +
                        '               <span ng-switch-default>' +
                        '                   <a ng-href="#{{link.url}}">{{link.title}}</a>' +
                        '               </span>' +
                        '           </span>' +
                        '       </li>' +
                        '   </ul>',
                restrict: 'E',
                scope: {
                    links: '='
                },
                link: function postLink(scope, element, attrs) {
                    scope.$watch('links', function() {
                        scope.links.unshift({title:'HOME', url:'/menu'})
                    });
                }
            };
        });
}());