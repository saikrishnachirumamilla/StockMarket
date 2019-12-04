$(document).ready(function () {
    $('#sidebarCollapse','#content').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
        $('img').toggle();
    
    });
});

String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

$(document).ready(function () {
      
      // get transactions data
      $.ajax({
          url: "transactions.php",
          type: "POST",
          data: { "fetch_transactions":sessionStorage.getItem('userid')
                },
          success: function(result){

            var transactionsTableData = JSON.parse(result);

            if(transactionsTableData.length == 0){
              $('#tTableMsg').html('No results found.');
              $('#transactionsTable').hide();
              return;
            }
            
            for (var i = 0; i < transactionsTableData.length; i++) {
                  if(transactionsTableData[i]["type"].includes('credit')){
                    typeString = '<td><span class="badge badge-pill badge-success">'+transactionsTableData[i]["type"].toLowerCase().capitalize()+'</span></td>';
                  }else{
                    typeString = '<td><span class="badge badge-pill badge-danger">'+transactionsTableData[i]["type"].toLowerCase().capitalize();+'</span></td>';
                  }
                  $('#transactionsTable tbody').append('<tr><td>'+transactionsTableData[i]["transactionid"]+'</td><td>'+transactionsTableData[i]["date"]+'</td><td>'+transactionsTableData[i]["amount"]+'</td>'+typeString+'<td>'+transactionsTableData[i]["balance"]+'</td></tr>');
            }

            $('#transactionsTable').DataTable({
              "ordering" : false,
              "destroy" : true
            });
            $('.dataTables_length').addClass('bs-select');

          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("Transactions Table Retreival Failed.")
          }
         });


      $("#filterTransactions").unbind().on('click', function() {

          var startDate = $('#transactionStartDate').val();
          var endDate = $('#transactionEndDate').val();
          var className;
          var dateErrorMsg;

          // if(endDate === "" && startDate === ""){
          //   dateErrorMsg = "Both start date and end date cannot be empty.";
          //   className = "error";
          // }else 
          if(endDate > new Date().toISOString().slice(0, 10)){
            dateErrorMsg = "End Date cannot be greater than Today's Date.";
            className = "error";
          }else if(endDate < startDate){
            if(endDate !== ""){
              dateErrorMsg = "Start Date cannot be greater than End Date.";
              className = "error";
            }
          }else{

            $.ajax({
              url: "transactions.php",
              type: "POST",
              data: { "fetch_transactions_btwn_dates":sessionStorage.getItem('userid'),
                      "startDate" : startDate,
                      "endDate" : endDate
                    },
              success: function(result){
                console.log(result);
                var transactionsTableData = JSON.parse(result);
                if(transactionsTableData.length == 0){
                  $('#tTableMsg').html('No results found.');
                  $('#transactionsTable_wrapper').hide();
                  $('#transactionsTable').hide();
                  $('#transactionsTable tbody').empty();
                  return;
                }
                $('#tTableMsg').html('');
                $('#transactionsTable tbody').empty();
                $('#transactionsTable').show();
                $('#transactionsTable_wrapper').show();
                for (var i = 0; i < transactionsTableData.length; i++) {
                      if(transactionsTableData[i]["type"].includes('credit')){
                        typeString = '<td><span class="badge badge-pill badge-success">'+transactionsTableData[i]["type"].toLowerCase().capitalize()+'</span></td>';
                      }else{
                        typeString = '<td><span class="badge badge-pill badge-danger">'+transactionsTableData[i]["type"].toLowerCase().capitalize();+'</span></td>';
                      }
                      $('#transactionsTable tbody').append('<tr><td>'+transactionsTableData[i]["transactionid"]+'</td><td>'+transactionsTableData[i]["date"]+'</td><td>'+transactionsTableData[i]["amount"]+'</td>'+typeString+'<td>'+transactionsTableData[i]["balance"]+'</td></tr>');
                }

                $('#transactionsTable').DataTable({
                  "ordering" : false,
                  "destroy" : true

                }).draw( false );
                $('.dataTables_length').addClass('bs-select');

              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log("Transactions Table Retreival Failed.")
              }
             });

            dateErrorMsg = "Successfully retreived details."
            className = "success";

          }


            var successOptions = {
                autoHideDelay: 3000,
                showAnimation: "slideDown",
                hideAnimation: "slideUp",
                hideDuration: 100,
                arrowShow: false,
                className: className,
                position : "bottom center",
                gap: 2

            };

            $("#barNav").notify(dateErrorMsg, successOptions);
      }); 

});  