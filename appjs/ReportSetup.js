var app = angular.module("ReportService", ['ui.bootstrap']);
 
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
                                targets: 10,
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
app.controller("ReportController", ['$scope', '$http',  'filterFilter', function ($scope, $http,  filterFilter) {
    //debugger;

    $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";

    $scope.RepType = ["All", "Approved", "Pending","Due Report"];

    $scope.$watch('file', function (newVal) {
        if (newVal)
            console.log(newVal);
    });

     


    $scope.LoadSettlementDetails = function (m,options) {

        console.log(m);
        console.log(options);
        if (m == 0)
            $scope.m = new Date().getFullYear();
        else
            $scope.m = m
        $scope.SelectedYear = $scope.m

        $scope.options = options

        var SettlementModel = {
            FinYear: $scope.m,
            ReportOptions: $scope.options 
        }
        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Report/LoadSettlementReport",
            contentType: "application/json",
            dataType: "json",
            data: SettlementModel

        }).then(function (response) {
            $scope.settlementListModel = response.data;

            $scope.settlementList = $scope.settlementListModel.settlementList;
            $scope.Years = $scope.settlementListModel.years; 


            $scope.SelectedMonth = m;

            


            //alert($scope.noOfPagesItem);

        }, function () {
            alert("Error Occur");
        })
    };



    $scope.SaveBeneData = function (FlexiBenefitModel) {
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
                data: { model: FlexiBenefitModel }
            }).then(function (response) {
                $scope.FlexiBenefitModel = response.data;
                $scope.msg = "Saved Successfully!!!";

            }, function () {
                alert("Error Occur");
            })
        }
    };


    $scope.DownloadExcel = function (modelList) {
        const headers = Object.keys(modelList[0]).join(",") + "\n";
        const rows = modelList.map(obj => Object.values(obj).join(",")).join("\n");

        const csvData = headers + rows;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        saveAs(blob, "Settlement_Report.csv");

    };

}]);



 