(function(){

  angular.module('mockpack.pages', [])

    .directive('desk', function(){
      return {
        restrict: 'E',
        replace: true,
        scope: {
          desk: '='
        },
        templateUrl: 'html/desk.html',
        controllerAs: 'Desk',
        controller: function($scope, $window, $timeout, utils){

          console.dir($scope);

          $scope.bg_image = utils.get_bg_image;

          $scope.style = {
            h: 0
          };

          function set_size(){
            $scope.style.h = (window.innerWidth/100 * parseInt($scope.desk.height)) + 'px';
          }

          angular.element($window).on('resize', function(){
            set_size();
            $scope.$digest();
          });

          set_size();

          if($scope.$parent.$last){
            $timeout(function(){
              window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
              $scope.$emit('desks:rendered');
            }, 0);
          }

        }
      };
    })

    .service('desks', function(parse){

      var self = this;

      self.get_list = function(callback){
        parse.desk_list(function(res){
          callback && callback(res);
        });
      };

    });

}());
