String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};


function plotStock(stockId, stockName, stockSymbol, open, high, low, volume){
    $('#dStockName').html(stockName.toLowerCase().capitalize());
    $('#dStockOpen').html('$ '+parseFloat(open).toFixed(2));
    $('#dStockLow').html('$ '+parseFloat(low).toFixed(2));
    $('#dStockHigh').html('$ '+parseFloat(high).toFixed(2));
    $('#dStockVolume').html(volume);
    $('#dStockSymbol').html(stockSymbol.toUpperCase());

    plotGraph(stockName.toLowerCase().capitalize(),stockSymbol.toUpperCase().trim());
}


function plotGraph(stockName,stockSymbol){

    var open = [];
    var dates ; 
    var url = "https://www.alphavantage.co/query?function=TIME_SERIES_"+$('#frequency').val().toUpperCase()+"&symbol="+stockSymbol+"&apikey=ET1R1A331UMFJ7G3";
    console.log(url);
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(result){
            console.log(result);
            var key;
            if($('#frequency').val().toUpperCase() === "DAILY"){
                key =  "Time Series (Daily)";
            }else if($('#frequency').val().toUpperCase() === "WEEKLY"){
                key = "Weekly Time Series"; 
            }if($('#frequency').val().toUpperCase() === "MONTHLY"){
                key = "Monthly Time Series";
            }
            var data = result[key];
            dates = Object.keys(result[key]);
            for (v of Object.values(data))
                open.push(parseFloat(v["1. open"] ));
            var trace = {
              x: dates,
              y: open,
              mode: 'lines'
            };
         
        var data = [ trace];
        var layout = {autosize: false,height: 335, margin: {
                t: 40, //top margin
                l: 30, //left margin
                r: 20, //right margin
                b: 30 //bottom margin
                },xaxis: {showgrid: false}, yaxis: {showgrid: false},title:stockName+" - "+stockSymbol
            };
        Plotly.newPlot('stockPlotDiv', data,layout);
        }
    });     
}
        
$(document).ready(function () {
    $('#sidebarCollapse','#content').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
        $('#navbar').toggleClass('active');
        $('img').toggle();
        $('#sidebar ul li a').toggleClass('d-flex justify-content-between align-items-center');
    
    });
});
        
$(document).ready(function(){

    $("#webticker-update-example").webTicker(
    {
        height:'100px'
    });
});

