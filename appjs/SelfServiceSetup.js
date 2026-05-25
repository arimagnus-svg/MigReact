var app = angular.module("SelfService", ['ui.bootstrap']);
 
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
                                targets: 5,
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

app.controller("SelfServiceController", ['$scope', '$http', '$location', 'filterFilter', function ($scope, $http, $location, filterFilter) {
    //debugger;

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";

    $scope.SaveBankPF = function (EmpSalPFModel) {
        if (confirm("Confirm to save the record?")) {

            // debugger;
            $http({

                method: "post",
                url: $scope.URL + "/SelfService/SaveBankPFDetails",
                contentType: "application/json",
                dataType: "json",
                data: EmpSalPFModel 
            }).then(function (response) {
                $scope.EmpSalPFModel = response.data;
                $scope.msg = "Bank/PF details has been saved successfully!!!";

            }, function () {
                alert("Error Occur");
            })
        }
    };
     

    $scope.LoadBankPFbyID = function (id) {
        var payload = {
            EmpPID: id
        }
        
        // debugger;
        $http({

            method: "post",
            url: $scope.URL + "/SelfService/LoadBankPFDataEdit",
            contentType: "application/json",
            dataType: "json",
            data: payload
        }).then(function (response) {
            $scope.bankPFList = response.data;
            if ($scope.bankPFList.length > 0)
                $scope.EmpSalPFModel = $scope.bankPFList[0]; 
        }, function () {
            alert("Error Occur");
        })
    };
 

    $scope.LoadBankPFDetails = function () {


        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/SelfService/LoadBankPFData"

        }).then(function (response) {
            $scope.modelList = response.data;

            //Orgnization
            $scope.currentPageOrg = 1;
            $scope.totalItemsOrg = 0;
            $scope.entryLimitOrg = 5; // items per page
            if ($scope.modelList !== undefined) {
                $scope.totalItemsOrg = $scope.modelList.length;
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
    $scope.entryLimitOrg = 5; // items per page
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



 