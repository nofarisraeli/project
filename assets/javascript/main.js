var App = angular.module("App",
                                ["ngRoute",
                                 "ngMaterial",
                                 "ngAnimate",
                                 "angucomplete"]);

App.controller("mainController",
    function ($scope,
              $window,
              $mdSidenav,
              definitionService,
              requestsService,
              apiService,
              $rootScope) {

        // Variable definition
        $scope.language = "עברית";
        $scope.definitionService = definitionService;
        $scope.apiService = apiService;
        $scope.isValid = true;
        $scope.testsArr = [];
        $scope.usersArr = [];
        $scope.statusArr = [];
        $scope.isUpdate = false;
        $scope.imgUrl = "";
        $scope.statusArr = definitionService.statusArr;
        $scope.yearValid = true;
        $scope.dateValid = true;
        $rootScope.statusFilterArr = [];
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
        $scope.orderSelected = 'id';
        $scope.reverse = false;
        // models auto complete
        $scope.autocomplete = {};
        $scope.autocomplete.models = {
            source: [],
            enabled: true,
            clearNeeded: false,
            load: function () {
                requestsService.getData(apiService.modelsUrl)
                    .then(function (data) {
                        var models = [];
                        if (data.models) {
                            var model = undefined;
                            for (var key in data.models) {
                                if (data.models.hasOwnProperty(key)) {
                                    model = {
                                        value: key,
                                        name: data.models[key]
                                    };
                                    models.push(model);
                                    model = undefined;
                                }
                            }
                        }
                        $scope.autocomplete.models.source = models;
                    });
            },
            textchanged: function (str) {
                if ($scope.autocomplete.models.clearNeeded) {
                    $scope.autocomplete.sub_models.clear();
                    $scope.autocomplete.models.clearNeeded = false;
                }
            },
            placeholder: definitionService.modalEgit.typeLabel,
            delay: 100,
            selected: null,
            searchfields: "name",
            titlefield: "name",
            minlength: "0",
            inputclass: "form-control",
            selectedcb: function (result) {
                $scope.autocomplete.models.clearNeeded = true;
                $scope.autocomplete.sub_models.load(result.value);
            }
        };
        $scope.autocomplete.sub_models = {
            source: [],
            selected_model: undefined,
            enabled: false,
            clear: function () {
                this.enabled = false;
                this.selected = null;
                selected_model = undefined;
                $scope.newTest.car.model_id = null;
                $scope.newTest.car.sub_model_id = null;
                $('#sub_models_auto_complete_value').val("");
            },
            load: function (model_id) {
                if (model_id) {
                    this.enabled = false;
                    this.selected = null;
                    this.selected_model = model_id;
                    var model_data = {
                        car_model_id: model_id
                    };
                    requestsService.sendData(apiService.subModelsUrl, model_data,
                        function (success) {
                            if (success && success.data && success.data.sub_models) {
                                var data = success.data;
                                var sub_models = [];
                                var sub_model = undefined;
                                if (data.sub_models) {
                                    for (var key in data.sub_models) {
                                        if (data.sub_models.hasOwnProperty(key)) {
                                            sub_model = {
                                                value: key,
                                                name: data.sub_models[key]
                                            };
                                            sub_models.push(sub_model);
                                            sub_model = undefined;
                                        }
                                    }
                                }
                                $scope.autocomplete.sub_models.source = sub_models;
                                $scope.autocomplete.sub_models.enabled = true;
                            }
                        }, function (error) {
                            alert(error.msg);
                        });
                }
            },
            placeholder: definitionService.modalEgit.subModelLabel,
            delay: 100,
            selected: null,
            searchfields: "name",
            titlefield: "name",
            minlength: "1",
            inputclass: "form-control",
            selectedcb: function (result) {
                $scope.newTest.car.model_id = $scope.autocomplete.sub_models.selected_model;
                $scope.newTest.car.sub_model_id = result.value;
            }
        };

        // Initiate Data

        $scope.Initiate = function () {
            requestsService.getData(apiService.userUrl)
                .then(function (data) {
                    $scope.usersArr = data.customers;
                });
            requestsService.getData(apiService.testUrl)
                .then(function (data) {
                    $scope.testsArr = data.results;
                });
            $scope.autocomplete.models.load();
        };

        $scope.Initiate();

        $scope.getStatus = function (s) {
            for (var i = 0; i < $scope.statusArr.length; i++) {
                if (s == $scope.statusArr[i].status) {
                    return $scope.statusArr[i].id;
                }
            }
        };

        $scope.changeLang = function (newLang) {
            $scope.language = newLang;
        };

        $scope.toggleChecked = function (type) {
            return (1 - type);
            /*
             if (type == 1) {
             type = 0;
             }
             else {
             type = 1;
             }*/
        };

        $scope.isDateRangeValid = function (minDate, maxDate) {
            if (minDate == undefined || maxDate == undefined) {
                $scope.isValid = true;
                return;
            }
            $rootScope.minDate = new Date(minDate);
            $rootScope.maxDate = new Date(maxDate);
            $scope.isValid = true;
            if ($rootScope.minDate.getYear() == $rootScope.maxDate.getYear()) {
                if ($rootScope.minDate.getMonth() == $rootScope.maxDate.getMonth()) {
                    if ($rootScope.minDate.getDate() > $rootScope.maxDate.getDate()) {
                        $scope.isValid = false;
                    }
                }
                else if ($rootScope.minDate.getMonth() > $rootScope.maxDate.getMonth()) {
                    $scope.isValid = false;
                }
            }
            else if ($rootScope.minDate.getYear() > $rootScope.maxDate.getYear()) {
                $scope.isValid = false;
            }
        };

        $scope.setShowTest = function (test) {

            //$scope.isUpdate = false;
            $scope.showTest = {
                car_result_id: test.id,
                status_id: test.status_id,
                status: test.status,
                test_date: test.test_date,
                gear: test.gear,
                engine: test.engine,
                chassis: test.chassis,
                car_no: test.car_no,
                car: {
                    car_no: '' + test.car_no,
                    year: undefined,
                    model: undefined,
                    model_id: undefined,
                    sub_model: undefined,
                    sub_model_id: undefined
                },
                images: test.images
            };
            if (test.car) {
                $scope.showTest.car = {
                    car_no: test.car.car_no,
                    year: test.car.year,
                    model: test.car.model,
                    model_id: test.car.model_id,
                    sub_model: test.car.sub_model,
                    sub_model_id: test.car.sub_model_id
                }
            }
            if (test.reason) {
                $scope.showTest.comment = test.reason.comment
            }
            $scope.newTest = {
                car_result_id: test.id,
                status_id: test.status_id,
                status: test.status,
                test_date: new Date(test.test_date),
                gear: test.gear,
                engine: test.engine,
                chassis: test.chassis,
                car: {
                    car_no: '' + test.car_no,
                    year: undefined,
                    model: undefined,
                    model_id: undefined,
                    sub_model: undefined,
                    sub_model_id: undefined
                }
            };
            if (test.car) {
                $scope.newTest.car = {
                    car_no: test.car.car_no,
                    year: test.car.year,
                    model: test.car.model,
                    model_id: test.car.model_id,
                    sub_model: test.car.sub_model,
                    sub_model_id: test.car.sub_model_id
                };
            }
            if (test.reason) {
                $scope.newTest.comment = test.reason.comment
            }

            $scope.changeTestData = false;
            $scope.changeCarData = false;
            // set picture url
            $scope.imgUrl = $scope.showTest.images[0];
        };

        $scope.showImg = function (url) {
            $scope.imgUrl = url;
        };

        $scope.updateDetails = function () {
            if (($scope.yearValidation($scope.newTest.car.year)) &&
                ($scope.dateValidation($scope.newTest.test_date))) {
                swal({
                    title: definitionService.swal.swalTitleMsg,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: definitionService.swal.confirmButtonText,
                    cancelButtonText: definitionService.swal.cancelButtonText,
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {

                        if ($scope.changeCarData) {

                            var car_data = {
                                car_no: $scope.newTest.car.car_no,
                                model_id: $scope.newTest.car.model_id,
                                sub_model_id: $scope.newTest.car.sub_model_id,
                                year: $scope.newTest.car.year
                            };
                            requestsService.sendData(apiService.carUpdateUrl, car_data,
                                function (success) {
                                    swal(definitionService.swal.swalSuccessMsg.action,
                                        definitionService.swal.swalSuccessMsg.car + " " +
                                        definitionService.swal.swalSuccessMsg.actionMsg,
                                        "success");
                                }, function (error) {
                                    swal(error, definitionService.swal.swalErrors.car,
                                        "error");
                                    // $scope.newTest = $scope.showTest;
                                });

                        }
                        if ($scope.changeTestData) {
                            //$scope.newTest.status_id = $scope.getStatus($scope.newTest.status_id).id;
                            var test_data = {
                                car_result_id: $scope.newTest.car_result_id,
                                test_date: new Date($scope.newTest.test_date).toISOString().substr(0, 10),
                                engine: $scope.newTest.engine,
                                gear: $scope.newTest.gear,
                                chassis: $scope.newTest.chassis,
                                status_id: $scope.newTest.status_id,
                                comment: $scope.newTest.comment
                            };
                            // sending the request
                            requestsService.sendData(apiService.testUpdateUrl, test_data,
                                function (success) {
                                    swal(definitionService.swal.swalSuccessMsg.action,
                                        definitionService.swal.swalSuccessMsg.actionMsg,
                                        "success");
                                    $scope.Initiate();
                                }, function (error) {
                                    swal(error, definitionService.swal.swalErrors.test,
                                        "error");
                                });
                        }
                    }
                    else {
                        swal(definitionService.swal.swalCancelMsg, "", "error");
                        //$scope.newTest = $scope.showTest;
                    }
                });
            }
        };

        $scope.yearValidation = function (year) {

            $scope.yearValid = true;
            var text = /^[0-9]+$/;

            if ((year != "") && (!text.test(year))) {
                //alert("Please Enter Numeric Values Only");
                $scope.yearValid = false;
            }

            if (year.toString().length != 4) {
                //alert("Year is not proper. Please check");
                $scope.yearValid = false;
            }

            var current_year = new Date().getFullYear();
            if ((year < (current_year - 100)) || (year > current_year)) {
                //alert("Year should be in range 1916 to current year");
                $scope.yearValid = false;
            }
            return ($scope.yearValid);
        };

        $scope.dateValidation = function (date) {
            $scope.dateValid = true;
            var currentDate = new Date();
            if (date != null) {
                if (date.getTime > currentDate.getTime) {
                    $scope.dateValid = false;
                }
            }
            else {
                $scope.dateValid = false;
            }

            return ($scope.dateValid);
        };

        $scope.changeTest = function () {
            $scope.changeTestData = true;
            $scope.isUpdate = true;
        };

        $scope.changeCar = function () {
            $scope.changeCarData = true;
            $scope.isUpdate = true;
        };

// sort by
        $scope.sortBy = function (propertyName) {
            if ($scope.orderSelected == propertyName) {
                $scope.reverse = !$scope.reverse;
            }
            else {
                $scope.reverse = false;
            }

            $scope.orderSelected = propertyName;
        };

        // ser statusName for filter by status

        $scope.addStatusToFilter = function (statusId){
            if($rootScope.statusFilterArr.length != 0 &&
                $rootScope.statusFilterArr.indexOf(statusId) != -1)
            {
                $rootScope.statusFilterArr.splice($rootScope.statusFilterArr.indexOf(statusId),1);
            }
            else{
                $rootScope.statusFilterArr.push(statusId);
            }
        };

        // open new tab of the img url

        $scope.openImgUrl = function (url){
            $window.open(url, '_blank');
        };

// Side bar
        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }

    });

App.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/car/public/assets/crm/view/cars.html"
            // templateUrl: "/car/public/assets/crm/view/home.html"
        })
        .when("/cars", {
            templateUrl: "/car/public/assets/crm/view/cars.html"
        })
        .when("/users", {
            templateUrl: "/car/public/assets/crm/view/users.html"
        });
});

App.filter('daterange', function ($rootScope) {
    return function (input, min, max) {
        var out = [];
        if (min === undefined ||
            max === undefined) {
            return input;
        }
        else {
            angular.forEach(input, function (test) {
                var date = new Date(test.test_date);
                if (date.getTime() >= $rootScope.minDate.getTime() &&
                    date.getTime() <= $rootScope.maxDate.getTime()) {
                    out.push(test);
                }
            })
        }
        return out;
    }
});

App.filter('status', function ($rootScope) {
    return function (input) {
        var out = [];
        if ($rootScope.statusFilterArr.length == 0) {
            return input;
        }
        else {
            angular.forEach(input, function (test) {
                angular.forEach($rootScope.statusFilterArr, function (st){
                    if (test.status_id == st){
                        out.push(test);
                    }
                })
            })
        }
        return out;
    }
});

// angular.element(document).ready(function() {
//     angular.bootstrap(document, ['App']);
// });