(function(a){

  if(typeof a === 'undefined') return;

  a.module('mockpack.routes', [ 'ngRoute' ])

    .constant('routes', {
      home: {
        urls: [ '/', '/home' ],
        template: 'home.html',
        controller: 'Home',
        resolve: {
//          get_mocks: function(parse){
//            return parse.mock_list('');
//          }
          get_pages: function(parse, $route){

            return parse.get_page($route.current.params.page || '');
          }
        }
      },
      admin: {
        urls: [ '/admin' ],
        template: 'admin.html',
        controller: 'Admin',
        resolve: {}
      },
      admin_pages: {
        urls: [ '/admin/pages' ],
        template: 'admin.pages.html',
        controller: 'Pages',
        resolve: {
          get_pages_list: function(parse){
            return parse.get_pages_list();
          }
        }
      },
      admin_desks: {
        urls: [ '/admin/desks' ],
        template: 'admin.desks.html',
        controller: 'Desks',
        resolve: {
          get_pages_list: function(parse){
            return parse.get_pages_list();
          },
          get_desks_list: function(parse){
            return parse.get_desks_list();
          }
        }
      },
      admin_mocks: {
        urls: [ '/admin/mocks' ],
        template: 'admin.mocks.html',
        controller: 'Mocks',
        resolve: {
          get_mocks_list: function(parse){
            return parse.get_mocks_list();
          },
          get_desks_list: function(parse){
            return parse.get_desks_list();
          }
        }
      }
    })

    .config(function($routeProvider, routes){

      var templates_url = 'html/';

      for(var m in routes) {

        var page = routes[m];

        for(var u in page.urls) {

          var url = page.urls[u];

          page.resolve.set_nav = function(navigator){
            navigator.current_route = angular.copy(page);
            return true;
          };

          $routeProvider.when(url, {
            resolve: page.resolve,
            templateUrl: templates_url + page.template,
            controller: page.controller
          });

        }

      }

      $routeProvider.otherwise({
        redirectTo: '/'
      });

    })

    .service('navigator', function(){

      var self = this;

    })

    .filter('route', function (routes, $parse) {
      return function (key, params) {
        var getter = $parse(key);
        var url = (getter(routes) || routes.home.urls[0]);
        if(params){
          url += '?';
          for(var i in params){
            url += i + '=' + params[i] + '&';
          }
          url = url.slice(0,-1)
        }
        return '#' + url;
      };
    });

}(angular));
