var app = angular.module("SalaryProcessApp", ['ui.bootstrap']);
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

app.filter("commaBreak",

    function () {

        return function (value) {

            if (!value.length) return;

            return value.split(';');

        }

    });

app.controller("SalaryProcessController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;

    $scope.URL = "https://payroll.arimagnushr.com";
 //   $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.SelectedMonth ;


    $scope.TotalAmt = 0;
    $scope.CalculateSum = function (ProfileMonthlySalaryModel, EmployeeID) {

        if (EmployeeID == ProfileMonthlySalaryModel.employeeID) {


            if (ProfileMonthlySalaryModel.masterGroup == 'DETECTION') {
                $scope.TotalAmt -= (ProfileMonthlySalaryModel.totalValue);
            }
            else
                $scope.TotalAmt += (ProfileMonthlySalaryModel.totalValue);
        }
        else
            $scope.TotalAmt = 0;

    }

    $scope.ResetTotalAmt = function () {
        $scope.TotalAmt = 0;
    }
   

    $scope.LoadSalarySummary = function () {

        //var date = new Date();
        var today = new Date();
        var month = today.toLocaleString('default', { month: 'short' });
        var year = today.getFullYear();


        $scope.m = month + '-' + year;
        $scope.SelectedMonth = $scope.m;
        var ProfileSummarySalaryModel = {
            ProcessMonth: $scope.m
        }
      //  console.log("LoadSalarySummary", ProfileSummarySalaryModel)
        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/SalaryGenProcess/LoadSalarySummary",
             
            data: ProfileSummarySalaryModel

        }).then(function (response) {
            $scope.MonthlySalaryList = response.data;

            $scope.ProfileSalarySummaryList = $scope.MonthlySalaryList.profileSalarySummaryList;
            $scope.Months = $scope.MonthlySalaryList.months; 
            $scope.SelectedMonth = $scope.m;

            //Loading Pagination details
            $scope.currentPageItem = 1;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 5; // items per page
            if ($scope.SalaryModelList !== undefined) {
                $scope.totalItemsItem = $scope.SalaryModelList.length;
            }
            if ($scope.totalItemsItem > 5) {
                $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
            }


            //alert($scope.noOfPagesItem);

        }, function () {
            alert("Error Occur");
        })
    };

    $scope.LoadSalaryProcessSetup = function (m) {

        var today = new Date();
        if (m == 0) {

            var month = today.toLocaleString('default', { month: 'short' });
            var year = today.getFullYear();
            $scope.m = month + '-' + year;
        }
        else
            $scope.m =m
 

        $scope.SelectedMonth = $scope.m;
        var ProfileSummarySalaryModel = {
            ProcessMonth: $scope.m
        }

         //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/SalaryGenProcess/LoadSalaryProcessedDetails",
            contentType: "application/json",
            dataType: "json",
            data: ProfileSummarySalaryModel

        }).then(function (response) {
            $scope.MonthlySalaryList = response.data;

            $scope.ProfileMonthlySalaryList = $scope.MonthlySalaryList.profileMonthlySalaryList; 
            $scope.Months = $scope.MonthlySalaryList.months; 
            $scope.profileSalaryList = $scope.MonthlySalaryList.profileSalaryList; 
            $scope.ProfileSalarySummaryList = $scope.MonthlySalaryList.profileSalarySummaryList; 
            $scope.EmployeeList = $scope.MonthlySalaryList.employeeList; 

            
            $scope.SelectedMonth = m;

            //Loading Pagination details
            $scope.currentPageItem = 1;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 5; // items per page
            if ($scope.ProfileSalarySummaryList !== undefined) {
                $scope.totalItemsItem = $scope.ProfileSalarySummaryList.length;
            }
            if ($scope.totalItemsItem > 5) {
                $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
            }
             

            //alert($scope.noOfPagesItem);

        }, function () {
            alert("Error Occur");
        })
    };
 

    $scope.EditSalaryGenbyID = function (id,m) {

       // alert(id);
         
        var ProfileMonthlySalaryModel = {
            ProcessMonth: m,
            EmployeeID: id
        }

        console.log("EditSalaryGenbyID", ProfileMonthlySalaryModel)
            //debugger;1
            $http({

                method: "post",
                url: $scope.URL + "/SalaryGenProcess/EditSalaryGenbyID",
                contentType: "application/json",
                dataType: "json",
                data: ProfileMonthlySalaryModel

            }).then(function (response) {
                $scope.MonthlySalaryList = response.data;

                $scope.ProfileMonthlySalaryList = $scope.MonthlySalaryList.profileMonthlySalaryList;
                $scope.Months = $scope.MonthlySalaryList.months;
                $scope.profileSalaryList = $scope.MonthlySalaryList.profileSalaryList;
                if ($scope.profileSalaryList.length > 0)
                    $scope.ProfileSalaryModel = $scope.profileSalaryList[0];

                $scope.SelectedMonth = m;


            }, function () {
                alert("Error Occur");
            })
        
    };



    $scope.LoadSalarySummarybyMonth = function (m) {
        //alert(m);
        $scope.Months = m;
        $scope.SelectedMonth = m;

        var ProfileSummarySalaryModel = {
            ProcessMonth: $scope.Months
        }

        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/SalaryGenProcess/LoadSalarySummary",
            contentType: "application/json",
            dataType: "json",
            data: ProfileSummarySalaryModel

        }).then(function (response) {
            $scope.MonthlySalaryList = response.data;

            $scope.ProfileSalarySummaryList = $scope.MonthlySalaryList.profileSalarySummaryList;
            $scope.Months = $scope.MonthlySalaryList.months;
            $scope.SelectedMonth = m;


            //Loading Pagination details
            $scope.currentPageItem = 1;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 5; // items per page
            if ($scope.SalaryModelList !== undefined) {
                $scope.totalItemsItem = $scope.SalaryModelList.length;
            }
            if ($scope.totalItemsItem > 5) {
                $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
            }


            //alert($scope.noOfPagesItem);

        }, function () {
            alert("Error Occur");
        })
    }

    $scope.GeneratePayroll = function () {

        var ProfileSummarySalaryModel = {
            ProcessMonth: $scope.SelectedMonth
        }

        if (confirm("Confirm to Generate Salary?")) {

            $http({
                method: "post",
                url: $scope.URL + "/SalaryGenProcess/GeneratePayroll",
                contentType: "application/json",
                dataType: "json",
                data: ProfileSummarySalaryModel

            }).then(function (response) {

                $scope.ProfileSalaryModel = response.data;


                $scope.msg = "Salary has been genereted successfully!!!";


            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };


    $scope.LockUnlockPayroll = function (month1, option1) {
        if (confirm("Confirm to Lock/Unlock Salary?")) {

            $scope.month1 = month1;
            $scope.option1 = option1;

            var ProfileMonthlySalaryModel = {
                ProcessMonth: month1,
                PayrollStatus: option1
            } 

            $http({
                method: "post",
                url: $scope.URL + "/SalaryGenProcess/LockUnlockPayroll",
                contentType: "application/json",
                dataType: "json",
                data: ProfileMonthlySalaryModel

            }).then(function (response) {
                // var index = $scope.MasterGroupModel.indexOf($scope.MasterGroupModel);
                // $scope.MasterGroupModel.splice(index, 1);
                $scope.SelectedMonth = month1;
                $scope.msg = "Payroll lock/unlock has been updated successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };

    $scope.lockUnlockPayrollEmpView = function (month1, option1) {
        if (confirm("Confirm to Lock/Unlock Employee View?")) {

            $scope.month1 = month1;
            $scope.option1 = option1;
            var ProfileMonthlySalaryModel = {
                ProcessMonth: month1,
                EmpViewStatus: option1
            } 

            $http({
                method: "post",
                url: $scope.URL + "/SalaryGenProcess/lockUnlockPayrollEmpView",
                contentType: "application/json",
                dataType: "json",
                data: ProfileMonthlySalaryModel

            }).then(function (response) {
                // var index = $scope.MasterGroupModel.indexOf($scope.MasterGroupModel);
                // $scope.MasterGroupModel.splice(index, 1);
                $scope.SelectedMonth = month1;
                $scope.msg = "Employee view - lock/unlock has been updated successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };

    $scope.UpdateSalary = function (ProfileSalaryModel, ProfileMonthlySalaryList) {
        if (confirm("Confirm to Update Salary?")) {

            $scope.model = ProfileMonthlySalaryList;

            console.log("ProfileMonthlySalaryList:", ProfileMonthlySalaryList);
          //  console.log("ProfileMonthlySalaryList", ProfileMonthlySalaryList.length);

            //debugger;
            $http({

                method: "post",
                url: $scope.URL + "/SalaryGenProcess/SaveSalaryDetails",
                contentType: "application/json",
                dataType: "json",
                data: ProfileMonthlySalaryList

            }).then(function (response) {
                $scope.MonthlySalaryList = response.data;

                $scope.ProfileSalarySummaryList = $scope.MonthlySalaryList.profileSalarySummaryList;
                $scope.Months = $scope.MonthlySalaryList.months;
                $scope.SelectedMonth = $scope.m;

                $scope.msg = "Salary details has been updated successfully!!!";


                //alert($scope.noOfPagesItem);

            }, function () {
                alert("Error Occur");
            })
        }
    };


    $scope.RegenerateSalary = function (ProfileMonthlySalaryList) {
        if (confirm("Confirm to Regenerate Salary?")) {

            $scope.model = ProfileMonthlySalaryList;
            //debugger;
            $http({

                method: "post",
                url: $scope.URL + "/SalaryGenProcess/RegeneratePayroll",
                contentType: "application/json",
                dataType: "json",
                data:  ProfileMonthlySalaryList

            }).then(function (response) {
                $scope.MonthlySalaryList = response.data;

                $scope.ProfileSalarySummaryList = $scope.MonthlySalaryList.profileSalarySummaryList;
                $scope.Months = $scope.MonthlySalaryList.months;
                $scope.SelectedMonth = $scope.m;
                $scope.msg = "Salary has been genereted successfully!!!";




                //alert($scope.noOfPagesItem);

            }, function () {
                alert("Error Occur");
            })
        }
    };



    $scope.ShowPayrollData = function ( m) {

        // alert(id);
        var ProfileMonthlySalaryModel = {
            ProcessMonth: m,
            EmployeeID:0
        }
        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/SalaryGenProcess/ShowSalaryByID",
            contentType: "application/json",
            dataType: "json",
            data: ProfileMonthlySalaryModel

        }).then(function (response) {
            $scope.MonthlySalaryList = response.data;

            $scope.ProfileMonthlySalaryList = $scope.MonthlySalaryList.profileMonthlySalaryList;
            $scope.payrollValues = $scope.MonthlySalaryList.payrollValues;

            
            $scope.Months = $scope.MonthlySalaryList.months;
            $scope.profileSalaryList = $scope.MonthlySalaryList.profileSalaryList;
            $scope.empDetails = $scope.MonthlySalaryList.empDetails; 

            if ($scope.profileSalaryList.length > 0)
                $scope.ProfileSalaryModel = $scope.profileSalaryList[0];

            $scope.SelectedMonth = m;


        }, function () {
            alert("Error Occur");
        })
    };



    $scope.DownloadExcel = function (modelList) {
        const headers = Object.keys(modelList[0]).join(",") + "\n";
        const rows = modelList.map(obj => Object.values(obj).join(",")).join("\n");

        const csvData = headers + rows;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        saveAs(blob, "Salary_Report.csv");

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


