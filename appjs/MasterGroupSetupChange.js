var app = angular.module("MasterGroupSetupApp", ['ui.bootstrap',"dndLists"]);
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
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
app.controller("MasterGroupSetupController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;
     $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";
    $scope.msg = "";
    $scope.masterList = { };
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.masterGnList = {};
      

    $scope.models = {
        selected: null,
        lists: { "Available": [], "Selected": [] }
    };


    // Model to JSON for demo purpose
    $scope.$watch('models', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);


    $scope.SaveMasterGroupSetup = function (MasterGroupModel, models) {
         
        if (confirm("Confirm to save Master Group setup?")) {



            $scope.MasterGroupModel = MasterGroupModel;

            // $scope.MasterSetupListModel.EmployeeID = EmployeeID;
            $http({
                method: "post",
                url: $scope.URL + "/MasterSetup/SaveMasterGroupSetupDetails",
                contentType: "application/json",
                dataType: "json",
                data: { MasterGroupModel: $scope.MasterGroupModel, models: $scope.models.lists.Selected }

            }).then(function (response) {

                $scope.msg = "Master setup details has been saved successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
    

    $scope.EditMasterGroupSetup = function (ItemAction) {
        if (confirm("Confirm to save Master Group setup?")) {
            // debugger;
            $http({

                method: "post",
                url: $scope.URL + "/MasterSetup/EditMasterGroupSetupbyID",
                contentType: "application/json",
                dataType: "json",
                data: { GroupID: ItemAction }
            }).then(function (response) {
                $scope.masterGroupListModel = response.data;
                $scope.masterGroupList = $scope.masterGroupListModel.masterGroupList;

                $scope.userGroupConfigList = $scope.masterGroupListModel.userGroupConfigList;
                $scope.SectionList = "";
                $scope.SectionList = $scope.masterGroupList[0].sectionName.split(';');



                for (var i = 0; i < $scope.userGroupConfigList.length; ++i) {
                    if ($scope.SectionList.includes($scope.userGroupConfigList[i].groupNodeName)) {

                        $scope.models.lists.Selected.push({ 'label': $scope.userGroupConfigList[i].groupNodeName });
                    }
                    else {
                        $scope.models.lists.Available.push({ 'label': $scope.userGroupConfigList[i].groupNodeName });
                    }



                }
                $scope.MasterGroupModel = $scope.masterGroupList[0];

            }, function () {
                alert("Error Occur");
            })
        }
    };



      

    $scope.LoadMasterSetupData = function () {

        //debugger;
        $http({
            method: "post",
            url: $scope.URL + "/MasterSetup/LoadMasterSetupData"

        }).then(function (response) {
            $scope.masterGroupListModel = response.data;
            $scope.userGroupConfigList = $scope.masterGroupListModel.userGroupConfigList;
           // $scope.masterGenList = $scope.masterGroupListModel.masterSetupList.masterGenList;
          //  alert($scope.masterGroupListModel.length);
            
            for (var i = 0; i < $scope.userGroupConfigList.length; ++i) {
                $scope.models.lists.Available.push({ 'label': $scope.userGroupConfigList[i].groupNodeName });
            }

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
if ($scope.masterGroupListModel !== undefined) {
    $scope.totalItemsItem = $scope.masterGroupListModel.length;
}
$scope.entryLimitItem = 5; // items per page
$scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);



    $scope.$watch('searchItem', function (newVal, oldVal) {

    if ($scope.masterGroupListModel !== undefined) {
        $scope.filtered = filterFilter($scope.masterGroupListModel, newVal);
        $scope.totalItemsItem = $scope.filtered.length;
    }
    else {
        $scope.totalItemsItem = 0;
    }
    $scope.noOfPagesItem = Math.ceil($scope.totalItemsItem / $scope.entryLimitItem);
    $scope.currentPageItem = 1;

}, true);

}]);


