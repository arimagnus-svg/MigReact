var app = angular.module("FlexiService", ['ui.bootstrap']);
 
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
                                targets: 6,
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

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
app.controller("FlexiController", ['$scope', '$http',  'filterFilter', function ($scope, $http,  filterFilter) {
    //debugger;
      $scope.URL = "https://payroll.arimagnushr.com";
    //$scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
 
    $scope.$watch('file', function (newVal) {
        if (newVal)
            console.log(newVal);
    });

    $scope.SaveBeneData = function (FlexiBenefitModel) {

        console.log("SaveBeneData", FlexiBenefitModel);
        if (confirm("Confirm to Save the declaration?")) {

            if (FlexiBenefitModel.DeclaredAmount > FlexiBenefitModel.ApprovedAmount) {
                alert("Declaration Amount should be less than Alloted Amount");
                return;
            }
            // debugger;
            $http({

                method: "post",
                url: $scope.URL + "/FlexiService/SaveFlexiBeneDetails",
                contentType: "application/json",
                dataType: "json",
                data:   FlexiBenefitModel 
            }).then(function (response) {
                $scope.FlexiBenefitModel = response.data;
                $scope.msg = "Saved Successfully!!!";

            }, function () {
                alert("Error Occur");
            })
        }
    };
    $scope.DeleteBeneData = function (FlexiBenefitModel) {
        if (confirm("Confirm to Delete the declaration?")) {
            // debugger;
            $http({

                method: "post",
                url: $scope.URL + "/FlexiService/DeleteFlexiData",
                contentType: "application/json",
                dataType: "json",
                data: { model: FlexiBenefitModel }
            }).then(function (response) {
                $scope.FlexiBenefitModel = response.data;
                $scope.msg = "Deleted Successfully!!!";

            }, function () {
                alert("Error Occur");
            })
        }
    };  

    $scope.LoadFlexiBeneDataEdit = function (BenefitName,action) {

      //  alert(id);
        // debugger;
        var payload = {
            BenefitName: BenefitName, Action: action
        }
        $http({

            method: "post",
            url: $scope.URL + "/FlexiService/LoadFlexiBeneDataEdit",
            contentType: "application/json",
            dataType: "json",
            data: payload
        }).then(function (response) {
            $scope.modelList = response.data;
            if ($scope.modelList.length > 0)
                $scope.FlexiBenefitModel = $scope.modelList[0]; 
        }, function () {
            alert("Error Occur");
        })
    };
 

    $scope.LoadFlexiDetails = function () {

        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/FlexiService/LoadFlexiBeneData"

        }).then(function (response) {
            $scope.modelList = response.data;
            $scope.flexiBeneList = $scope.modelList.flexiBeneList;
            $scope.flexiBeneNameList = $scope.modelList.flexiBeneNameList;

        }, function () {
            alert("Error Occur");
        })
    };


    $scope.LoadFlexiBeneSummary = function () {

        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/FlexiService/LoadFlexiBeneSummary"

        }).then(function (response) {
            $scope.modelList = response.data;




        }, function () {
            alert("Error Occur");
        })
    };

    // pagination controls 



    $scope.DownloadExcel = function (modelList) {
        const headers = Object.keys(modelList[0]).join(",") + "\n";
        const rows = modelList.map(obj => Object.values(obj).join(",")).join("\n");

        const csvData = headers + rows;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        saveAs(blob, "Benefit_Declaration_Report.csv");

    };

}]);



 