var app = angular.module("ProfileSalaryApp", ['ui.bootstrap', "dndLists"]);
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
                                targets: 2,
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

    $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.searchID = 0;
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

      //  console.log('Move all  From:: ' + from + ' To:: ' + to);
 
        angular.forEach(from, function (item) {
            to.push(item);
        });
        from.length = 0;
    };

    $scope.selectedclients = [];
     
    /// Generate initial model
  //  for (var i = 1; i <= 3; ++i) {
   //     $scope.models.lists.A.push({ label: "Item A" + i });
   //     $scope.models.lists.B.push({ label: "Item B" + i });
  //  }

    // Model to JSON for demo purpose
    $scope.$watch('models', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    $scope.CalculateSalary = function (ProfileSalaryModel , models,searchID) {
         
        if (confirm("Confirm to Calculate Salary?")) {

            $scope.ProfileSalaryModel = ProfileSalaryModel;
            $scope.ProfileSalaryModel.employeeID = searchID;
            // $scope.MasterSetupListModel.EmployeeID = EmployeeID;
            
            $http({
                method: "post",
                url: $scope.URL + "/ProfileSalary/CalcSalaryforEmp",
                contentType: "application/json",
                dataType: "json",
                data: { prfSalaryModel: $scope.ProfileSalaryModel, models: $scope.models.lists.Selected }

            }).then(function (response) {

                $scope.ProfileSalaryModel = response.data;
                $scope.masterGroupList = $scope.ProfileSalaryModel.masterGroupList;
                $scope.profileSalaryComponentList = $scope.ProfileSalaryModel.profileSalaryComponentList;
                $scope.SelectedGroup = [];
                if ($scope.ProfileSalaryModel.selectedGroup.length > 0)
                    $scope.SelectedGroup = $scope.ProfileSalaryModel.selectedGroup.split(';');

                for (var i = 0; i < $scope.SelectedGroup.length; ++i) {
                    if ($scope.models.includes($scope.SelectedGroup[i])) {
                        $scope.models.lists.Selected.push({ 'label': $scope.SelectedGroup[i] });
                    }
                    else {
                        $scope.models.lists.Available.push({ 'label': $scope.SelectedGroup[i] });
                    }
                }



            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
    

    $scope.SaveSalary = function (ProfileSalaryModel, ProfileSalaryComponentModelList, ProfileSalaryComponentModel) {
         
        if (confirm("Confirm to Save Salary?")) {

            $scope.ProfileSalaryModel = ProfileSalaryModel;
            $scope.ProfileSalaryComponentModelList = [];
            $scope.ProfileSalaryComponentModel = ProfileSalaryComponentModel;


            //alert("a" + $scope.ProfileSalaryModel.SalaryProfileID);

            for (var i = 0; i < $scope.ProfileSalaryModel.profileSalaryComponentList.length; ++i) {
                var obj = $scope.ProfileSalaryModel.profileSalaryComponentList[i];
                for (var key in obj) {
                    var value = obj[key];
                    if (value != null && value != 0 && value.indexOf('object') < 0) {
                        $scope.ProfileSalaryComponentModelList.push(value);
                    }
                }
            }

            $http({
                method: "post",
                url: $scope.URL + "/ProfileSalary/SaveSalaryDetails",
                contentType: "application/json",
                dataType: "json",
                data: { prfSalaryModel: $scope.ProfileSalaryModel, profileSalaryComponentList2: $scope.ProfileSalaryComponentModelList }

            }).then(function (response) {

                $scope.msg = "Salary setup details has been saved successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
    

    $scope.EditProfileSalarySetup = function (ItemAction) {
        // debugger;


        if (confirm("Confirm to Edit Salary?")) {

            var payload = {
                SalaryProfileID: ItemAction 
            }
            $http({

                method: "post",
                url: $scope.URL + "/ProfileSalary/EditProfileSalarybyID",
                contentType: "application/json",
                dataType: "json",
                data: payload
            }).then(function (response) {
                $scope.ProfileSalaryModel = response.data;
                $scope.masterGroupList = $scope.ProfileSalaryModel.masterGroupList;
                $scope.SelectedGroup = $scope.ProfileSalaryModel.selectedGroup;
                $scope.searchID = $scope.ProfileSalaryModel.employeeID;
                $scope.employeeList = $scope.ProfileSalaryModel.employeeList;

                $scope.profileSalaryComponentList = $scope.ProfileSalaryModel.profileSalaryComponentList;
                $scope.SelectedGroup = "";
                if ($scope.ProfileSalaryModel.selectedGroup.length > 0)
                    $scope.SelectedGroup = $scope.ProfileSalaryModel.selectedGroup.split(';');

                for (var i = 0; i < $scope.masterGroupList.length; ++i) {

                    if ($scope.SelectedGroup.includes($scope.masterGroupList[i].groupName)) {
                        $scope.models.lists.Selected.push({ 'label': $scope.masterGroupList[i].groupName });
                    }
                    else {
                        $scope.models.lists.Available.push({ 'label': $scope.masterGroupList[i].groupName });
                    }

                }




            }, function () {
                alert("Error Occur");
            })
        }
    };





    $scope.DeleteMasterGroupSetup = function (MasterGroupModel) {

        $scope.MasterGroupModel = MasterGroupModel;

        $http({
            method: "post",
            url: $scope.URL + "/MasterSetup/DeleteMasterGroupSetup",
            contentType: "application/json",
            dataType: "json",
            data: { MasterGroupModel: $scope.MasterGroupModel }

        }).then(function (response) {
            var index = $scope.MasterGroupModel.indexOf($scope.MasterGroupModel);
            $scope.MasterGroupModel.splice(index, 1);

            $scope.msg = " User Config setup has been deleted successfully!!!";

        }, function () {
            $scope.msg = "Error has been occurred .Please try again!!!";
            alert("Error has been occurred .Please try again!!!");
        })
    };
 
    

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
            if ($scope.ProfileSalaryListModel !== undefined) {
                $scope.totalItemsItem = $scope.ProfileSalaryListModel.length;
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
            $scope.employeeList = $scope.ProfileSalaryModel.employeeList;
            $scope.masterGroupList = $scope.ProfileSalaryModel.masterGroupList; 
            for (var i = 0; i < $scope.masterGroupList.length; ++i) {
                $scope.models.lists.Available.push({ 'label': $scope.masterGroupList[i].groupName });
            }

        }, function () {
            alert("Error Occur");
        })
    };

    $scope.ProfileStopPayList = function () {
 
            var date = new Date();
            $scope.SelectedMonth = date.getDay() + "-" + (date.getMonth() + 1) + '-' + date.getFullYear();

            var ProfileSalaryModel = {
                EffectiveDate: $scope.SelectedMonth
            }
            $http({

                method: "post",
                url: $scope.URL + "/ProfileSalary/stopPaymentList",
                contentType: "application/json",
                dataType: "json",
                data: ProfileSalaryModel

            }).then(function (response) {
                $scope.profileSalaryModelList = response.data;
                $scope.profileSalaryList = $scope.profileSalaryModelList.profileSalaryList;
                $scope.Months = $scope.profileSalaryModelList.months;


                //Loading Pagination details
                $scope.currentPageItem = 1;
                $scope.totalItemsItem = 0;
                $scope.entryLimitItem = 10; // items per page
                if ($scope.profileSalaryList !== undefined) {
                    $scope.totalItemsItem = $scope.profileSalaryList.length;
                    $scope.noOfPagesItem = 1;
                }
                if ($scope.totalItemsItem > 10) {
                    $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
                }


            }, function () {
                alert("Error Occur");
            })
        
    };

    $scope.ProfileStopPay = function () {
        

            $http({

                method: "post",
                url: $scope.URL + "/ProfileSalary/loadProfileStopPay"


            }).then(function (response) {
                $scope.employeeData = response.data;
                $scope.employeeList = $scope.employeeData.employeeList;
                $scope.Months = $scope.employeeData.months;

                for (var i = 0; i < $scope.employeeList.length; ++i) {
                    $scope.models.lists.Available.push({ 'label': $scope.employeeList[i].employeeName });
                }

            }, function () {
                alert("Error Occur");
            })
        
    };



    $scope.stopPay = function (selectedclients, SelMonth) {

        if (confirm("Confirm to Save Stop Payment?")) {

            $scope.employees = selectedclients;

            if (SelMonth == undefined) {
                alert("Please enter effective date");
                return;
            }
            else if (SelMonth.length<1) {
                alert("Please enter effective date");
                return;
            }


            //alert("a" + $scope.employeeList.length);

            var EmployeeListModel = {
                employeeList: selectedclients,
                SelectedMonth: SelMonth
            }

            $http({
                method: "post",
                url: $scope.URL + "/ProfileSalary/saveStopPayment",
                contentType: "application/json",
                dataType: "json",
                data: EmployeeListModel

            }).then(function (response) {
                $scope.employeeList = $scope.employeeList;
                $scope.SelectedMonth = SelMonth;
                $scope.Months = $scope.employeeData.Months;

                $scope.msg = "Salary setup details has been saved successfully!!!";

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