function intialload(){
    var allstocks;

    $.ajax({
        url:'dashboard.php',
        dataType:'json',
        type:'post',
        data:{'allstockload':'allstockload'},
        success:function(result){
            console.log(result);
             
            allstocks=result;
            plotStock(allstocks[0]["stockid"], allstocks[0]["stockname"], allstocks[0]["stock_symbol"], allstocks[0]["open"], allstocks[0]["high"], allstocks[0]["low"], allstocks[0]["volume"]);
            $("#stocksearch").empty();
             $("#webticker-update-example").empty();
            for(var i=0;i<allstocks.length;i++)
            {
                if(allstocks[i]["volume"] === "0"){
                    var cartIcon = '<button type="button" class="btn btn-primary stocklistcart" data-dismiss="modal" onclick="stocklistupdate(this)" disabled><i class="fas fa-shopping-cart"></i></button>'
                }else{
                    var cartIcon = '<button type="button" class="btn btn-primary stocklistcart" data-dismiss="modal" data-stockvolume = "'+allstocks[i]["volume"]+'" onclick="stocklistupdate(this)"><i class="fas fa-shopping-cart"></i></button>'                   
                }
                if(JSON.parse(sessionStorage.getItem("type")) === "admin"){
                    $stockstring='<a disabled class="list-group-item d-flex justify-content-between align-items-center list-group-item-action" data-type='+allstocks[i]["category"].toLowerCase().capitalize()+'>'+allstocks[i]["stockname"].toLowerCase().capitalize() +'<span id="span"><button class="btn btn-link text-primary hidinglol" style="padding:0px !important;" data-toggle="modal" data-target="#update_'+allstocks[i]["stockid"]+'" data-stockid='+allstocks[i]["stockid"]+'><i class="fas fa-edit" style="color:#FE5732!important;"></i></button><button class="btn btn-link text-primary hidinglol" style="padding:0px !important;" data-stockid='+allstocks[i]["stockid"]+' onclick="deleteStock(this)"><i class="fas fa-trash" style="color:#FF5733!important;"></i></button><button class="btn btn-link text-primary hidinglol" style="padding:0px !important;" onclick="plotStock('+allstocks[i]["stockid"]+',\''+allstocks[i]["stockname"]+'\'\,\''+allstocks[i]["stock_symbol"]+'\'\,\''+allstocks[i]["open"]+'\'\,\''+allstocks[i]["high"]+'\'\,\''+allstocks[i]["low"]+'\'\,\''+allstocks[i]["volume"]+'\');"><i class="fas fa-chart-line" style="color:#3cba54!important;"></i></button><button class="btn btn-link text-primary hidinglol"  data-toggle="modal" data-target="#'+allstocks[i]["stockid"]+'" aria-expanded="false" style="padding:0px !important;"><i class="fas fa-shopping-cart" style="color:#007bff !important;"></i></button></span></a><div class="modal fade" id="'+allstocks[i]["stockid"]+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Add To Cart</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div class="table-responsive"> <table class="table"> <thead> <tr> <th scope="col" class="border-0 bg-light"> <div class="p-2 px-3 text-uppercase">Stock</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Price</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Quantity</div> </th> </tr> </thead> <tbody> <tr> <th scope="row" class="border-0"> <div class="p-2"> <div class="ml-3 d-inline-block align-middle"> <h5 class="mb-0">'+allstocks[i]["stockname"].toLowerCase().capitalize()+'</h5><span class="text-muted font-weight-normal font-italic d-block">Category: '+allstocks[i]["category"].toLowerCase().capitalize() +'</span> </div> </div> </th> <td class="border-0 align-middle"><strong>$'+allstocks[i]["open"].toLowerCase().capitalize()+'</strong></td> <td class="border-0 align-middle"><strong><input type="number" class="form-control align-middle stocklistinput" data-stockid="'+allstocks[i]["stockid"]+'" min="0" value="3" style="width: 35% !important;display: inline-block !important;"></input></strong></td> </tr> </tbody> </table> </div></div><div class="modal-footer">'+cartIcon+'</div></div></div></div><div class="modal fade" id="update_'+allstocks[i]["stockid"]+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered" role="document"> <div class="modal-content"> <div class="modal-header"> <h6 class="modal-title" id="exampleModalLongTitle">Update Stock Details</h6> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" style="font-size: 1rem;"> <form id="newstockform"> <div class="form-row"> <div class="form-group col-md-6"> <label for="inputEmail4">Stock Name</label> <input type="text" class="form-control" value="'+allstocks[i]["stockname"].toLowerCase().capitalize()+'" id="inputName" placeholder="Apple" disabled> </div> <div class="form-group col-md-6"> <label for="inputPassword4">Stock Code</label> <input type="text" class="form-control"  value="'+allstocks[i]["stock_symbol"].toLowerCase()+'" id="inputCode" placeholder="AAPL" disabled> </div> </div> <div class="form-row"> <div class="form-group col-md-4"> <label for="inputCity">Open</label> <input type="number" step="any" class="form-control updateopen" value="'+allstocks[i]["open"].toLowerCase().capitalize()+'" min="0" placeholder="$0.00"> </div> <div class="form-group col-md-4"> <label for="inputCity">High</label> <input type="number" step="any" class="form-control updatehigh" value="'+allstocks[i]["high"].toLowerCase().capitalize()+'" min="0" placeholder="$0.00"> </div> <div class="form-group col-md-4"> <label for="inputZip">Low</label> <input type="number" step="any" class="form-control updatelow" value="'+allstocks[i]["low"].toLowerCase().capitalize()+'" min="0"  placeholder="$0.00"> </div> </div> <div class="form-row"> <div class="form-group col-md-5"> <label for="inputCity">Volume</label> <input type="number" min="1" class="form-control updatevolume" value="'+allstocks[i]["volume"].toLowerCase().capitalize()+'"  placeholder="3537"> </div> <div class="form-group col-md-1">  </div> <div class="form-group col-md-6"> <label for="inputZip">Category</label> <input type="text" class="form-control updatecategory" value="'+allstocks[i]["category"].toLowerCase().capitalize()+'" placeholder="Technology"> </div> </div> </form> <div class="modal-footer"> <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> --> <button type="button" class="btn btn-primary"  data-dismiss="modal" data-stockid="'+allstocks[i]["stockid"]+'" onclick="updatestock(this)">Update</button> </div> </div> </div> </div> </div>';
                }else{
                    $stockstring='<a disabled class="list-group-item d-flex justify-content-between align-items-center list-group-item-action" data-type='+allstocks[i]["category"].toLowerCase().capitalize()+'>'+allstocks[i]["stockname"].toLowerCase().capitalize() +'<span id="span"><button class="btn btn-link text-primary hidinglol" style="padding:0px !important;" onclick="plotStock('+allstocks[i]["stockid"]+',\''+allstocks[i]["stockname"]+'\'\,\''+allstocks[i]["stock_symbol"]+'\'\,\''+allstocks[i]["open"]+'\'\,\''+allstocks[i]["high"]+'\'\,\''+allstocks[i]["low"]+'\'\,\''+allstocks[i]["volume"]+'\');"><i class="fas fa-chart-line" style="color:#3cba54!important;"></i></button><button class="btn btn-link text-primary hidinglol"  data-toggle="modal" data-target="#'+allstocks[i]["stockid"]+'" aria-expanded="false" style="padding:0px !important;"><i class="fas fa-shopping-cart" style="color:#007bff !important;"></i></button></span></a><div class="modal fade" id="'+allstocks[i]["stockid"]+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Add ToCart</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div class="table-responsive"> <table class="table"> <thead> <tr> <th scope="col" class="border-0 bg-light"> <div class="p-2 px-3 text-uppercase">Stock</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Price</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Quantity</div> </th> </tr> </thead> <tbody> <tr> <th scope="row" class="border-0"> <div class="p-2"> <div class="ml-3 d-inline-block align-middle"> <h5 class="mb-0">'+allstocks[i]["stockname"].toLowerCase().capitalize()+'</h5><span class="text-muted font-weight-normal font-italic d-block">Category: '+allstocks[i]["category"].toLowerCase().capitalize() +'</span> </div> </div> </th> <td class="border-0 align-middle"><strong>$'+allstocks[i]["open"].toLowerCase().capitalize()+'</strong></td> <td class="border-0 align-middle"><strong><input type="number" class="form-control align-middle stocklistinput"  data-stockid="'+allstocks[i]["stockid"]+'" value="3" min = "0"  style="width: 35% !important;display: inline-block !important;"></input></strong></td> </tr> </tbody> </table> </div></div><div class="modal-footer">'+cartIcon+'</div></div></div></div><div class="modal fade" id="update_'+allstocks[i]["stockid"]+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered" role="document"> <div class="modal-content"> <div class="modal-header"> <h6 class="modal-title" id="exampleModalLongTitle">Update Stock Details</h6> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" style="font-size: 1rem;"> <form id="newstockform"> <div class="form-row"> <div class="form-group col-md-6"> <label for="inputEmail4">Stock Name</label> <input type="text" class="form-control" value="'+allstocks[i]["stockname"].toLowerCase().capitalize()+'" id="inputName" placeholder="Apple"> </div> <div class="form-group col-md-6"> <label for="inputPassword4">Stock Code</label> <input type="text" class="form-control"  value="'+allstocks[i]["stock_symbol"].toLowerCase().capitalize()+'" id="inputCode" placeholder="AAPL"> </div> </div> <div class="form-row"> <div class="form-group col-md-4"> <label for="inputCity">Open</label> <input type="number" step="any" class="form-control"  value="'+allstocks[i]["open"].toLowerCase().capitalize()+'" id="inputOpen" placeholder="$0.00"> </div> <div class="form-group col-md-4"> <label for="inputCity">High</label> <input type="number" step="any" class="form-control" value="'+allstocks[i]["high"].toLowerCase().capitalize()+'" id="inputHigh" placeholder="$0.00"> </div> <div class="form-group col-md-4"> <label for="inputZip">Low</label> <input type="number" step="any" class="form-control" value="'+allstocks[i]["low"].toLowerCase().capitalize()+'" id="inputLow" placeholder="$0.00"> </div> </div> <div class="form-row"> <div class="form-group col-md-5"> <label for="inputCity">Volume</label> <input type="number" min="1" class="form-control" value="'+allstocks[i]["volume"].toLowerCase().capitalize()+'"  id="inputVolume" placeholder="3537"> </div> <div class="form-group col-md-1">  </div> <div class="form-group col-md-6"> <label for="inputZip">Category</label> <input type="text" class="form-control" value="'+allstocks[i]["category"].toLowerCase().capitalize()+'" id="inputCategory" placeholder="Technology"> </div> </div> </form> <div class="modal-footer"> <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> --> <button type="button" class="btn btn-primary"  data-dismiss="modal" onclick="updatestock(this)">Update</button> </div> </div> </div> </div> </div>';
                }
                $("#stocksearch").append($stockstring);
                $tickerString='<li class="cardscroll" ><div>'+allstocks[i]["stock_symbol"].toUpperCase()+'</div><div><span style="color: #4285F4;">Open</span>: $'+allstocks[i]["open"]+'</div><div><span style="color: #0F9D58;">High</span>: $'+allstocks[i]["high"]+'</div><div><span style="color: #DB4437">Low</span>: $'+allstocks[i]["low"]+'</div></li>';
                $("#webticker-update-example").append($tickerString);


            }
            $("#filtermenu").empty();
            
            {
             var category = allstocks.map(a => a.category).filter((v, i, a) => a.indexOf(v) === i).sort();
             console.log(category);
             for(var i=0;i<category.length;i++)
                {
                    $categorystring='<div class="dropdown-item form-check disabled filtercategory" style="margin-left:10px; "><input class="form-check-input filtercheck" type="checkbox" value='+category[i].toLowerCase().capitalize()+ ' id='+category[i].toLowerCase().capitalize()+'><label class="form-check-label" for='+category[i].toLowerCase().capitalize()+'>'+category[i].toLowerCase().capitalize()+'</label></div>';
                     $("#filtermenu").append($categorystring);
                }

            }
           


        }
    });

}

