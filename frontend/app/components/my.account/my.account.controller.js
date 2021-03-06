angular.module('alBargasyApp')
    .controller('myAccountController', function ($rootScope, $scope, $location, myAccountService,SweetAlert) {
        $rootScope.currentTab = "";
        $scope.user = $rootScope.getcurrentUser();
        $scope.reloadScripts = function(){
            var script = document.createElement('script');

            script.src = "assets/js/script.js";

            document.head.appendChild(script);
        }
        $scope.saveUser = function(){
            if($scope.user.email && $scope.user.phone && $scope.user.name){
                myAccountService.saveUser($scope.user,function(res,err){
                    $scope.reloadScripts();
                    if(err)
                        SweetAlert.swal("Error", "an error occuers", "error");
                    else{
                        SweetAlert.swal("Good job!", "The information is updated successfully", "success");
                        $rootScope.updateCurrentUser(JSON.stringify($scope.user));
                    }

                });
            }else{
                SweetAlert.swal("Error", "an error occuers", "error");
            }
        }
        
});