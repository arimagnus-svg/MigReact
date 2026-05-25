var app = angular.module("MasterGroupSetupApp", ['ui.bootstrap']);
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

app.filter("commaBreak",

    function () {

        return function (value) {

            if (!value.length) return;

            return value.split(';');

        }

    });

app.controller("MasterGroupSetupController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;
     $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";

    $scope.SaveMasterGroupSetup = function (MasterGroupModel, masterGenList) {
         
        if (confirm("Confirm to save Master group setup?")) {

            $scope.MasterGroupModel = MasterGroupModel;

            // $scope.MasterSetupListModel.EmployeeID = EmployeeID;
            // alert("a" + MasterGroupModel.GroupName + "," + $scope.MasterGroupModel.GroupID);
            $http({
                method: "post",
                url: $scope.URL + "/MasterSetup/SaveMasterGroupSetupDetails",
                contentType: "application/json",
                dataType: "json",
                data: { MasterGroupModel: $scope.MasterGroupModel, MasterGenModel: $scope.masterGenList }

            }).then(function (response) {

                $scope.msg = "Master setup details has been saved successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
    

    $scope.EditMasterGroupSetup = function (ItemAction) {
        if (confirm("Confirm to save Master group setup?")) {

            // debugger;
            $http({

                method: "post",
                url: $scope.URL +"/MasterSetup/EditMasterGroupSetupbyID",
                contentType: "application/json",
                dataType: "json",
                data: { GroupID: ItemAction }
            }).then(function (response) {
                $scope.masterGroupListModel = response.data;

                if ($scope.masterGroupListModel !== undefined) {
                    $scope.MasterGroupModel = $scope.masterGroupListModel.masterGroupList[0];
                }


            }, function () {
                alert("Error Occur");
            })
        }
    };





    $scope.DeleteMasterGroupSetup = function (MasterGroupModel) {
        if (confirm("Confirm to Delete Master group setup?")) {

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
        }
    };
 
    

    $scope.LoadMasterGroupDetails = function () {
          
         //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/MasterSetup/LoadMasterGroupDetails"           


        }).then(function (response) {
            $scope.masterGroupListModel = response.data;

            $scope.masterGroupList = $scope.masterGroupListModel.masterGroupList;
           // alert($scope.masterGroupListModel.masterGroupList[0].GroupName);
            $scope.userConfigList = $scope.masterGroupListModel.userConfigList;
            $scope.userDisplayList = $scope.masterGroupListModel.userDisplayList;


            //Loading Pagination details
            $scope.currentPageItem = 1;
            $scope.totalItemsItem = 0;
            $scope.entryLimitItem = 5; // items per page
            if ($scope.masterGroupList !== undefined) {
                $scope.totalItemsItem = $scope.masterGroupList.length;
            }
            if ($scope.totalItemsItem > 5) {
                $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
            }
             

          //  alert($scope.masterGroupList.length);

        }, function () {
            alert("Error Occur");
        })
    };

 

    $scope.LoadMasterSetupData = function () {

        //debugger;
        $http({
            method: "post",
            url: $scope.URL + "/MasterSetup/LoadMasterSetupData"

        }).then(function (response) {
            $scope.masterGroupListModel = response.data;
           // $scope.GroupList = $scope.masterGroupListModel.GroupList;
            $scope.masterGenList = $scope.masterGroupListModel.masterSetupList.masterGenList;
            //alert($scope.masterGenList.length);
 

        }, function () {
            alert("Error Occur");
        })
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
    if ($scope.masterGroupList !== undefined) {
        $scope.totalItemsItem = $scope.masterGroupList.length;
}
$scope.entryLimitItem = 5; // items per page
$scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);



    $scope.$watch('searchItem', function (newVal, oldVal) {

        if ($scope.masterGroupList !== undefined) {
            $scope.filtered = filterFilter($scope.masterGroupList, newVal);
        $scope.totalItemsItem = $scope.filtered.length;
    }
    else {
        $scope.totalItemsItem = 0;
    }
    $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
    $scope.currentPageItem = 1;

}, true);

}]);


