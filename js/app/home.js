(function(a){

  if(typeof a === 'undefined') return;

  a.module('mockpack.home', [])

    .controller('Home', function($scope, parse, $location, routes){

      if(!parse.data.page) {
        $location.search({}).path(routes.home.urls[0]);
        return;
      }

      $scope.page = parse.data.page || {};

      $scope.mocks = parse.data.mocks || [];

      $scope.desks = parse.data.desks || [];

      console.dir(parse.data.page);

      for(var i in $scope.desks){
        $scope.desks[i].mocks = angular.copy($scope.mocks).filter(function(mock){
          return mock.desk_id == $scope.desks[i].id;
        });
      }

      $scope.$on('desks:rendered', function(){
        $scope.show_wrapper = true;
      });

    });

}(angular));