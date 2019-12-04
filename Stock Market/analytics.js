String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

function viewAnalyticsIndvTable(stockId, stockName){
    var net = $('#eye'+stockId).html();
    $.ajax({
        url: "analytics.php",
        type: "POST",
        async: false,
        data: { "get_individual_analytics_details":sessionStorage.getItem('userid'),
                "stockId" : stockId
            },
        success: function(result){
            $('#analyticsIndividualTable').DataTable().destroy();
            var analyticsIndividualTableData = JSON.parse(result);
            $('#analyticsIndividualTable tbody').empty();
            if(analyticsIndividualTableData.length == 0){
                $('#analyticsIndCard').attr("hidden",true);
            }
            
            for (var i = 0; i < analyticsIndividualTableData.length; i++) {

                if(analyticsIndividualTableData[i]["type"] == "credit"){
                    var action = "<span class='badge badge-pill badge-success'>Sold</span>";
                }else{
                    var action = "<span class='badge badge-pill badge-danger'>Bought</span>";
                }

             $('#analyticsIndividualTable tbody').append('<tr><td>'+(i+1)+'</td><td>'+analyticsIndividualTableData[i]["date"]+'</td><td>'+analyticsIndividualTableData[i]["quantity"]+'</td><td>'+Math.abs(parseFloat(analyticsIndividualTableData[i]["price"])).toFixed(2)+'</td><td>'+action+'</td></tr>');
            }

            $('#analyticsIndividualTable').DataTable({
                "ordering" : false,
                "destroy" : true
              });
            $('.dataTables_length').addClass('bs-select');

            if(net.startsWith('Profit')){
                $('#cTitle').html(stockName+"&nbsp;<span class='badge badge-pill badge-success'>"+net+"</span>");

            }else if(net.startsWith('Loss')){
                $('#cTitle').html(stockName+"&nbsp;<span class='badge badge-pill badge-danger'>"+net+"</span>");
            }else{
                $('#cTitle').html(stockName+"&nbsp;<span class='badge badge-pill badge-warning'>"+net+"</span>");
            }
            $('#analyticsIndCard').attr("hidden",false);

        },
        error: function(jqXHR, textStatus, errorThrown) {
        console.log("Analytics main table failed.")
        }
    });

};


$(document).ready(function () {
   //*************************************************************************************************************************************
   //Side Bar
   //*************************************************************************************************************************************

    $('#sidebarCollapse','#content').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
        $('img').toggle();
    
    });

   $.ajax({
        url: "analytics.php",
        type: "POST",
        data: { "get_analytics_details":sessionStorage.getItem('userid')
            },
        success: function(result){
            var analyticsTableData = JSON.parse(result);

            if(analyticsTableData.length == 0){
                $('#analyticsMsg').html('No results available.');
                $('#analyticsCard').hide();
                return;
            }
            $('#analyticsMsg').html('');
            $('#analyticsCard').show();
            for (var i = 0; i < analyticsTableData.length; i++) {

                    if(parseFloat(analyticsTableData[i]["price"]) < 0){
                        var investment = 0;
                    }else{
                       var investment = parseFloat(analyticsTableData[i]["price"]);
                    }
                     
                    var returns = parseFloat(analyticsTableData[i]["quantity"])*parseFloat(analyticsTableData[i]["open"]);
                    var net = returns.toFixed(2) - investment.toFixed(2);

                    if(net > 0){

                        eyeString = "</td><td><span class='badge badge-pill badge-success' id='eye"+analyticsTableData[i]["stockid"]+"'>"+ 'Profit - $ '+net.toFixed(2);
                    }else if(net < 0){
                        eyeString = "</td><td><span class='badge badge-pill badge-danger' id='eye"+analyticsTableData[i]["stockid"]+"'>"+'Loss - $ '+Math.abs(net).toFixed(2);
                    }else{
                        eyeString = "</td><td><span class='badge badge-pill badge-warning' id='eye"+analyticsTableData[i]["stockid"]+"'>"+'No Loss - No Profit';
                    }
             $('#analyticsTable tbody').append('<tr><td>'+(i+1)+'</td><td>'+analyticsTableData[i]["stockname"].toLowerCase().capitalize()+'</td><td>'+analyticsTableData[i]["quantity"]+'</td><td>'+analyticsTableData[i]["open"]+'</td><td>'+investment.toFixed(2)+'</td><td>'+returns.toFixed(2)+eyeString+'</span></td><td><button class="viewbtn" onclick="viewAnalyticsIndvTable('+analyticsTableData[i]["stockid"]+'\,\''+analyticsTableData[i]["stockname"].toLowerCase().capitalize()+'\');"><i class="fa fa-eye" style="color: #007bff;"></i></button></td></tr>');
            }

            $('#analyticsTable').DataTable({
                "ordering" : false
            });
            $('.dataTables_length').addClass('bs-select');

        },
        error: function(jqXHR, textStatus, errorThrown) {
        console.log("Analytics main table failed.")
        }
    });

   

   	

    });                    