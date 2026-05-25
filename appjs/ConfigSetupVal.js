var app = angular.module("UserAppConfig", ['ui.bootstrap']);
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
});

app.directive("tableload", function () {
    return {
        link: function (scope, ele, attr) {
            $(document).ready(function () {
                $('#formSummary-table').DataTable(
                    {
                        retrieve: true,
                        dom: 'rtip',
                        columnDefs: [
                            {
                                // Target the id column
                                targets: 2,
                                width: '72px'
                            },
                            {
                                // Target the actions column
                                targets: 4,
                                responsivePriority: 1,
                                filterable: false,
                                sortable: false
                            }
                        ],

                        initComplete: function () {
                            var api = this.api(),
                                searchBox = $('#orders-search-input');

                            // Bind an external input as a table wide search box
                            if (searchBox.length > 0) {
                                searchBox.on('keyup', function (event) {
                                    api.search(event.target.value).draw();
                                });
                            }
                        },
                        lengthMenu: [10, 20, 30, 50, 100],
                        pageLength: 10,
                        scrollY: 'auto',
                        scrollX: false,
                        responsive: true,
                        autoWidth: false
                    }
                );


            });
        }
    }
});
app.directive("input", function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, modelCtrl) {
            if (attr['type'] === 'date') {
                modelCtrl.$formatters.push(function (modelValue) {
                    if (modelValue) {
                        return new Date(modelValue);
                    }
                    else {
                        return null;
                    }
                });
            }

        }
    };
});
app.controller("UserAppConfigController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;

     $scope.URL = "https://payroll.arimagnushr.com";
  //  $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";

    $scope.SaveConfigSetup = function (userConfigModel) {
         
        if (confirm("Confirm to save the setup?")) {

            
            var payload = {
                UserConfigModel: userConfigModel
            }
            console.log("SaveConfigSetup", userConfigModel);

            $http({
                method: "post",
                url: $scope.URL + "/UserAppConfig/SaveConfigDetails",   
                
                data: userConfigModel 


            }).then(function (response) {

                $scope.msg = " User Config setup has been saved successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
    
    $scope.EditConfigSetup = function (ItemAction) {
        if (confirm("Confirm to edit the setup?")) {
            var payload = {
                ParamID: ItemAction 
            }
            $http({

                method: "post",
                url: $scope.URL + "/UserAppConfig/LoadConfigSetupForEdit",
                contentType: "application/json",
                dataType: "json",
                data: payload
            }).then(function (response) {
                $scope.userConfigModel = response.data;

            }, function () {
                alert("Error Occur");
            })
        }
    };
        
     
     


    $scope.DeleteConfigSetup = function (UserConfigModel) {
        if (confirm("Confirm to delete the setup?")) {

            $scope.userConfigModel = UserConfigModel;

            $http({
                method: "post",
                url: $scope.URL + "/UserAppConfig/DeleteConfigSetup",
                contentType: "application/json",
                dataType: "json",
                data: { userConfigModel: $scope.userConfigModel }

            }).then(function (response) {
                var index = $scope.userConfigList.indexOf($scope.userConfigModel);
                $scope.userConfigList.splice(index, 1);

                $scope.msg = " User Config setup has been deleted successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };



    $scope.LoadConfigSetupDetails = function () {


       // debugger;
        $http({
           
            method: "get",
            url: $scope.URL + "/UserAppConfig/LoadConfigSetupDetails"

        }).then(function (response) {
            $scope.userConfigList = response.data;
         
            //Orgnization
            $scope.currentPageOrg = 1;
            $scope.totalItemsOrg = 0;
            $scope.entryLimitOrg = 5; // items per page
            if ($scope.userConfigList !== undefined) {
                $scope.totalItemsOrg = $scope.userConfigList.length;
            }
            $scope.noOfPagesOrg = Math.ceil($scope.totalItemsOrg / $scope.entryLimitOrg);
           // alert($scope.noOfPagesOrg);


        }, function () {
            alert("Error Occur");
        })
    };



    $scope.SaveGroupNodeSetup = function (UserConfigModel) {

        if (confirm("Confirm to save the setup?")) {

            

            $http({
                method: "post",
                url: $scope.URL + "/UserAppConfig/SaveGroupNodeDetails",
                 
                data: UserConfigModel

            }).then(function (response) {

                $scope.msg = " User Config setup has been saved successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };

    $scope.EditGroupNodeSetup = function (ItemAction) {
        if (confirm("Confirm to save the setup?")) {

            var payload = {
                GroupNodeID: ItemAction
            }

            // debugger;
            $http({

                method: "post",
                url: $scope.URL + "/UserAppConfig/LoadGroupNodeForEdit",
                contentType: "application/json",
                dataType: "json",
                data: payload
            }).then(function (response) {
                $scope.userConfigModel = response.data;

            }, function () {
                alert("Error Occur");
            })
        }
    };





    $scope.DeleteGroupNodeSetup = function (UserConfigModel) {
        if (confirm("Confirm to delete the setup?")) {

            $scope.userConfigModel = UserConfigModel;

            $http({
                method: "post",
                url: $scope.URL + "/UserAppConfig/DeleteGroupNodeSetup",
                contentType: "application/json",
                dataType: "json",
                data: { userConfigModel: $scope.userConfigModel }

            }).then(function (response) {
                var index = $scope.userConfigList.indexOf($scope.userConfigModel);
                $scope.userConfigList.splice(index, 1);

                $scope.msg = " User Config setup has been deleted successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };



    $scope.LoadGroupNodeDetails = function () {

        
        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/UserAppConfig/LoadGroupNodeData"

        }).then(function (response) {
            $scope.userConfigList = response.data;

            //Orgnization
            $scope.currentPageOrg = 1;
            $scope.totalItemsOrg = 0;
            $scope.entryLimitOrg = 10; // items per page
            if ($scope.userConfigList !== undefined) {
                $scope.totalItemsOrg = $scope.userConfigList.length;
            }
            $scope.noOfPagesOrg = Math.ceil($scope.totalItemsOrg / $scope.entryLimitOrg);
            // alert($scope.noOfPagesOrg);


        }, function () {
            alert("Error Occur");
        })
    };


   
        // pagination controls

    $scope.searchOrg = {};


    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.searchOrg = {};

    };

    //Organization
    $scope.currentPageOrg = 1;
    $scope.totalItemsOrg = 0;
    if ($scope.userConfigList !== undefined) {
        $scope.totalItemsOrg = $scope.userConfigList.length;
    }
    $scope.entryLimitOrg = 10; // items per page
    $scope.noOfPagesOrg = Math.ceil($scope.totalItemsOrg / $scope.entryLimitOrg);



    $scope.$watch('searchOrg', function (newVal, oldVal) {

        if ($scope.userConfigList !== undefined) {
            $scope.filtered = filterFilter($scope.userConfigList, newVal);
            $scope.totalItemsOrg = $scope.filtered.length;
        }
        else {
            $scope.totalItemsOrg = 0;
        }
        $scope.noOfPagesOrg = Math.ceil($scope.totalItemsOrg / $scope.entryLimitOrg);
        $scope.currentPageOrg = 1;

    }, true);

}]);