function filterSearch(category){
    //console.log($(this).val());
        //var category=$(this).val();
        var length_disp=0;
        var lenght_nondisp=0;
        var checkbox_length=0;
        var container = document.querySelector("#stocksearch");
        console.log(container);
        var categoryfilter=container.querySelectorAll("a[data-type="+category+"]");
        console.log(categoryfilter);
        checkbox_length=categoryfilter.length;
        var all=container.querySelectorAll("a");
        all.forEach(function(data)
        {
            if(data.style.display=='none')
                lenght_nondisp=lenght_nondisp+1;
            else
                length_disp=length_disp+1;
        });
        console.log(length_disp);
        console.log(lenght_nondisp);
        console.log(checkbox_length);
        var arrayofCheckboxes=document.getElementsByClassName('filtercheck');
        var checkedarray=[];
        for(var i=0; i<arrayofCheckboxes.length; i++)
        {
            if(arrayofCheckboxes[i].type=='checkbox' && arrayofCheckboxes[i].checked==true)
            checkedarray.push(arrayofCheckboxes[i].value);
        }
        if(checkedarray.length>0)
        {    
            all.forEach(function(data)
            {
                var search_element = document.getElementById("stockListBarId");
                var search_val=search_element.value.toUpperCase();
                var element_val=data.innerText;
                if ((element_val.toUpperCase().indexOf(search_val) > -1) && checkedarray.includes(data.getAttribute('data-type')))
                    data.style.setProperty('display','','important');
                else
                    data.style.setProperty('display','none','important');

            });
        }
        else
        {
            all.forEach(function(data)
            {
                var search_element = document.getElementById("stockListBarId");
                var search_val=search_element.value.toUpperCase();
                var element_val=data.innerText;
                if ((element_val.toUpperCase().indexOf(search_val) > -1))
                    data.style.setProperty('display','','important');
                else
                    data.style.setProperty('display','none','important');

            });
        }
}
        
