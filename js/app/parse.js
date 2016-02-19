(function(a){

  if(typeof a === 'undefined') return;

  a.module('mockpack.parse', [])

    .service('parse', function($rootScope, $q, $interval){

      var self = this;

      self.data = {};

      self.parse_mock = function(mock_obj){
        return {
          content: JSON.parse(mock_obj.get('content') || '{}'),
          top: mock_obj.get('top'),
          left: mock_obj.get('left'),
          width: mock_obj.get('width'),
          height: mock_obj.get('height'),
          bg_color: mock_obj.get('bg_color'),
          desk_id: mock_obj.get('desk_id'),
          type: mock_obj.get('type'),
          link: mock_obj.get('link'),
          id: mock_obj.id,
          create_date: mock_obj.get('createdAt')
        };
      };

      self.parse_desk = function(page_obj){
        return {
          order: page_obj.get('order'),
          name: page_obj.get('name'),
          bg_color: page_obj.get('bg_color'),
          bg_image: page_obj.get('bg_image'),
          height: page_obj.get('height'),
          page_id: page_obj.get('page_id'),
          id: page_obj.id,
          create_date: page_obj.get('createdAt')
        };
      };

      self.parse_page = function(page_obj){
        return {
          name: page_obj.get('name'),
          is_main: page_obj.get('is_main'),
          id: page_obj.id,
          create_date: page_obj.get('createdAt')
        };
      };

      self.get_page = function(page_name){
        var defer = $q.defer();

        delete self.data.page;

        //1 get page
        var Page = Parse.Object.extend("Page");
        var query = new Parse.Query(Page);
        if(page_name) query.equalTo("name", page_name);
        else query.equalTo("is_main", true);
        query.first({
          success: function(page) {
            console.log(page);
            if(!page) {
              defer.resolve('Not found');
              return;
            }
            $rootScope.$apply(function(){
              self.data.page = self.parse_page(page);
              self.desk_list(self.data.page.id, function(desks){
                self.all_mocks(desks, function(mocks){
                  defer.resolve(mocks);
                });

              })
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.init = function(){

        Parse.initialize("ggd4P5L2J7Q8TnMAMsUDilOus4GsQCSkxGhejH5P", "vqdsjhgd4S7QaBYYfm4ODO9rvZInemWpG6NHhpGb");

      };

      self.get_user = function(){
        return Parse.User.current() || false;
      };

      self.login = function(user, callback){

        Parse.User.logIn(user.login, user.password, {
          success: function(user) {
            $rootScope.$apply(function(){
              callback && callback(user);
            });
          },
          error: function(user, error) {
//            $rootScope.$apply(function(){
//              callback && callback(error);
//            });
          }
        });

      };

      self.logout = function(){
        Parse && Parse.User.logOut();
      };

      self.save_mock = function(req_mock, callback){

        var Toad = Parse.Object.extend("Mock");
        var toad = new Toad();
        toad.set('type', req_mock.type);
        toad.set('content', req_mock.content);
        toad.set('style', req_mock.style);
        if(req_mock.id){
          toad.id = req_mock.id;
        }
        toad.save(null, {
          success: function(new_mock){
            $rootScope.$apply(function(){
              callback && callback(new_mock);
            });
          },
          error: function() {
            console.dir('Toad save error');
          }
        });

      };

      self.mock_list = function(desk_id, callback){

        delete self.data.mocks;

        var Mock = Parse.Object.extend("Mock");
        var query = new Parse.Query(Mock);
        query.equalTo("desk_id", desk_id);
        var deferred = $q.defer();
        query.find({
          success: function(results) {
            var items = [];
            $rootScope.$apply(function(){
              Parse._objectEach(results, function(v, k) {
                items[k] = self.parse_mock(v);
              });
              self.data.mocks = items;
              deferred.resolve(items);
              callback && callback(items);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            deferred.reject(error);
          }
        });

        return deferred.promise;

      };

      self.all_mocks = function(desks, callback){

        delete self.data.mocks;

        var Mock = Parse.Object.extend("Mock");
        var query = new Parse.Query(Mock);
        var regexp = '';
        angular.forEach(desks, function(desk){
          regexp += desk.id + '|';
        });
        var reg_exp_obj = new RegExp(regexp);
        query.matches("desk_id", reg_exp_obj);
        var deferred = $q.defer();
        query.find({
          success: function(results) {
            var items = [];
            $rootScope.$apply(function(){
              Parse._objectEach(results, function(v, k) {
                items[k] = self.parse_mock(v);
              });
              self.data.mocks = items;
              deferred.resolve(items);
              callback && callback(items);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            deferred.reject(error);
          }
        });

        return deferred.promise;

      };

      self.desk_list = function(page_id, callback){
        var Desk = Parse.Object.extend("Desk");
        var query = new Parse.Query(Desk);
        var deferred = $q.defer();
        query.equalTo("page_id", page_id);
        query.find({
          success: function(results) {
            var items = [];
            $rootScope.$apply(function(){
              Parse._objectEach(results, function(v, k) {
                items[k] = self.parse_desk(v);
              });
              self.data.desks = items;
              deferred.resolve(items);
              callback && callback(items);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            deferred.reject(error);
          }
        });

        return deferred.promise;

      };

      self.get_pages_list = function(){

        var defer = $q.defer();

        //1 get page
        var Page = Parse.Object.extend("Page");
        var query = new Parse.Query(Page);
        query.find({
          success: function(pages) {
            var items = [];
            Parse._objectEach(pages, function(v, k) {
              items[k] = self.parse_page(v);
            });
            $rootScope.$apply(function(){
              self.data.pages = items;
              console.dir(items);
              defer.resolve(items);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.save_page = function(page, callback){


        var defer = $q.defer();

        var Page = Parse.Object.extend("Page");
        var req_page = new Page(JSON.parse(angular.toJson(page)));

        req_page.save(null, {
          success: function(page) {
            var saved_page = self.parse_page(page);
            $rootScope.$apply(function(){
              console.dir(saved_page);
              defer.resolve(saved_page);
              callback && callback(saved_page);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.delete_page = function(page, callback){


        var defer = $q.defer();

        var Page = Parse.Object.extend("Page");
        var req_page = new Page(JSON.parse(angular.toJson(page)));

        req_page.destroy({
          success: function(page) {
            var saved_page = self.parse_page(page);
            $rootScope.$apply(function(){
              console.dir(saved_page);
              defer.resolve(saved_page);
              callback && callback(saved_page);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.get_desks_list = function(){

        var defer = $q.defer();

        //1 get page
        var Desk = Parse.Object.extend("Desk");
        var query = new Parse.Query(Desk);
        query.find({
          success: function(desks) {
            var items = [];
            Parse._objectEach(desks, function(v, k) {
              items[k] = self.parse_desk(v);
            });
            $rootScope.$apply(function(){
              self.data.desks = items;
              console.dir(items);
              defer.resolve(items);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.save_desk = function(desk, callback){


        var defer = $q.defer();

        var Desk = Parse.Object.extend("Desk");
        var req_desk = new Desk(JSON.parse(angular.toJson(desk)));

        req_desk.save(null, {
          success: function(desk) {
            var saved_desk = self.parse_desk(desk);
            $rootScope.$apply(function(){
              console.dir(saved_desk);
              defer.resolve(saved_desk);
              callback && callback(saved_desk);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.delete_desk = function(desk, callback){


        var defer = $q.defer();

        var Desk = Parse.Object.extend("Desk");
        var req_desk = new Desk(JSON.parse(angular.toJson(desk)));

        req_desk.destroy({
          success: function(desk) {
            var saved_desk = self.parse_desk(desk);
            $rootScope.$apply(function(){
              console.dir(saved_desk);
              defer.resolve(saved_desk);
              callback && callback(saved_desk);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.get_mocks_list = function(){

        delete self.data.mocks_all;

        var defer = $q.defer();

        //1 get page
        var Mock = Parse.Object.extend("Mock");
        var query = new Parse.Query(Mock);
        query.find({
          success: function(mocks) {
            var items = [];
            Parse._objectEach(mocks, function(v, k) {
              items[k] = self.parse_mock(v);
            });
            $rootScope.$apply(function(){
              self.data.mocks_all = items;
              defer.resolve(items);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.save_mock = function(mock, callback){

        var defer = $q.defer();

        var Mock = Parse.Object.extend("Mock");
        var req_mock = angular.copy(mock);
        req_mock.content = JSON.stringify(req_mock.content);
        var send_mock = new Mock(JSON.parse(angular.toJson(req_mock)));

        send_mock.save(null, {
          success: function(mock) {
            var saved_mock = self.parse_mock(mock);
            $rootScope.$apply(function(){
              console.dir(saved_mock);
              defer.resolve(saved_mock);
              callback && callback(saved_mock);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

      self.delete_mock = function(mock, callback){

        var defer = $q.defer();

        var Mock = Parse.Object.extend("Mock");
        var req_mock = angular.copy(mock);
        req_mock.content = JSON.stringify(req_mock.content);
        var send_mock = new Mock(JSON.parse(angular.toJson(req_mock)));

        send_mock.destroy({
          success: function(mock) {
            var saved_mock = self.parse_mock(mock);
            $rootScope.$apply(function(){
              console.dir(saved_mock);
              defer.resolve(saved_mock);
              callback && callback(saved_mock);
            });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
            defer.reject(error);
          }
        });

        return defer.promise;

      };

    });

}(angular));