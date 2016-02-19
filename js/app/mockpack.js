(function(){

    angular.module('mockpack', [
      'mockpack.routes',
      'mockpack.admin',
      'mockpack.parse',
      'mockpack.home',
      'mockpack.mocks',
      'mockpack.pages'
    ])

    .config(function($interpolateProvider){
      $interpolateProvider.startSymbol('[[').endSymbol(']]');
    })

    .run(function(parse){
      parse.init();
    })

    .filter('resource', function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      };
    })

    .directive('youtube', function(resourceFilter){
      return {
        restrict: 'A',
        scope: {
          url: '='
        },
        link: function(scope, elm){

          scope.$watch('url', function(){
            scope.url && elm[0].setAttribute('src', resourceFilter(scope.url.replace("watch?v=", "v/") + '&iv_load_policy=3&controls=0&rel=0&showinfo=0&modestbranding=1&enablejsapi=1'));
          });

        }
      };
    })

    .directive('loadingFader', function($rootScope){
      return {
        restrict: 'A',
        scope: true,
        link: function(scope, elm){

          scope.is_loading = function(){
            return scope.loading;
          };

          $rootScope.$on('$routeChangeStart', function(){
            scope.loading = true;
          });

          $rootScope.$on('$routeChangeSuccess', function(){
            scope.loading = false;
          });

        }
      };
    })

    .filter('to_html', ['$sce', function ($sce) {
      return function (text) {
        return $sce.trustAsHtml(text);
      };
    }])

    .service('utils', function(){

      var self = this;

      self.find = function(arr, params){

        var found = [];

        for(var i = 0; i < arr.length; i+=1) {
          var obj = arr[i];
          var find_obj = true;
          for(var p in params){
            if (params[p] !== obj[p]) {
              find_obj = false;
            }
          }
          find_obj && found.push(obj);
        }

        return found;

      };

      self.get_bg_image = function(url){
        if(!url) return 'none';
        return 'url(' + url + ')';
      };

    });



}());
