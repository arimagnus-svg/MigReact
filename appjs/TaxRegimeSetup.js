var app = angular.module("TaxRegimeApp", ['ui.bootstrap']);
 
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

app.controller("TaxRegimeController", ['$scope', '$http', '$location', 'filterFilter', function ($scope, $http, $location, filterFilter) {
    //debugger;
    $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
 

    $scope.SaveTaxRegimeSel = function (TaxRegimeModel) {
        // debugger;
        if (confirm("Confirm to Save the Tax Regime?")) {
            console.log("SaveTaxRegimeSel", TaxRegimeModel);
            $http({

                method: "post",
                url: $scope.URL + "/TaxRegime/SaveTaxRegimeOption",
                contentType: "application/json",
                dataType: "json",
                data: TaxRegimeModel 
            }).then(function (response) {
                $scope.EmpSalPFModel = response.data;
                $scope.msg = "Saved Successfully!!!"
            }, function () {
                alert("Error Occur");
            })
        }
    };
     

 

    $scope.LoadTaxRegimeOptions = function () {

        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/TaxRegime/LoadTaxRegimeOptionData"

        }).then(function (response) {
            $scope.modelList = response.data;

            $scope.msg = "";

            if ($scope.modelList.length > 0)
                $scope.TaxRegimeModel = $scope.modelList[0];
            
        }, function () {
            alert("Error Occur");
        })
    };


    $scope.LoadTaxRegimeEdit = function (Ad) {
        console.log("LoadTaxRegimeEdit", Ad);
        var TaxRegimeModel = {
            TaxregimeID: Ad
        }
        // debugger;
        $http({

            method: "post",
            url: $scope.URL + "/TaxRegime/LoadTaxRegimeAdOption",
            contentType: "application/json",
            dataType: "json",
            data: TaxRegimeModel
        }).then(function (response) {
            $scope.modelList = response.data;

            if ($scope.modelList.length > 0)
                $scope.TaxRegimeModel = $scope.modelList[0];

        }, function () {
            alert("Error Occur");
        })
    };

    $scope.LoadTaxRegimeSummary = function () {

        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/TaxRegime/LoadTaxRegimeOptionSummary"

        }).then(function (response) {
            $scope.modelList = response.data;
            $scope.msg = "";
            //Orgnization
            $scope.currentPageOrg = 1;
            $scope.totalItemsOrg = 0;
            $scope.entryLimitOrg = 5; // items per page
            if ($scope.modelList !== undefined) {
                $scope.totalItemsOrg = $scope.modelList.length;
            }
            $scope.noOfPagesOrg = Math.ceil($scope.totalItemsOrg / $scope.entryLimitOrg);
            if ($scope.modelList !== undefined && $scope.noOfPagesOrg < 1)
                $scope.noOfPagesOrg = 1;
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



 