function searchBar(){
    var container = document.querySelector("#stocksearch");
        var all=container.querySelectorAll("a");
        var search_element = document.getElementById("stockListBarId");
        var search_val=search_element.value.toUpperCase();
        var arrayofCheckboxes=document.getElementsByClassName('filtercheck');
        var checkedarray=[];
        for(var i=0; i<arrayofCheckboxes.length; i++)
        {
            if(arrayofCheckboxes[i].type=='checkbox' && arrayofCheckboxes[i].checked==true)
            checkedarray.push(arrayofCheckboxes[i].value);
        }
        all.forEach(function(data)
        {

                var element_val=data.innerText;
                if (element_val.toUpperCase().indexOf(search_val) <= -1) 
                {
                    data.style.setProperty('display','none','important');

                }
                else
                {   
                    if(checkedarray.includes(data.getAttribute('data-type')) || (checkedarray.length==0))
                    {
                        data.style.setProperty('display','','important');
                    }
                    else
                    {
                       data.style.setProperty('display','none','important'); 
                    }
                }

        });
}


function stocklistupdate(reference)
{
        $('.modal-body #cardupdatealert').remove();
        var dom=reference;
        var p_dom=dom.parentNode.parentNode;
        var input_field=p_dom.querySelector('.stocklistinput').value;
        // var buyingcount=document.getElementById('#stocklistinput').value;
        var user_id=sessionStorage.getItem('userid');
        var stock_id=p_dom.querySelector('.stocklistinput').getAttribute('data-stockid');
        var volume = dom.getAttribute('data-stockvolume');
        console.log(input_field);
        console.log(user_id);
        console.log(stock_id);
        console.log(volume);
        if(parseInt(input_field) > parseInt(volume)){
            var successOptions = {
            autoHideDelay: 3000,
            showAnimation: "slideDown",
            hideAnimation: "slideUp",
            hideDuration: 100,
            arrowShow: false,
            className: "error",
            position : "bottom center",
            gap: 2

        };

        $("#barNav").notify("Quantity cannot be greater than volume.", successOptions);
            return;
        }
        $.ajax({
            url:'dashboard.php',
            dataType:'text',
            type:'post',
            data:{'buynewstock':'buynewstock','stockid':stock_id,
            'userid':user_id,'input_field':input_field},
            success:function(result)
            {
                console.log(result);
               if(result=="cart update success" || result=="cart insert success") 
               {
                 var alertString='<div class="alert alert-primary" role="alert" id="cardupdatealert">'+result+'</div>';
                $('.modal-body').append(alertString);
                $('.modal-body #cardupdatealert').fadeOut(1000);
                $.getScript("navbar.js",function(){
                    getCartCount();
                });

               }
               else
               {
                var alertString='<div class="alert alert-primary" role="alert" id="cardupdatealert">'+result+'</div>';
                $('.modal-body').append(alertString);
                $('.modal-body #cardupdatealert').fadeOut(1000);
               }

            },
            error:function(error)
            {
                alert("failure");
            }

        });


}

