(function(a){

  if(typeof a === 'undefined') return;

  a.module('mockpack.admin', [])

    .controller('Admin', function($scope, parse){

      $scope.form = {
        login: '',
        password: ''
      };

      $scope.get_user = function(){
        return parse.get_user();
      };

      $scope.login = function(){
        parse.login($scope.form, function(user){
          console.dir(user);
        });
      };

      $scope.logout = function(){
        parse.logout();
      };

    })

    .controller('Pages', function($scope, parse, $location,routes){

      $scope.pages = function(){
        return parse.data.pages || [];
      };

      $scope.get_user = function(){
        return parse.get_user();
      };

      if(!$scope.get_user()){
        $location.path(routes.admin.urls[0]);
      }

      var blank_page = {
        name: ''
      };

      $scope.new_page = angular.copy(blank_page);

      $scope.save_page = function(page){
        parse.save_page(page || $scope.new_page, function(res){
          $scope.new_page = angular.copy(blank_page);
          !page && parse.get_pages_list();
        });
      };

      $scope.delete_page = function(page){
        parse.delete_page(page, function(res){
          parse.get_pages_list();
        });
      };

    })

    .controller('Desks', function($scope, parse, $location, routes, utils){

      $scope.desks = function(){
        return parse.data.desks || [];
      };

      $scope.pages = function(){
        return parse.data.pages || [];
      };

      $scope.get_user = function(){
        return parse.get_user();
      };

      if(!$scope.get_user()){
        $location.path(routes.admin.urls[0]);
      }

      var blank_desk = {
        name: ''
      };

      $scope.new_desk = angular.copy(blank_desk);

      $scope.save_desk = function(desk){
        parse.save_desk(desk || $scope.new_desk, function(res){
          $scope.new_desk = angular.copy(blank_desk);
          !desk && parse.get_desks_list();
        });
      };

      $scope.delete_desk = function(desk){
        parse.delete_desk(desk, function(res){
          parse.get_desks_list();
        });
      };

      $scope.bg_image = utils.get_bg_image;

    })

    .controller('Mocks', function($scope, parse, $location, routes, utils){

      $scope.desks = function(){
        return parse.data.desks || [];
      };

      $scope.mocks = function(){
        return parse.data.mocks_all || [];
      };

      $scope.get_user = function(){
        return parse.get_user();
      };

      if(!$scope.get_user()){
        $location.path(routes.admin.urls[0]);
      }

      $scope.blank_mocks = [
        {
          type: 'image',
          content: {}
        },
        {
          type: 'video',
          content: {}
        },
        {
          type: 'audio',
          content: {}
        },
        {
          type: 'text',
          content: {}
        }
      ];

      $scope.new_mock = angular.copy($scope.blank_mocks[0]);

      $scope.set_mock_type = function(mock){
        mock.content = {};
      };

      $scope.save_mock = function(mock){
        parse.save_mock(mock || $scope.new_mock, function(){
          $scope.new_mock = angular.copy($scope.blank_mocks[0]);
          !mock && parse.get_mocks_list();
        });
      };

      $scope.delete_mock = function(mock){
        parse.delete_mock(mock, function(res){
          parse.get_mocks_list();
        });
      };

      $scope.clone_mock = function(mock){
        $scope.new_mock = angular.copy(mock);
        delete $scope.new_mock.id;
        $scope.save_mock();
      };

    })

    .directive('adminNav', function(navigator){
      return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: 'html/admin.navigator.html',
        link: function(scope){
          console.dir(navigator);
        }
      };
    });

}(angular));
