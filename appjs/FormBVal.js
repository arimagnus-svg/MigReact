var app = angular.module("TaxBApp", ['ui.bootstrap']);
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
                                targets: 0,
                                width: '72px'
                            } ,
                            {
                                // Target the actions column
                                targets: 8,
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
 

app.controller("TaxBController", ['$scope', '$http', 'filterFilter', function ($scope, $http, filterFilter) {
    //debugger;
    $scope.URL = "https://payroll.arimagnushr.com";
   // $scope.URL = "https://localhost:17177";
    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.$watch('file', function (newVal) {
        if (newVal)
            console.log(newVal);
    });

    $scope.SaveFormB = function (formBList, HousePropertyList, formBRentList, TaxSec80List, TaxSecVIAOtherList) {
        if (confirm("Confirm to Save Form-B declaration?")) {

            ///("Saving Form-B details");
            var FormBRequestModel = {
                formBList : formBList,
                formBRentList : formBRentList,
                HousePropertyList : HousePropertyList,
                TaxSec80List : TaxSec80List,
                TaxSecVIAOtherList : TaxSecVIAOtherList
            }

          //  console.log("FormBRequestModel", FormBRequestModel);

            $http({
                method: "post",
                url: $scope.URL + "/Formb/SaveFormBDetails",
                contentType: "application/json",
                dataType: "json",
                //data: { formBList: $scope.FormBListModel.formBList, formBRentList: $scope.FormBListModel.formBRentList, HousePropertyList: $scope.FormBListModel.HousePropertyList, TaxSec80List: $scope.FormBListModel.TaxSec80List, TaxSecVIAOtherList: $scope.FormBListModel.TaxSecVIAOtherList }
                data: FormBRequestModel

            }).then(function (response) {

                $scope.msg = "Form B details has been saved successfully!!!";
                alert("Form B details has been saved successfully!!!");
            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };

    $scope.UpdateFormB = function (formBList, HousePropertyList, formBRentList, TaxSec80List, TaxSecVIAOtherList) {
        if (confirm("Confirm to update Form-B declaration?")) {
           

            var FormBRequestModel = {
                formBList: formBList,
                formBRentList: formBRentList,
                HousePropertyList: HousePropertyList,
                TaxSec80List: TaxSec80List,
                TaxSecVIAOtherList: TaxSecVIAOtherList
            }

            $http({
                method: "post",
                url: $scope.URL + "/Formb/updateFormBDetails",
                contentType: "application/json",
                dataType: "json",
               // data: { formBList: $scope.FormBListModel.formBList, formBRentList: $scope.FormBListModel.formBRentList, HousePropertyList: $scope.FormBListModel.HousePropertyList, TaxSec80List: $scope.FormBListModel.TaxSec80List, TaxSecVIAOtherList: $scope.FormBListModel.TaxSecVIAOtherList }
                data: FormBRequestModel 

            }).then(function (response) {

                $scope.msg = "Form B details has been updated successfully!!!";
                alert("Form B details has been updated successfully!!!");
            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };


    $scope.UpdateFormBAppReg = function (formBList, HousePropertyList, formBRentList, TaxSec80List, TaxSecVIAOtherList,AppRej) {
        if (confirm("Confirm to update Form-B data?")) {
            var FormBListModel = {
                formBList: formBList,
                formBRentList: formBRentList,
                HousePropertyList: HousePropertyList,
                TaxSec80List: TaxSec80List,
                TaxSecVIAOtherList: TaxSecVIAOtherList,
                Action: AppRej
            }
            console.log("formBList", formBList);
            $http({
                method: "post",
                url: $scope.URL + "/Formb/updateFormBAppRej",
                contentType: "application/json",
                dataType: "json",
                data: FormBListModel 
                //   data: { $scope.FormBListModel }

            }).then(function (response) {

                $scope.msg = "Form B details has been updated successfully!!!";
                alert("Form B details has been updated successfully!!!");
            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };

    $scope.ApproveRejectFormB = function (formBList , Action) {
        if (confirm("Confirm to update Form-B Investment?")) {

            console.log(formBList);

            var TaxFormBModel = {
                
                FinYear: formBList.finYear,
                EmployeeID: formBList.employeeID,
                Status: Action

            }
            $http({
                method: "post",
                url: $scope.URL + "/Formb/updateFormBStatus",
                contentType: "application/json",
                dataType: "json",
                data: TaxFormBModel
                //   data: { $scope.FormBListModel }

            }).then(function (response) {

                $scope.msg = "Form B status has been updated successfully!!!";
                alert("Form B status has been updated successfully!!!");
            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }
    };
     


    $scope.LoadFormBdetails = function (empid, finyear) {

        var FormBListModel = {
            EmployeeID: empid,
            year: finyear
        }

        $http({
            method: "post",
            url: $scope.URL + "/Formb/LoadFormBdetails",
            contentType: "application/json",
            dataType: "json",
            data: FormBListModel

        }).then(function (response) {
            $scope.FormBListModel = response.data;
            $scope.formBList = $scope.FormBListModel.formBList;
            $scope.formBRentList = $scope.FormBListModel.formBRentList;
            $scope.HousePropertyList = $scope.FormBListModel.housePropertyList;
            $scope.TaxSec80List = $scope.FormBListModel.taxSec80List;
            $scope.TaxSecVIAOtherList = $scope.FormBListModel.taxSecVIAOtherList;
            $scope.FormBListModel.EmployeeID = $scope.FormBListModel.employeeID;
            $scope.employeeList = $scope.FormBListModel.employeeList;
            $scope.fileModelList = $scope.FormBListModel.fileModelList;
            $scope.Regime = $scope.FormBListModel.regime;

            if ($scope.formBList.length > 0)
                $scope.formBList = $scope.formBList[0];
            if ($scope.formBRentList.length > 0)
                $scope.formBRentList = $scope.formBRentList;

            if ($scope.TaxSec80List.length > 0)
                $scope.TaxSec80List = $scope.TaxSec80List[0];


        }, function () {
            alert("Error Occur");
        })
    };
    


    $scope.LoadFormBSubmitReport = function (empid, finyear) {

        var FormBListModel = {
            EmployeeID: empid,
            year: finyear
        }

        $http({
            method: "post",
            url: $scope.URL + "/Formb/LoadFormBdetails",
            contentType: "application/json",
            dataType: "json",
            data: FormBListModel

        }).then(function (response) {
            $scope.FormBListModel = response.data;
            $scope.formBList = $scope.FormBListModel.formBList;
            $scope.formBRentList = $scope.FormBListModel.formBRentList;
            $scope.HousePropertyList = $scope.FormBListModel.housePropertyList;
            $scope.TaxSec80List = $scope.FormBListModel.taxSec80List;
            $scope.TaxSecVIAOtherList = $scope.FormBListModel.taxSecVIAOtherList;
            $scope.FormBListModel.EmployeeID = $scope.FormBListModel.employeeID;
            $scope.employeeList = $scope.FormBListModel.employeeList;
            $scope.fileModelList = $scope.FormBListModel.fileModelList;
            $scope.taxProofList = $scope.FormBListModel.taxProofList;
            $scope.taxDocList = $scope.FormBListModel.taxDocList;
            $scope.Regime = $scope.FormBListModel.regime;

           // console.log($scope.FormBListModel);

            if ($scope.formBList.length > 0)
                $scope.formBList = $scope.formBList[0];
            if ($scope.formBRentList.length > 0)
                $scope.formBRentList = $scope.formBRentList;

            if ($scope.TaxSec80List.length > 0)
                $scope.TaxSec80List = $scope.TaxSec80List[0];


        }, function () {
            alert("Error Occur");
        })
    };


    $scope.LoadFormBSubmit = function (empid, finyear) {
        var FormBListModel = {
            EmployeeID: empid,
            year: finyear
        }
        $http({
            method: "post",
            url: $scope.URL + "/Formb/LoadFormBdetails",
            contentType: "application/json",
            dataType: "json",
            data: FormBListModel

        }).then(function (response) {
            $scope.FormBListModel = response.data;
            $scope.formBList = $scope.FormBListModel.formBList;
            $scope.formBRentList = $scope.FormBListModel.formBRentList;
            $scope.HousePropertyList = $scope.FormBListModel.housePropertyList;
            $scope.TaxSec80List = $scope.FormBListModel.taxSec80List;
            $scope.TaxSecVIAOtherList = $scope.FormBListModel.taxSecVIAOtherList;
            $scope.FormBListModel.EmployeeID = $scope.FormBListModel.employeeID;
            $scope.employeeList = $scope.FormBListModel.employeeList;
            $scope.fileModelList = $scope.FormBListModel.fileModelList;
            $scope.taxProofList = $scope.FormBListModel.taxProofList;
            $scope.taxDocList = $scope.FormBListModel.taxDocList;
            $scope.Regime = $scope.FormBListModel.regime;


            if ($scope.formBList.length > 0)
                $scope.formBList = $scope.formBList[0];
            if ($scope.formBRentList.length > 0)
                $scope.formBRentList = $scope.formBRentList;

            if ($scope.TaxSec80List.length > 0)
                $scope.TaxSec80List = $scope.TaxSec80List[0];


        }, function () {
            alert("Error Occur");
        })
    };
    $scope.LoadFormBSummary = function () {

         
        var FormBSummaryModel = {
            FinYear: new Date().getFullYear()
        }
        $http({
            method: "post",
            url: $scope.URL + "/Formb/LoadFormBSummary",
            contentType: "application/json",
            dataType: "json",
            data: FormBSummaryModel

        }).then(function (response) {
            $scope.formBSummaryModelList = response.data;
            $scope.formBSummaryList = $scope.formBSummaryModelList.formBSummaryList;
            $scope.Year = $scope.formBSummaryModelList.year;

        }, function () {
            alert("Error Occur");
        })
    };

    

    $scope.LoadFormBSubmitSummary = function () {

         
        var FormBSummaryModel = {
            FinYear:   new Date().getFullYear()
        }
        $http({
            method: "post",
            url: $scope.URL + "/Formb/LoadFormBSubmitSummary",
            contentType: "application/json",
            dataType: "json",
            data: FormBSummaryModel

        }).then(function (response) {
            $scope.formBSummaryModelList = response.data;
            $scope.formBSummaryList = $scope.formBSummaryModelList.formBSummaryList;
            $scope.Year = $scope.formBSummaryModelList.year;

        }, function () {
            alert("Error Occur");
        })
    };


    $scope.LoadFormBSubmitSummaryReport = function (yr) {

        console.log(yr);
        var temp_year = 0;
        if (yr == 0)
            temp_year= new Date().getFullYear();
        else
            temp_year = yr
        $scope.SelectedYear = temp_year

        console.log(temp_year);

        var FormBSummaryModel = {
            FinYear: temp_year
        }
        
        $http({
            method: "post",
            url: $scope.URL + "/Formb/LoadFormBSubmitSummaryReport",
            contentType: "application/json",
            dataType: "json",
            data: FormBSummaryModel

        }).then(function (response) {
            $scope.formBSummaryModelList = response.data;
            $scope.formBSummaryList = $scope.formBSummaryModelList.formBSummaryList;
            $scope.Years = $scope.formBSummaryModelList.years;


        }, function () {
            alert("Error Occur");
        })
    };

    $scope.uploadFile = function (txModel, str) {
       

        // var postData = JSON.stringify(txModel);
        if (file.length < 0) {
            alert("Please upload proof documents!!!");
            return;
        }
        var data1 = new FormData();
        for (i = 0; i < file.length; i++) {
            data1.append("FileItem", file[i].files[0]);
            data1.append("Year", $scope.formBList.finYear);
            data1.append("Files", file[i].files);
           
        } 
       // data1.append('TaxProofModel', TaxProofModel);
        data1.append('TaxSection', str);
         
        data1.append('PolicyRegister', txModel.policyRegister);
        data1.append('InvoiceOrBillNo', txModel.invoiceOrBillNo);
        data1.append('CompanyName', txModel.companyName);
        data1.append('PaymentDate', txModel.paymentDate);
        data1.append('PaymentAmount', txModel.paymentAmount);
        

       // console.log(data1);

       // data1.append("txModel", postData);
      //  alert(data1.get('txModel'));

        $http.post($scope.URL + "/Formb/UploadMyDoc", data1  ,
            {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined } // Browser sets multipart/form-data
            }).then(function (response) {

            
            $scope.modelStatus = response.data;
           alert("File has been uploaded successfully!!!");

        }, function () {
            $scope.msg = "Error has been occurred .Please try again!!!";
            alert("Error has been occurred .Please try again!!!");
        }) 

        
    };

    $scope.downlaodFile = function (taxDocModel2) {

        $http({
            url: $scope.URL + "/Formb/DownloadMyDoc",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            responseType: "blob",
            data:   taxDocModel2

        }).then(function (response) {
            $scope.TaxDocModel = response.data;

            var blob = new Blob([response.data], { type: "application/octet-stream" });
           // var objectUrl = URL.createObjectURL(blob);
          //  objectUrl.download = "a.doc";
           // window.open(objectUrl);
            var fileURL = window.URL.createObjectURL(blob);
            var seconds = new Date().getTime() / 1000;
            var fileName = taxDocModel2.filename;
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = fileURL;
            a.download = fileName;
            a.click();
 

 

        }, function () {
            $scope.msg = "Error has been occurred .Please try again!!!";
            alert("Error has been occurred .Please try again!!!");
        }) 
         

    };


    $scope.DeleteFile = function (taxDocModel2) {
        if (confirm("Confirm to Delete Form-B files?")) {

            $http({
                url: $scope.URL + "/Formb/DeleteMyDoc",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data:  taxDocModel2 

            }).then(function (response) {
                $scope.TaxDocModel = response.data;

                alert("File has been deleted successfully...");


            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                alert("Error has been occurred .Please try again!!!");
            })
        }


    };


    $scope.DownloadExcel = function (modelList,filename) {
        const headers = Object.keys(modelList[0]).join(",") + "\n";
        const rows = modelList.map(obj => Object.values(obj).join(",")).join("\n");

        const csvData = headers + rows;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        saveAs(blob, filename+"_Report.csv");

    };

    $scope.searchPerson = {};
    $scope.searchAddress = {};
    $scope.searchEmergency = {};
    $scope.searchDependent = {};
    $scope.searchPassport = {};


    $scope.resetFilters = function () {
        // needs to be a function or it won't trigger a $watch
        $scope.searchPerson = {};
        $scope.searchAddress = {}; 
        $scope.searchEmergency = {};
        $scope.searchDependent = {};
        $scope.searchPassport = {};
 
    };
    
    // pagination controls
    //Dependent
    $scope.currentPageDependent = 1;
    $scope.totalItemsDependent = 0;
    if ($scope.DependentList !== undefined) {
        $scope.totalItemsDependent = $scope.DependentList.length;
    }
    $scope.entryLimitDependent = 5; // items per page
    $scope.noOfPagesDependent = Math.ceil($scope.totalItemsDependent / $scope.entryLimitDependent);

       
    //Person
    $scope.currentPagePerson = 1;
    $scope.totalItemsPerson = 0;
    if ($scope.PersonList !== undefined) {
        $scope.totalItemsPerson = $scope.PersonList.length;
    }
    $scope.entryLimitPerson = 5; // items per page
    $scope.noOfPagesPerson = Math.ceil($scope.totalItemsPerson / $scope.entryLimitPerson);
    
    $scope.$watch('searchPerson', function (newVal, oldVal) {
        if ($scope.PersonList !== undefined) {
            $scope.filtered = filterFilter($scope.PersonList, newVal);
            $scope.totalItemsPerson = $scope.filtered.length;
        }
        else {
            $scope.totalItemsPerson = 0;
        }
        $scope.noOfPagesPerson = Math.ceil($scope.totalItemsPerson / $scope.entryLimitPerson);
        $scope.currentPagePerson = 1;

    }, true);
  
    
      

}]);


