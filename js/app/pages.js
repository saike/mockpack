(function(){

  angular.module('mockpack.pages', [])

    .directive('page', function(){
      return {
        restrict: 'E',
        replace: true,
        scope: {
          page: '='
        },
        templateUrl: 'html/page.html',
        controllerAs: 'Page',
        controller: function($scope, $window, $timeout){

          console.dir($scope);

          $scope.style = {
            width: 0,
            height: 0
          };

          function set_size(){
            $scope.style.width = window.innerWidth + 'px';
            $scope.style.height = window.innerHeight + 'px';
          }

          angular.element($window).on('resize', function(){
            set_size();
            $scope.$digest();
          });

          set_size();

          if($scope.$parent.$last){
            $timeout(function(){
              window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
              $scope.$emit('pages:rendered');
            }, 0);
          }

        }
      };
    })

    .service('pages', function(parse){

      var self = this;

      self.get_list = function(callback){
        parse.page_list(function(res){
          callback && callback(res);
        });
      };

    });

}());
