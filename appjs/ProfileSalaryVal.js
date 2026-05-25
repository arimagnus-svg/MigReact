var app = angular.module("ProfileSalaryApp", ['ui.bootstrap']);
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

app.filter("commaBreak",

    function () {

        return function (value) {

            if (!value.length) return;

            return value.split(';');

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
app.controller("ProfileSalaryController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.URL = "https://payroll.arimagnushr.com";
  //  $scope.URL = "https://localhost:17177";

       
    

    $scope.LoadProfileSalaryDetails = function () {
       
         //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/ProfileSalary/LoadProfileSalaryDetails"           


        }).then(function (response) {
            $scope.ProfileSalaryListModel = response.data;

            $scope.profileSalaryList = $scope.ProfileSalaryListModel.profileSalaryList; 
            $scope.profileSalaryComponentList = $scope.ProfileSalaryListModel.profileSalaryComponentList; 
            $scope.userDisplayList = $scope.ProfileSalaryListModel.userDisplayList;


            //Loading Pagination details
            $scope.currentPageItem = 1;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 5; // items per page
            if ($scope.profileSalaryList !== undefined) {
                $scope.totalItemsItem = $scope.profileSalaryList.length;
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

 

    $scope.LoadAddProfileSalary = function () {
        
        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/ProfileSalary/LoadAddProfileSalaryDetails"


        }).then(function (response) {
            $scope.ProfileSalaryModel = response.data; 
            $scope.masterGroupList = $scope.ProfileSalaryModel.masterGroupList; 
            for (var i = 0; i < $scope.masterGroupList.length; ++i) {
                $scope.models.lists.Available.push({ 'label': $scope.masterGroupList[i].groupName });
            }

        }, function () {
            alert("Error Occur");
        })
    };



    $scope.SaveRevisedSalary = function (profileSalaryList) {
        var today = new Date();
       // var month = currentTime.getMonth() + 1;
       // var year = currentTime.getFullYear()+2;
        var month = today.getMonth();
        var year = today.getFullYear();
       


        if (confirm("Confirm to Save Revised Salary?")) {

            // $scope.profileSalaryList = profileSalaryList; 
            // alert("a" + $scope.profileSalaryList[0].SalaryProfileID);
            if ($scope.profileSalaryList.length > 0 && $scope.profileSalaryList[0].year == year) {
                alert("You can revise the salary for next Financial year only!!!.");
                $scope.msg = "You can revise the salary for next Financial year only!!!.";

                return;
            }


            $http({
                method: "post",
                url: $scope.URL + "/ProfileSalary/SaveRevisedSalary",
                contentType: "application/json",
                dataType: "json",
                data: profileSalaryList

            }).then(function (response) {

                $scope.msg = "Salary has been revised successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };

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


