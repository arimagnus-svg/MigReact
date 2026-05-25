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

app.directive("formatDate", function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, modelCtrl) {
            modelCtrl.$formatters.push(function (modelValue) {
                return new Date(modelValue);
            });
            // You might also need a $parser to convert the Date back to a string for your model/server
        }
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

 

app.controller("FlexiController", ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
    //debugger;

    $scope.URL = "https://payroll.arimagnushr.com";
  //  $scope.URL = "https://localhost:17177";
    $scope.msg = "";
    $scope.totalDate1 = "";
    $scope.editFlag = true;
    $scope.numberOnly = "(^[0-9]+$)";
    $scope.Action = "IND";
 
    $scope.$watch('file', function (newVal) {
        if (newVal)
            console.log(newVal);
    });

    $scope.SaveReimbursement = function (FlexiBenefitModel) {

        
        if (confirm("Confirm to Save the Reimbursement?")) {
          //  var postData = JSON.stringify(FlexiBenefitModel);

            var data1 = new FormData();

            if (file.files.length <= 0) {
                alert("Please upload the proof document(s)");
                return;

            }
            data1.append('BenefitName', FlexiBenefitModel.benefitName);
            data1.append('ProviderName', FlexiBenefitModel.providerName);
            data1.append('BillID', FlexiBenefitModel.billID);
            data1.append('BillDate', $filter('date')(FlexiBenefitModel.billDate, 'dd-MM-yyyy') );
            data1.append('BillAmount', FlexiBenefitModel.billAmount);
            data1.append('Comments', FlexiBenefitModel.comments);
            data1.append('ApprovedAmount', FlexiBenefitModel.approvedAmount);
            data1.append('BenefitProofID', FlexiBenefitModel.benefitProofID);
            data1.append('EmpID', FlexiBenefitModel.empID);
            // Append the file
           // data1.append('FileModelList', FlexiBenefitModel.fileItem);  
          //  data1.append('File', FlexiBenefitModel.fileItem); 
            
           
          //  data1.append("File", FlexiBenefitModel.fileItem);

            
            for (i = 0; i < file.files.length; i++) {
                data1.append("FileItem", file.files[i]);
                data1.append("Files", file.files[i]);
               // data1.append('file', file.files[i], file.files[i].name);

            }

           // data1.append("FlexiBenefitProofModel", FlexiBenefitModel);            
           
           
            console.log("payload files", data1);

            // debugger;
            $http.post($scope.URL + "/FlexiService/SaveReimbursement", data1, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined } // Browser sets multipart/form-data
            }).then(function (response) {
                $scope.FlexiBenefitModel = response.data;
                $scope.msg = "Reimbursement has been saved sucessfully...";

            }, function errorCallback(response) {

                //  alert("Error Occur");
                $scope.msg = "Error Occur .. Try again!!!";
                console.error('Upload failed', response);

            })
            /*
            $http({
                method: 'POST',
                url: $scope.URL + "/FlexiService/SaveReimbursement", // Your API endpoint
                headers: {
                    'Content-Type': 'multipart/form-data' ,// This ensures the browser sets the correct multipart/form-data with the boundary
                    Accept:  'application/json'
                },
                data: data1,
                transformRequest: angular.identity // 

            })
            */
               
        }
    };
    $scope.DeleteBeneData = function (FlexiBenefitModel) {
        

        if (confirm("Confirm to Delete the Reimbursement?")) {

            console.log("DeleteBeneData", FlexiBenefitModel);


            // debugger;
            $http({

                method: "post",
                url: $scope.URL + "/FlexiService/DeleteReimbursement",
                contentType: "application/json",
                
                data:  FlexiBenefitModel 
            }).then(function (response) {
                $scope.FlexiBenefitModel = response.data;
                $scope.msg = "Reimbursement has been deleted sucessfully...";
            }, function () {
                alert("Error Occur");
            })
        }
    };  

    $scope.LoadReimburseEdit = function (id,Ad) {
        $scope.Action = Ad;
       // alert(id);
        // debugger;

        var FlexiBenefitProofModel = { BenefitProofID: id, Action: Ad }; 

        $http({

            method: "post",
            url: $scope.URL + "/FlexiService/LoadReimburseEdit",
            contentType: "application/json",
            dataType: "json",
            data: FlexiBenefitProofModel
        }).then(function (response) {
            $scope.flexiList = response.data;
            if ($scope.flexiList.modelList.length > 0)
                $scope.FlexiBenefitProofModel = $scope.flexiList.modelList[0]; 

            $scope.taxDocList = $scope.flexiList.taxDocList;
            $scope.fileModelList = $scope.flexiList.fileModelList;

            console.log("LoadReimburseEdit", $scope.flexiList);
        }, function () {
            alert("Error Occur");
        })
    };
 

    $scope.LoadFlexiBeneData = function () {

        // debugger;
        $http({

            method: "get",
            url: $scope.URL + "/FlexiService/LoadFlexiBeneData"

        }).then(function (response) {
            $scope.modelList = response.data;
            $scope.flexiBeneNameList = $scope.modelList.flexiBeneNameList;
 
        }, function () {
            alert("Error Occur");
        })
    };


    $scope.LoadFlexiBeneProofSummary = function ( id) {
        $scope.Action = id;

        var RequestModel = { Action: id }; 

        // debugger;
        $http({

            method: "post",
            url: $scope.URL + "/FlexiService/LoadFlexiBeneProofSummary",
            contentType: "application/json",            
            data: RequestModel


        }).then(function (response) {
            $scope.modelList = response.data;
            $scope.Action = id;



        }, function () {
            alert("Error Occur");
        })
    };


    $scope.ApproveReimbursement = function (FlexiBenefitProofModel) {

        if (FlexiBenefitProofModel.approvedAmount == 0) {
            $scope.msg = "Please enter approval amount!!!";
            return;
        }
 
        if (confirm("Confirm to Approve the Reimbursement?")) {
            $http({
                url: $scope.URL + "/FlexiService/ApproveReimbursement",
                method: "POST",
                contentType: "application/json",                
                data: FlexiBenefitProofModel 

            }).then(function (response) {
                $scope.TaxDocModel = response.data;

                $scope.msg = "Reimbursement has been Approved sucessfully...";


            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                $scope.msg = "Error has been occurred .Please try again!!!"

            })
        }
    };


    $scope.RejectReimbursement = function (FlexiBenefitProofModel) {
        if (confirm("Confirm to Reject the Reimbursement?")) {

            $http({
                url: $scope.URL + "/FlexiService/RejectReimbursement",
                method: "POST",
                contentType: "application/json",                
                data:  FlexiBenefitProofModel 

            }).then(function (response) {
                $scope.TaxDocModel = response.data;

                $scope.msg = "Reimbursement has been Rejected sucessfully...";


            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                $scope.msg = "Error has been occurred .Please try again!!!"

            })
        }
    };

    $scope.DeleteReimbursement = function (FlexiBenefitProofModel) {
        if (confirm("Confirm to Delete the Reimbursement?")) {
            //console.log("DeleteReimbursement", FlexiBenefitProofModel);
            $http({
                url: $scope.URL + "/FlexiService/DeleteReimbursement",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data:  FlexiBenefitProofModel 

            }).then(function (response) {
                $scope.TaxDocModel = response.data;

                $scope.msg = "Reimbursement has been deleted sucessfully...";


            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";
                $scope.msg = "Error has been occurred .Please try again!!!"

            })
        }
    };

    $scope.downlaodFile = function (taxDocModel2) {
        //alert(taxDocModel2.FileID);


        $http({
            url: $scope.URL + "/FlexiService/DownloadMyDoc",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            responseType: "blob",
            data: { taxDocModel: taxDocModel2 }

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
        if (confirm("Confirm to Delete the file?")) {

            $http({
                url: $scope.URL + "/FlexiService/DeleteMyDoc",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: { taxDocModel: taxDocModel2 }

            }).then(function (response) {
                $scope.TaxDocModel = response.data;

                $scope.msg = "File has been deleted sucessfully...";


            }, function () {
                $scope.msg = "Error has been occurred .Please try again!!!";

                $scope.msg = "Error has been occurred .Please try again!!!"

            })
        }
    };

    $scope.DownloadExcel = function (modelList) {
        const headers = Object.keys(modelList[0]).join(",") + "\n";
        const rows = modelList.map(obj => Object.values(obj).join(",")).join("\n");

        const csvData = headers + rows;
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" }); 
        
        saveAs(blob, "Reimbursement_Report.csv");

    };

}]);



 