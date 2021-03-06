angular.module('alBargasyApp')
    .controller('groupManagementController', function ($filter,$rootScope, $scope) {
        var $translate = $filter('translate');

        $scope.init = function (page) {
             $rootScope.currentTab = "group_management";
             $rootScope.FaceBookLink = "https://www.facebook.com/toyotaalbargasy/";
             $scope.reloadScripts();
        }

        
        $scope.reloadScripts = function(){
            var script = document.createElement('script');

            script.src = "assets/js/dataTable.js";

            document.head.appendChild(script);

                var script2 = document.createElement('script');
    
                script2.src = "assets/js/script.js";
    
                document.head.appendChild(script2);
            
        }
        $scope.init();
})