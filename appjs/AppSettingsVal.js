var app = angular.module("AppSettingsApp", ['ui.bootstrap']);
 
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

app.controller("AppSettingsController", ['$scope', '$http', '$location', 'filterFilter', function ($scope, $http, $location, filterFilter) {
    //debugger;
    $scope.URL = "https://payroll.arimagnushr.com";
  //  $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
 

    $scope.SaveAppSettings = function (model) {
        // debugger;
        if (confirm("Confirm to Save app settings?")) {
            console.log("AppSettingsModel", AppSettingsModel);

            var AppSettingsModel = {
                
                attendenceCommNotification: model.attendenceCommNotification,
                attendenceDailyHours: model.attendenceDailyHours,
                attendenceGracePeriodAlert: model.attendenceGracePeriodAlert,
                attendenceLateRules: model.attendenceLateRules,
                attendenceLessHoursRules: model.attendenceLessHoursRules,
                attendenceMissedNotification: model.attendenceMissedNotification,
                leaveCarryForward: model.leaveCarryForward,
                payrollGenOptions: model.payrollGenOptions,
                taxDeclareCommNotification: model.taxDeclareCommNotification,
                taxDeclareGracePeriodAlert: model.taxDeclareGracePeriodAlert,
                taxDeclareMissedNotification: model.taxDeclareMissedNotification,
                taxRegimeDefaultOptions: model.taxRegimeDefaultOptions,
                timesheetCommNotification: model.timesheetCommNotification,
                timesheetDailyHours: model.timesheetDailyHours,
                timesheetGracePeriodAlert: model.timesheetGracePeriodAlert,
                timesheetMissedNotification: model.timesheetMissedNotification,
                DefaultWorkingDays: model.defaultWorkingDays
            }
            $http({

                method: "post",
                url: $scope.URL + "/AppSettings/SaveAppSettingsOption",   
                contentType: "application/json",
                dataType: "json",
                data: AppSettingsModel 
            }).then(function (response) {
                $scope.AppSettingsModel = response.data;
                $scope.msg = "Saved Successfully!!!"
            }, function () {
                alert("Error Occur");
            })
        }
    };
     

 

    $scope.LoadAppSettings = function () {

        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/AppSettings/LoadAppSettings"

        }).then(function (response) {
            $scope.modelAppSettingList = response.data;

            $scope.msg = "";

            if ($scope.modelAppSettingList.length > 0)
                $scope.AppSettingsModel = $scope.modelAppSettingList[0];

            console.log($scope.AppSettingsModel);

        }, function () {
            alert("Error Occur");
        })
    };
     
     
     

}]);



 