var app = angular.module("HomeApp",['ui.bootstrap']);
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
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
  
 


app.controller("HomeController",['$scope','$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;

    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.SelectedMonth ;
   $scope.URL = "https://payroll.arimagnushr.com";
  //  $scope.URL = "https://localhost:17177";  
    

    $scope.LoadSummary = function () {

         // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/Auth/LoadSummary"

        }).then(function (response) {
            $scope.sumModel = response.data; 
            $scope.employeePayInvList = $scope.sumModel.employeePayInvList;
            $scope.employeReimburseList = $scope.sumModel.employeReimburseList;
            $scope.employeInvList = $scope.sumModel.employeInvList;
            $scope.SalarySummaryList = $scope.sumModel.salarySummaryList; 
            $scope.SalaryAggList = $scope.sumModel.salaryAggList; 

          //  console.log("home model", $scope.sumModel);

           if ($scope.employeInvList!=null && $scope.employeInvList.length > 0)
                $scope.employeInvList = $scope.employeInvList[0];
            
           // if ($scope.employeePayInvList !=null && $scope.employeePayInvList.length > 0)
            // $scope.employeePayInvList = $scope.employeePayInvList[0];

            if ($scope.SalarySummaryList!=null && $scope.SalarySummaryList.length > 0)
                $scope.SalarySummaryList = $scope.SalarySummaryList[0];
             


        }, function () {
            alert("Error Occur");
        })
    };

 

    $scope.Login = function (LoginViewModel) {

          

        //debugger;
        $http({

            method: "post",
            url: $scope.URL + "/Home/Login",
            contentType: "application/json",
            dataType: "json",
            data: { model: LoginViewModel }

        }).then(function (response) {
            $scope.model = response.data;
          
             

        }, function () {
            alert("Error Occur");
        })
    };
          
     

}]);