function deleteStock(reference)
{
    //console.log("came here");
    var current=reference;
    var stock_id=current.getAttribute('data-stockid');
    console.log("stock_id for delete: "+stock_id);
    $.ajax({
            url:'dashboard.php',
            dataType:'text',
            type:'post',
            data:{'deleteStock':stock_id},
            success:function(result)
            {
                if(result=="Successfully deleted stock")
                {
                    console.log("stock_id for delete success: "+stock_id);
                    intialload();
                }
                else
                {
                    console.log("stock_id for delete failed: "+stock_id);
                }
            },
            error:function(error)
            {
                console.log("ajax error for delete"+error);
            }
        });

}

function updatestock(reference){

    var curr=reference;
    var p_dom=curr.parentNode.parentNode;
    var stockid=curr.getAttribute('data-stockid')
    var updateopen=p_dom.querySelector('.updateopen').value;
    var updatehigh=p_dom.querySelector('.updatehigh').value;
    var updatelow=p_dom.querySelector('.updatelow').value;
    var updatevolume=p_dom.querySelector('.updatevolume').value;
    var updatecategory=p_dom.querySelector('.updatecategory').value;
     $.ajax({
            url:'dashboard.php',
            dataType:'text',
            type:'post',
            data:{'updateexsistingstock':stockid,'updateopen':updateopen,
            'updatehigh':updatehigh,'updatelow':updatelow,'updatevolume':updatevolume,'updatecategory':updatecategory},
            success:function(result)
            {
                if(result=="stock update success")
                {
                    intialload();
                    console.log("stock_update_success");
                }
                else
                {
                    console.log("stock_update_failed");
                }
            }
        });

}

