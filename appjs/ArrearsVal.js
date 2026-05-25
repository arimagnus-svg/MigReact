var app = angular.module("ArrearsApp", ['ui.bootstrap']);
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
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



app.controller("ArrearsController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;

     $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";

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

   

    $scope.LoadArrears = function (action) {

         
            $scope.yr = new Date().getFullYear();
            $scope.SelectedMonth = $scope.yr;
            var ProfileSalaryModel = {
                Year :$scope.yr
            }

        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Arrears/LoadArrears",
            contentType: "application/json",
            dataType: "json",
            data: ProfileSalaryModel

        }).then(function (response) {
            $scope.arrearList = response.data;
            $scope.Months = $scope.arrearList.Months; 
            $scope.SelectedMonth = $scope.yr; 
            $scope.profileSalaryList = $scope.arrearList.profileSalaryList;

            
            //Loading Pagination details
            $scope.currentPageItem = 0;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 10; // items per page
            if ($scope.profileSalaryList !== undefined) {
                $scope.totalItemsItem = $scope.profileSalaryList.length;
                $scope.currentPageItem = 1;
            }
            if ($scope.totalItemsItem > 10) {
                $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
            }


            //alert($scope.noOfPagesItem);

        }, function () {
            alert("Error Occur");
        })
    };

    $scope.LoadAddArrears = function () {

        var date = new Date();
         
        $scope.yr =date.getFullYear();
        var ProfileSalaryModel = {
            Year:$scope.yr
        }
        $scope.SelectedMonth = $scope.yr;
         //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Arrears/LoadAddArrears",
            contentType: "application/json",
            dataType: "json",
            data: ProfileSalaryModel

        }).then(function (response) {
            $scope.arrearList = response.data; 
            $scope.Months = $scope.arrearList.months;  
            $scope.employeeList = $scope.arrearList.employeeList; 
            $scope.profileSalaryList = $scope.arrearList.profileSalaryList; 


        }, function () {
            alert("Error Occur");
        })
    };
 

    $scope.LoadArrearsbyID = function (id,m) {

        //alert(id);
        var ProfileSalaryModel = {
            Year:m, EmployeeID: id
        } 

        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Arrears/LoadArrearsbyID",
            contentType: "application/json",
            dataType: "json",
            data: ProfileSalaryModel

        }).then(function (response) {
            $scope.arrearList = response.data;
            $scope.Months = $scope.arrearList.months;
            $scope.employeeList = $scope.arrearList.employeeList;
            $scope.profileSalaryList = $scope.arrearList.profileSalaryList; 
            $scope.empName = $scope.arrearList.empName;
            if ($scope.profileSalaryList.length > 0)
                $scope.ProfileSalaryModel = $scope.profileSalaryList[0]; 

        }, function () {
            alert("Error Occur");
        })
    };



    $scope.SaveArrears = function (ProfileSalaryModel, selectedclient) {
        
           
        if (confirm("Confirm to Save Arrears?")) {

            var ProfileSalaryRequestModel = {
                prfSalaryModel: ProfileSalaryModel, employeeList: selectedclient
            }

            $http({

                method: "post",
                url: $scope.URL + "/Arrears/SaveArrears",
                contentType: "application/json",
                dataType: "json",
                data: ProfileSalaryRequestModel

            }).then(function (response) {
                $scope.arrearList = response.data;
                $scope.msg = "Arrears details has been saved successfully...";

            }, function () {
                alert("Error Occur");
            })
        }
    }
 
     


    $scope.UpdateArrears = function (ProfileSalaryModel) {

 
        if (confirm("Confirm to update Arrears?")) {
            $http({

                method: "post",
                url: $scope.URL + "/Arrears/UpdateArrear",
                contentType: "application/json",
                dataType: "json",
                data:   ProfileSalaryModel 

            }).then(function (response) {
                $scope.arrearList = response.data;
                $scope.msg = "Arrears details are updated successfully...";
            }, function () {

                alert("Error Occur");


            })
        }
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


