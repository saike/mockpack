(function () {

  angular.module('mockpack.mocks', [])

      .directive('mock', function ($window, parse, $timeout) {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: 'html/mock.html',
          scope: {
            mock: '=',
            index: '=?'
          },
          link: function (scope, elm) {

            scope.visible = false;

            scope.get_user = function () {
              return parse.get_user();
            };

            function move(e) {
              scope.$apply(function () {
                var top = (e.clientY - 20) + 'px';
                var left = (e.clientX - 20) + 'px';
                elm[0].style.top = top;
                elm[0].style.left = left;
                scope.mock.style.top = top;
                scope.mock.style.left = left;
              });
            }

            $window.addEventListener('mouseup', function () {
              $window.removeEventListener('mousemove', move, true);
            }, false);

            scope.grab = function () {
              $window.addEventListener('mousemove', move, true);
            };

            scope.save_mock = function () {
              parse.save_mock(scope.mock, function (res) {
                console.dir(res);
              });
            };

            scope.go_link = function () {
              if (scope.mock.link) $window.location.href = scope.mock.link;
            };

            scope.style = function(){
              return {
                height: (window.innerWidth/100 * parseInt(scope.mock.height)) + 'px',
                top: (window.innerWidth/100 * parseInt(scope.mock.top)) + 'px'
              };
            };

            $timeout(function(){
              scope.visible = true;
            }, parseInt((scope.index*50)));

          }
        };
      })

    .directive('mockContentEditor', function(){
      return {
        restrict: 'E',
        replace: true,
        scope: {
          mock: '=',
          onChange: '=?'
        },
        templateUrl: 'html/admin.mocks.ceditor.html',
        link: function(scope){

          scope.save_content = function(){
            scope.onChange && scope.onChange(scope.mock);
          };

        }
      };
    });

}());