$(document).ready(function(){
    intialload();
   
    $('#filtermenu').on('change',':checkbox',function()
    {
        filterSearch($(this).val());
    });

    $('#stockListBarId').on('keyup',function()
    {
        searchBar();
    });

    $('#modalbutton').on('click',function(){
        $('#newstockalert').remove();
        $('#insertionalert').remove();
        var stockName=document.getElementById('inputName').value.toLowerCase();
        var stockCode=document.getElementById('inputCode').value.toLowerCase();
        var open=document.getElementById('inputOpen').value.toLowerCase();
        var high=document.getElementById('inputHigh').value.toLowerCase();
        var low=document.getElementById('inputLow').value.toLowerCase();
        var category=document.getElementById('inputCategory').value.toLowerCase();
        var volume=document.getElementById('inputVolume').value.toLowerCase();
        if(stockName==='' || stockCode==='' || open==='' || high==='' ||low===''||category===''|| volume==='')
        {
            var alertString='<div class="alert alert-primary" role="alert" id="newstockalert">Fields Cannot Be Null!!</div>';
            $('.modal-body').append(alertString);
            $('#newstockalert').fadeOut(1000);
        }
        else
        {   
            $.ajax({
            url:'dashboard.php',
            dataType:'text',
            type:'post',
            data:{'insertNewStock':'insertNewStock','stockName':stockName,
            'stockCode':stockCode,'open':open,'high':high,'low':low,'category':category,'volume':volume},
            success:function(result)
            {
            var alertString='<div class="alert alert-primary" role="alert" id="insertionalert">'+result+'</div>';
            $('#addstockmodalbody').append(alertString);
            $('#insertionalert').fadeOut(1000);
            if(result!='New Stock Insertion Failed')
            {
               intialload();
               //afterAddition() 
               document.getElementById("newstockform").reset();
            }
            },
            });


        }

        

    });


    $('#frequency').on('change', function() {
      plotGraph($('#dStockName').html(), $('#dStockSymbol').html());
    });
});