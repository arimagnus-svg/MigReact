var app = angular.module("MasterSetupApp", ['ui.bootstrap']);
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
app.controller("MasterSetupController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;
    $scope.URL = "https://payroll.arimagnushr.com";
    //$scope.URL = "https://localhost:17177";
    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";

    $scope.SaveMasterSetup = function (masterGenList, masterAgentList, masterTaxList) {

        console.log("masterGenList", masterGenList);
        console.log("masterAgentList", masterAgentList);
        console.log("masterTaxList", masterTaxList);

        if (confirm("Confirm to save Master setup?")) {

            var MasterSetupRequestModel = {
                masterGen : masterGenList,
                masterAgent : masterAgentList,
                masterTax : masterTaxList
            }
            $scope.masterGroupListModel.masterSetupList.masterGenList = masterGenList;
            $scope.masterGroupListModel.masterSetupList.masterAgentList = masterAgentList;
            $scope.masterGroupListModel.masterSetupList.masterTaxList = masterTaxList;
            // $scope.MasterSetupListModel.EmployeeID = EmployeeID;
          //  alert("a" + masterAgentList.OptionsID + "," + $scope.masterGroupListModel.masterSetupList.masterAgentList.OptionsID);
            $http({
                method: "post",
                url: $scope.URL + "/MasterSetup/SaveMasterSetupDetails",
                contentType: "application/json",
                dataType: "json",
                data: MasterSetupRequestModel 

            }).then(function (response) {

                $scope.msg = "Master setup details has been saved successfully!!!";

            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
    
    
    $scope.LoadMasterSetupDetails = function (ItemAction) {

        $scope.masterModel = ItemAction;

        var UserConfigModel = {
            ParamType: ItemAction
        }
       // debugger;
        $http({
           
            method: "post",
            url: $scope.URL + "/MasterSetup/LoadMasterSetupDetails",
            contentType: "application/json",
            dataType: "json",
            data: UserConfigModel


        }).then(function (response) {
            $scope.masterGroupListModel = response.data;
            $scope.masterGroupList = $scope.masterGroupListModel.masterGroupList;
            $scope.masterGenList = $scope.masterGroupListModel.masterSetupList.masterGenList;
            $scope.masterAgentList = $scope.masterGroupListModel.masterSetupList.masterAgentList; 
            $scope.masterTaxList = $scope.masterGroupListModel.masterSetupList.masterTaxList;
            $scope.userConfigList = $scope.masterGroupListModel.userConfigList;
            $scope.userDisplayList = $scope.masterGroupListModel.userDisplayList;
            $scope.compTypeList = $scope.masterGroupListModel.compTypeList;

            console.log($scope.masterGroupListModel);

            $scope.item = {
                "id": "2",
                "name": "ALL",
            };

            $scope.CategoryLst = [
                { id: '1', name: 'MD' },
                { id: '2', name: 'CRNA' },
                { id: '3', name: 'ALL' }];

            if ($scope.masterGenList.length > 0)
                $scope.masterGenList = $scope.masterGenList[0];

            if ($scope.masterAgentList.length > 0)
                $scope.masterAgentList = $scope.masterAgentList[0];

            if ($scope.masterTaxList.length > 0)
                $scope.masterTaxList = $scope.masterTaxList[0];
            
            if ($scope.userDisplayList.length > 0)
                $scope.userDisplayList = $scope.userDisplayList[0];


        }, function () {
            alert("Error Occur");
        })
    };
     

    $scope.LoadMasterGroupDetails = function (ItemAction) {
         $scope.masterGroupModel = ItemAction;
        var UserConfigModel = {
            ParamType: ItemAction
        }
         debugger;
        $http({

            method: "post",
            url: $scope.URL + "/MasterSetup/LoadMasterGroupDetails",
            contentType: "application/json",
            dataType: "json",
            data: UserConfigModel


        }).then(function (response) {
            $scope.masterGroupListModel = response.data; 

            $scope.masterGroupList = $scope.masterGroupListModel.masterGroupList; 
             
            $scope.userConfigList = $scope.masterGroupListModel.userConfigList;
            $scope.userDisplayList = $scope.masterGroupListModel.userDisplayList;

            console.log($scope.masterGroupListModel);
 

        }, function () {
            alert("Error Occur");
        })
    };


}]);


