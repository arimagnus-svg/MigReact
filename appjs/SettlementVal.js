var app = angular.module("SettlementApp", ['ui.bootstrap']);
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
                                targets: 7,
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
 
app.controller("SettlementController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;

    $scope.URL = "https://payroll.arimagnushr.com";
   //  $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.SelectedMonth ;

    $scope.SelectedData = new Array();
    $scope.SelectedMonth;

    $scope.addItem = function (item) {
        $scope.SelectedData.push(item);
        alert($scope.SelectedData);
    };

    $scope.removeItem = function (item) {
        $scope.SelectedData.push(item);
        alert($scope.SelectedData);
    };
    $scope.models = {
        selected: null,
        lists: { "Available": [], "Selected": [] }
    };

   

    $scope.moveItem = function (item, from, to) {



        var idx = from.indexOf(item);
        if (idx != -1) {
            from.splice(idx, 1);
            to.push(item);
        }
    };
    $scope.moveAll = function (from, to) {

 
        angular.forEach(from, function (item) {
            to.push(item);
        });
        from.length = 0;
    };

    $scope.selectedclients = [];
     

    // Model to JSON for demo purpose
    $scope.$watch('models', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

   

    $scope.LoadSettlement = function (action) {

        var today = new Date();

        if (action == null || action == "undefined") {
            var month = today.toLocaleString('default', { month: 'short' });
            var year = today.getFullYear();
            $scope.m = month + '-' + year;
            $scope.SelectedMonth = $scope.m;
            $scope.FinalSettlementID = 0;
        }
        else {
            $scope.FinalSettlementID = action;
            $scope.m = null;
        }

         
        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Settlement/LoadSettlement",
            contentType: "application/json",
            dataType: "json",
            data: { SettlementDate: $scope.m, FinalSettlementID: $scope.FinalSettlementID }

        }).then(function (response) {
            $scope.SettlementListModel = response.data;
            $scope.Months = $scope.SettlementListModel.months; 
            $scope.SelectedMonth = $scope.m;
            if ($scope.FinalSettlementID != 0) {
                $scope.SettlementModel = $scope.SettlementListModel.settlementList[0];
                $scope.employeeList = $scope.SettlementListModel.employeeList; 
                $scope.leaveListModel = $scope.SettlementListModel.leaveListModel; 

            }
            else {
                $scope.settlementList = $scope.SettlementListModel.settlementList;

            }
            //Loading Pagination details
            $scope.currentPageItem = 1;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 5; // items per page
            
            if ($scope.settlementList !== undefined) {
                $scope.totalItemsItem = $scope.settlementList.length;
                $scope.noOfPagesItem = 1;
            }
            if ($scope.totalItemsItem > 5) {
                $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
            }
             

            //alert($scope.noOfPagesItem);

        }, function () {
            alert("Error Occur");
        })
    };

    $scope.LoadAddSettlement = function (m) {

        var date = new Date();
        if (m == 0 || m == null)
            $scope.m = (date.getMonth()+1) + '-' + date.getFullYear();
        else
            $scope.m =m
        $scope.SelectedMonth = $scope.m;

        var EmployeeModel = {
            month: $scope.m
        }
         //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Settlement/LoadAddSettlement",
            contentType: "application/json",
            dataType: "json",
            data: EmployeeModel

        }).then(function (response) {
            $scope.SettlementListModel = response.data; 
            $scope.Months = $scope.SettlementListModel.months;  
            $scope.employeeList = $scope.SettlementListModel.employeeList; 
            $scope.leaveListModel = $scope.SettlementListModel.leaveListModel; 

            console.log("response", $scope.SettlementListModel);

        }, function () {
            alert("Error Occur");
        })
    };
 
     



    $scope.SaveSettlement = function (SettlementModel, selectedclient) {

        if (confirm("Confirm to Save Settlement?")) {
            
            $scope.SettlementModel = SettlementModel;
            $scope.selectedclient = selectedclient;

            $scope.SettlementModel.EmployeeID = selectedclient[0].employeeID;
            $scope.SettlementModel.LWD = selectedclient[0].lwd;
            $scope.SettlementModel.ResignationDate = selectedclient[0].dor;
           
            console.log($scope.SettlementModel);

            //debugger;
            $http({

                method: "post",
                url: $scope.URL + "/Settlement/SaveSettlement",
                contentType: "application/json",
                dataType: "json",
                data: $scope.SettlementModel

            }).then(function (response) {
                $scope.settlementList = response.data;

                $scope.ProfileSalarySummaryList = $scope.settlementList.profileSalarySummaryList;
                $scope.Months = $scope.MonthlySalaryList.months;
                $scope.SelectedMonth = m;
                $scope.msg = "Settlement has been saved successfully...";


            }, function () {
                alert("Error Occur");
            })
        }
    }

    $scope.EditSettlement = function (SettlementModel) {
        if (confirm("Confirm to Save Settlement?")) {

            $scope.SettlementModel = SettlementModel;
            // $scope.selectedclient = selectedclient;
            var settDate = Date.parse(SettlementModel.settlementDate);
            var LWD = Date.parse(SettlementModel.lwd);

            if (settDate < LWD) {

                alert("Settlement date should be greater than LWD");
                return;
            }

            //alert(selectedclient);

            //debugger;
            $http({

                method: "post",
                url: $scope.URL + "/Settlement/SaveSettlement",
                contentType: "application/json",
                dataType: "json",
                data:  $scope.SettlementModel 

            }).then(function (response) {
                $scope.settlementList = response.data;

                $scope.ProfileSalarySummaryList = $scope.settlementList.profileSalarySummaryList;
                $scope.Months = $scope.MonthlySalaryList.months;
                $scope.SelectedMonth = m;

                $scope.msg = "Settlement has been updated successfully...";

            }, function () {
                alert("Error Occur");
            })
        }
    }

    $scope.ProcessSettlement = function (SettlementModel) {
        if (confirm("Confirm to process settlement?")) {
            $scope.SettlementModel = SettlementModel;

            $http({
                method: "post",
                url: $scope.URL + "/Settlement/ProcessSettlement",
                contentType: "application/json",
                dataType: "json",
                data: $scope.SettlementModel 
                //   data: { $scope.FormBListModel }

            }).then(function (response) {

                $scope.msg = "Settlement has been processed successfully!!!";
            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };


    $scope.parseDate = function (dateString) {
        if (dateString!=null) {
            return new Date(dateString);
        }
        return null;
    }

     
     
// pagination controls

$scope.searchItem = {};


$scope.resetFilters = function () {
    // needs to be a function or it won't trigger a $watch
    $scope.searchItem = {};

};

//Item
$scope.currentPageItem = 1;
    $scope.totalItemsItem = 0;
    if ($scope.ProfileSalaryListModel !== undefined) {
    $scope.totalItemsItem = $scope.masterGroupListModel.length;
}
$scope.entryLimitItem = 5; // items per page
$scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);



    $scope.$watch('searchItem', function (newVal, oldVal) {

        if ($scope.ProfileSalaryListModel !== undefined) {
        $scope.filtered = filterFilter($scope.ProfileSalaryListModel, newVal);
        $scope.totalItemsItem = $scope.filtered.length;
    }
    else {
        $scope.totalItemsItem = 0;
    }
    $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
    $scope.currentPageItem = 1;

}, true);

}]);


