angular.module('alBargasyApp')
    .controller('homeController', function ($route,$rootScope, $scope, $location,brandModelsService,homeService,Upload,SweetAlert ) {
        $rootScope.currentTab = "home";
        $scope.slider = [];
        $scope.aboutUs={};
        $scope.up = {};
        $scope.up1 = {};
        $scope.up2 = {};
        $scope.model = {};
          $scope.init = function(){
            $rootScope.FaceBookLink = "";
            homeService.getAllSlider(function(res,err){
                if(!err){
                    $scope.slider = res.data;
                    
                    // $scope.reloadScripts();
                }
                brandModelsService.getAllModelsWithoutBrand({},function(res,err){
                    if(!err){
                        $scope.carModels = res.data;
                        
                    }
                    homeService.getAboutUs(function(res,data){
                        if(!err){
                            $scope.aboutUs = res.data;
                            
                        }
                    })
                    $scope.reloadScripts();
                })
            })
          }
          $scope.openFileUploader = function(id){
            document.getElementById(id).click();

        }
        $scope.addContactUs=function(up1,up2,model){
            if(!model.id){
                Upload.upload({
                    url: $rootScope.backendURL +'upload', 
                    data:{file:up1.file} 
                }).then(function (resp) { 
                    if(resp.data.error_code === 0){
                        $scope.insertedMission =  resp.data.insertedFile.id;
                        Upload.upload({
                            url: $rootScope.backendURL +'upload', 
                            data:{file:up2.file} 
                        }).then(function (resp) {
                            if(resp.data.error_code === 0){
                                $scope.insertedVission =  resp.data.insertedFile.id;
                                modelObject = {
                                    title:model.title,
                                    arTitle:model.arTitle,
                                    paragraph:model.paragraph,
                                    arParagraph:model.arParagraph,
                                    missionParagraph:model.missionParagraph,
                                    arMissionParagraph:model.arMissionParagraph,
                                    visionParagraph:model.visionParagraph,
                                    arVisionParagraph:model.arVisionParagraph,
                                    missionImageId:$scope.insertedMission,
                                    visionImageId:$scope.insertedVission
                                };
                                homeService.creatNewAboutUs(modelObject,function(res,err){
                                    if(!err){
                                        SweetAlert.swal("Good job!", "The About Us Section added successfully", "success");
                                        $route.reload();
                                        
                                    }else{
                                        SweetAlert.swal("Error", "an error occuers", "error");
                                    }
                                })
                             }else{
                                SweetAlert.swal("Error", "an error occuers", "error");
                             }})
                        
                    } else {
                        SweetAlert.swal("Error", "an error occuers", "error");

                    }
                    
                }, function (resp) { 
                    SweetAlert.swal("Error", "an error occuers", "error");
                })
            }else{
                $scope.insertedMission =0;
                $scope.insertedVission=0;
                
                    Upload.upload({
                        url: $rootScope.backendURL +'upload', 
                        data:{file:up1.file} 
                    }).then(function (resp) { 
                        if(resp.data.error_code === 0 && up1.file){
                            $scope.insertedMission =  resp.data.insertedFile.id;
                        }
                        Upload.upload({
                            url: $rootScope.backendURL +'upload', 
                            data:{file:up2.file} 
                        }).then(function (resp2) { 
                            if(resp2.data.error_code === 0 && up2.file){
                                $scope.insertedVission =  resp2.data.insertedFile.id;
                            }
                            console.log('edit only');
                    modelObject = {
                        id:model.id,
                        title:model.title,
                        arTitle:model.arTitle,
                        paragraph:model.paragraph,
                        arParagraph:model.arParagraph,
                        missionParagraph:model.missionParagraph,
                        arMissionParagraph:model.arMissionParagraph,
                        visionParagraph:model.visionParagraph,
                        arVisionParagraph:model.arVisionParagraph
                    };
                    if($scope.insertedMission != 0){
                        modelObject.missionImageId=$scope.insertedMission
                    }
                    if($scope.insertedVission != 0){
                        modelObject.visionImageId=$scope.insertedVission
                    }
                    homeService.editAbout(modelObject,function(res,err){
                        if(!err){
                            SweetAlert.swal("Good job!", "The Abou Us Section updated successfully", "success");
                            $route.reload();
                        }else{
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    })
                        })
                    })
                
                
                    
            }
        }
          $scope.addNewImageToSlider = function(up,model){
            console.log(up)

            if(!model.id){
                Upload.upload({
                    url: $rootScope.backendURL +'upload', //webAPI exposed to upload the file
                    data:{file:up.file} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if(resp.data.error_code === 0){ //validate success
                        modelObject = {title:model.title, arTitle:model.arTitle, paragraph:model.paragraph,arParagraph:model.arParagraph, imageId:resp.data.insertedFile.id};
                        homeService.creatNewSlider(modelObject,function(res,err){
                            if(!err){
                                SweetAlert.swal("Good job!", "The Image added successfully", "success");

                                //reload page
                                $route.reload();
                                
                            }else{
                                SweetAlert.swal("Error", "an error occuers", "error");
                            }
                        })
                    } else {
                        SweetAlert.swal("Error", "an error occuers", "error");

                    }
                }, function (resp) { //catch error
                    // console.log('Error status: ' + resp.status);
                    // $window.alert('Error status: ' + resp.status);
                    SweetAlert.swal("Error", "an error occuers", "error");
                }, function (evt) { 
                    // console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            }else{
                console.log(up)
                if(!up.file){
                    console.log('edit only');
                    modelObject = {id:model.id,title:model.title, arTitle:model.arTitle, paragraph:model.paragraph,arParagraph:model.arParagraph};
                    homeService.editSlide(modelObject,function(res,err){
                        if(!err){
                            SweetAlert.swal("Good job!", "The Image updated successfully", "success");
                            $route.reload();
                        }else{
                            SweetAlert.swal("Error", "an error occuers", "error");
                        }
                    })
                    
                }else{
                    console.log('edit with file');
                    Upload.upload({
                        url: $rootScope.backendURL +'upload', //webAPI exposed to upload the file
                        data:{file:up.file} //pass file as data, should be user ng-model
                    }).then(function (resp) { //upload function returns a promise
                        if(resp.data.error_code === 0){ //validate success                    
                            modelObject = {id:model.id,title:model.title, arTitle:model.arTitle, paragraph:model.paragraph,arParagraph:model.arParagraph, imageId:resp.data.insertedFile.id};
                            homeService.editSlide(modelObject,function(res,err){
                                if(!err){
                                    SweetAlert.swal("Good job!", "The Image updated successfully", "success");
                                    $route.reload();
                                    
                                    
                                }else{
                                    SweetAlert.swal("Error", "an error occuers", "error");
                                }
                            })
                        } else {
                            SweetAlert.swal("Error", "an error occuers", "error");
    
                        }
                    }, function (resp) { //catch error
                        // console.log('Error status: ' + resp.status);
                        // $window.alert('Error status: ' + resp.status);
                        SweetAlert.swal("Error", "an error occuers", "error");
                    }, function (evt) { 
                        // console.log(evt);
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    });
                }
            }
        }
          $scope.init();

          $scope.confirmPopup = function(modelId){
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this operation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false }, 
             function(isConfirm){ 
                if (isConfirm) {
                    $scope.deleteIt(modelId)
                } else {
                   SweetAlert.swal("Cancelled", "Your imaginary data is safe :)", "error");
                }
             });
        }
        $scope.deleteIt = function(modelId){
            homeService.deleteImageById(modelId,function(res,err){
                if(!err){
                    SweetAlert.swal("Deleted!", "Your data has been deleted.", "success");
                    $route.reload();
                }
            })
        }
        $scope.editSparePart = function(model){
            $scope.model.id = model.id;
            $scope.model.title = model.title;
            $scope.model.arTitle = model.arTitle;
            $scope.model.paragraph = model.paragraph;
            $scope.model.arParagraph = model.arParagraph;
        }
          $scope.reloadScripts = function(){
            var script = document.createElement('script');
            script.src = "assets/js/script.js";
            document.head.appendChild(script);
            var script2 = document.createElement('script');
            script2.src="assets/js/main-slider-script.js"
            document.head.appendChild(script2);
        }
    });
