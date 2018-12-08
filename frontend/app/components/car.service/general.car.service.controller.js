angular.module('alBargasyApp')
    .controller('generalCarsServiceController', function ($rootScope, $scope, $location, brandModelsService, carServiceService, $routeParams, SweetAlert, Upload, $timeout) {
        $scope.ServiceAvailable = false;
        $scope.brands = [];
        $rootScope.currentTab = "cars";
        $scope.services = [];
        $scope.miniServices = [];
        $scope.sliderServices = [];
        $scope.generalService = {};
        $scope.addEditService = {};
        $scope.up = {}
        $scope.carbrandId = {}
        $scope.carbrandId.id=1;
        $scope.requestService = {};
        $scope.requestService.brand = "";
        $scope.lang = $rootScope.getPreffrerdLanguage();
        $scope.showSlider = false;
        $scope.addEditService.type = 1;
        if ($rootScope.getcurrentUser() != "") {
            var user = $rootScope.getcurrentUser();
            $scope.requestService.name = user.name;
            $scope.requestService.email = user.email;
            $scope.requestService.phone = user.phone;
            $scope.requestService.model = "";
            $scope.requestService.chassis = "";

        }
        brandModelsService.getAllBrands(function (res, err) {
            if (res.data.length > 0) {
                $scope.brands = res.data;
                $scope.init($scope.carbrandId.id);
            } else {
                SweetAlert.swal("Error", "an error occuers", "error");
            }
        })

        
        


        $scope.init = function (carBrandId) {
            $scope.services = [];
            $scope.miniServices = [];
            $scope.sliderServices = [];
            $scope.generalService = {};
            $scope.addEditService = {};
            $scope.up = {}
            $scope.carbrandId = {}
            $scope.carbrandId.id=carBrandId;
            $scope.requestService = {};
            $scope.showSlider = false;
            $scope.addEditService.type = 1;
            $scope.requestService.brand = "";
            if ($rootScope.getcurrentUser() != "") {
                var user = $rootScope.getcurrentUser();
                $scope.requestService.name = user.name;
                $scope.requestService.email = user.email;
                $scope.requestService.phone = user.phone;
                $scope.requestService.model = "";
                $scope.requestService.chassis = "";
            }

            
            carServiceService.getCarServices($scope.carbrandId.id, function (res, err) {
                if (!err) {
                    console.log(res.data)
                    if(res.data.length>0)
                        $scope.ServiceAvailable = true;
                    else
                        $scope.ServiceAvailable = false;
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].serviceIsGeneral) {
                            $scope.generalService = res.data[i];
                        } else if (!res.data[i].miniService && !res.data[i].sliderService) {
                            $scope.services.push(res.data[i]);
                        } else if (res.data[i].miniService) {
                            $scope.miniServices.push(res.data[i]);
                        } else if (res.data[i].sliderService) {
                            $scope.sliderServices.push(res.data[i]);
                        }
                    }
                   
                }
            })

        }
        $scope.clearData = function () {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, clear the form!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.forceClearAllData();
                    }
                });
        }

        $scope.confirmPopup = function (serviceId) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.deleteIt(serviceId)
                    } else {
                        SweetAlert.swal("Cancelled", "Your imaginary data is safe :)", "error");
                    }
                });
        }
        $scope.deleteIt = function (serviceId) {
            carServiceService.deleteServiceById(serviceId, function (res, err) {
                if (!err) {
                    SweetAlert.swal("Deleted!", "Your data has been deleted.", "success");
                    $scope.init($scope.carbrandId.id);
                }
            })
        }
        $scope.forceClearAllData = function () {
            $scope.addEditService = {};
            $scope.up = {};
        }
        $scope.openFileUploader = function () {
            document.getElementById('ImageUploader1').click();

        }
        $scope.onFilesSelected = function (files) {
            $scope.filesSelected = files;
            $scope.$apply();
        }
        function carService() {
            $scope.addEditService.carBrandId = $scope.carbrandId.id;
            carServiceService.createService($scope.addEditService, function (res, err) {
                if (!err) {
                    SweetAlert.swal("Good job!", "The service is added successfully", "success");
                    if ($scope.addEditService.serviceIsGeneral) {
                        $scope.generalService.serviceIsGeneral = false;
                        carServiceService.updateService($scope.generalService, function (res, err) {
                            if (err) {
                                SweetAlert.swal("Error", "an error occuers", "error");
                            }
                            $scope.forceClearAllData();
                            $scope.init($scope.carbrandId.id);
                        })
                    } else {
                        $scope.forceClearAllData();
                        $scope.init($scope.carbrandId.id);
                    }
                } else {
                    SweetAlert.swal("Error", "an error occuers", "error");
                }
            })
        }
        function editExistService() {

            carServiceService.updateService($scope.addEditService, function (res, err) {
                if (!err) {
                    SweetAlert.swal("Good job!", "The car updated successfully", "success");
                    if ($scope.generalService.id != $scope.addEditService.id && $scope.addEditService.serviceIsGeneral) {
                        $scope.generalService.serviceIsGeneral = false;
                        carServiceService.updateService($scope.generalService, function (res, err) {
                            if (err) {
                                SweetAlert.swal("Error", "an error occuers", "error");
                            }
                            $scope.forceClearAllData();
                            $scope.init($scope.carbrandId.id);
                        })
                    } else {
                        $scope.forceClearAllData();
                        $scope.init($scope.carbrandId.id);
                    }
                } else {
                    SweetAlert.swal("Error", "an error occuers", "error");
                }
            })
        }
        $scope.addNewService = function () {
            var s = $scope.addEditService;
            if ($scope.addEditService.type == 1) {
                $scope.addEditService.miniService = false;
                $scope.addEditService.sliderService = false;
                if (!s.serviceTitle || !s.arServiceTitle || !s.serviceDescription || !s.arServiceDescription) {
                    SweetAlert.swal("Error", "Complete all fields", "error");
                    return;
                }
                if (!$scope.addEditService.id && !$scope.up.file) {
                    SweetAlert.swal("Error", "Upload Image", "error");
                    return;
                }

            } else if ($scope.addEditService.type == 2) {
                $scope.addEditService.miniService = false;
                $scope.addEditService.sliderService = true;
                if (!s.serviceTitle || !s.arServiceTitle || !s.serviceDescription || !s.arServiceDescription) {
                    SweetAlert.swal("Error", "Complete all fields", "error");
                    return;
                }
                if (!$scope.addEditService.id && !$scope.up.file) {
                    SweetAlert.swal("Error", "Upload Image", "error");
                    return;
                }
            } else if ($scope.addEditService.type == 3) {
                $scope.addEditService.miniService = true;
                $scope.addEditService.sliderService = false;
                if (!s.serviceTitle || !s.arServiceTitle) {
                    SweetAlert.swal("Error", "Complete all fields", "error");
                    return;
                }
            }

            if (!$scope.addEditService.id) {
                if ($scope.up.file) {
                    Upload.upload({
                        url: $rootScope.backendURL + 'upload', //webAPI exposed to upload the file
                        data: { file: $scope.up.file } //pass file as data, should be user ng-model
                    }).then(function (resp) { //upload function returns a promise
                        if (resp.data.error_code === 0) { //validate success     
                            $scope.addEditService.mainImage = resp.data.insertedFile.id;
                            console.log("aaaaa",$scope.addEditService.mainImage)
                            carService();
                        } else {
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    }, function (resp) { //catch error
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    });
                } else {
                    carService();
                }
            } else {
                if (!$scope.up.file) {
                    console.log('edit only');
                    editExistService();
                } else {
                    console.log('edit with file');
                    Upload.upload({
                        url: $rootScope.backendURL + 'upload', //webAPI exposed to upload the file
                        data: { file: $scope.up.file } //pass file as data, should be user ng-model
                    }).then(function (resp) { //upload function returns a promise
                        if (resp.data.error_code === 0) { //validate success                    
                            $scope.addEditService.serviceImage = resp.data.insertedFile.id;
                            editExistService();
                        } else {
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    }, function (resp) { //catch error
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    });
                }
            }
        }
        $scope.editService = function (service) {
            $scope.addEditService = angular.copy(service);

            if (!$scope.addEditService.miniService && !$scope.addEditService.sliderService)
                $scope.addEditService.type = 1;
            else if ($scope.addEditService.miniService)
                $scope.addEditService.type = 3;
            else if ($scope.addEditService.sliderService)
                $scope.addEditService.type = 2;
            $scope.up = {};
        }
        $scope.requestNewService = function () {
            var error = false;
            var p = $scope.requestService;
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    if (p[key] == "" || p[key] == undefined) {
                        error = true;
                        break;
                    }
                }
            }
            if (error) {
                SweetAlert.swal("Error", "an error occuers", "error");
            } else {
                carServiceService.requestNewService($scope.requestService, function (res, err) {
                    if (!err) {
                        SweetAlert.swal("Good job!", "The car updated successfully", "success");
                        $scope.forceClearAllData();
                        $scope.init($scope.carbrandId.id);
                    } else {
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }
                })
            }

        }

    });