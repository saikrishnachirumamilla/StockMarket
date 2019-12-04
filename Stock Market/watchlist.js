String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

function addToWatchList(stockId){
	if(stockId === ""){
		var successOptions = {
            autoHideDelay: 3000,
            showAnimation: "slideDown",
            hideAnimation: "slideUp",
            hideDuration: 100,
            arrowShow: false,
            className: "warning",
            position : "bottom center",
            gap: 2

        };

        $("#barNav").notify("Please enter a value.", successOptions);
        return;
	}
	count = getWatchlistCount();
	if(count >= 3){
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

            $("#barNav").notify("Cannot add more than 3 stocks to the watchlist.", successOptions);
	}else{
		$.ajax({
			url: "watchlist.php",
			type: "POST",
			data: { "add_to_watch_list": sessionStorage.getItem('userid'),
					"stockId":stockId
			    },
			success: function(result){
				var successOptions = {
                autoHideDelay: 3000,
                showAnimation: "slideDown",
                hideAnimation: "slideUp",
                hideDuration: 100,
                arrowShow: false,
                className: "success",
                position : "bottom center",
                gap: 2

            };

           $("#barNav").notify(result, successOptions);
				getWatchListStocks();
			},
			error: function(jqXHR, textStatus, errorThrown) {
			console.log("Watch list stock items fetch failed.")
			}
		});
	}
}

function getWatchlistCount(){
	var count;
	$.ajax({
		url: "watchlist.php",
		type: "POST",
		async:false,
		data: { "get_watchlist_count": sessionStorage.getItem('userid')
		    },
		success: function(result){
			if(result === ""){
				count = 0;
			}else{
				count = parseInt(result);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Watch list stock items fetch failed.")
		}
	});
	return count;
}


function getWatchListStocks(){
	$.ajax({
		url: "watchlist.php",
		type: "POST",
		async:false,
		data: { "get_watch_list_stocks": sessionStorage.getItem('userid')
		    },
		success: function(result){
			plotWatchList(JSON.parse(result));
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Watch list stock items fetch failed.")
		}
	});
}

function plotWatchList(stocksList){
	$('#watchListRow').empty();
	$('#watchListRowDetails').empty();
	var counter = 0;
	var csvList = ["daily_GOOGL.csv","daily_MSFT.csv","daily_FB.csv"]
	for (var i = 0; i < stocksList.length; i++) {
	    watchPlot(stocksList, counter,csvList[counter]);
	    counter++;
	 }
	
}


function watchPlot (stocksList, counter, csvList){
	
	var watchListData;
	Papa.parse(csvList,{
	      header: true,
	      download: true,
	      dynamicTyping: true,
	      async : false,
	      complete: function(results) {

	        watchListData = results.data.slice(0,15);
	        $('#watchListRow').append('<div class="col-sm-4"><div class="card"><div class="card-body"><button type="button" class="close watchListClose" aria-label="Close"><span aria-hidden="true">&times;</span></button><h5 class="card-title">'+stocksList[counter]["stockname"].toLowerCase().capitalize()+'</h5><hr><div id="wStockID'+counter+'" hidden="true">'+stocksList[counter]["stockid"]+'</div><canvas id="watchList'+counter+'"></canvas></div></div></div>');
            var table = watchListStats(watchListData);
            $('#watchListRowDetails').append('<div class="col-sm-4" id="watchListDetailsId'+counter+'"><div class="card"><div class="card-body">'+table+'</div></div></div>');
            $('#watchListAddBarId').val('');
            var ctx = document.getElementById('watchList'+counter).getContext("2d")
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: watchListData.map(a => a.timestamp),
                    datasets: [{
                        label: "Data",
                        fill: 'origin',
                        borderColor: "#80b6f4",
                        pointBorderColor: "#80b6f4",
                        pointBackgroundColor: "#80b6f4",
                        pointHoverBackgroundColor: "#80b6f4",
                        pointHoverBorderColor: "#80b6f4",
                        pointBorderWidth: 10,
                        pointHoverRadius: 10,
                        pointHoverBorderWidth: 1,
                        pointRadius: 1,
                        fill: false,
                        borderWidth: 4,
                        data: watchListData.map(a => a.open)
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold",
                                maxTicksLimit: 5,
                                min : Math.floor(Math.min(...watchListData.map(a => a.open))),
                                max : Math.ceil(Math.max(...watchListData.map(a => a.open)))
                            },
                            gridLines: {
                                drawTicks: true,
                                display: false
                            }
            }],
                        xAxes: [{
                            gridLines: {
                                zeroLineColor: "transparent",
                                display : false
            },
                            ticks : {
                                display : false
                            }
                        }]
                    }
                }
            });

            //counter++;
	        
	      }

	    });
}

function watchListStats(stockData){

	console.log(stockData);
	var open = stockData[stockData.length-1]["open"];
	var low = stockData[stockData.length-1]["low"];
	var high = stockData[stockData.length-1]["high"];
	var volume = stockData[stockData.length-1]["volume"];
	var previousDayOpen = stockData[stockData.length-2]["open"];
	var percentage;
	var table;
	if(previousDayOpen > open){
		 percentage = ((previousDayOpen - open)/previousDayOpen)*100;
		 table = '<table class="table table-borderless" style="font-size:14px;margin-left:32px;"><tbody><tr><td class="text-left" style="color:#455a64;"><b>Open</b></td><td class="text-left" style="color: #4285F4;"><b>$ '+open+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>Low</b></td><td class="text-left" style="color: #DB4437;"><b>$ '+low+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>High</b></td><td class="text-left" style="color: #0F9D58;"><b>$ '+high+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>Volume</b></td><td class="text-left" style="color: #FF9900;"><b>'+volume+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>Change</b></td><td class="text-left" style="color: #A3AAAE;"><b>'+percentage.toFixed(2)+'</b>&nbsp;<i class="fas fa-arrow-down" style="color: #DB4437;"></i></td></tr></tbody></table>'

	}else{
		 percentage = ((open - previousDayOpen)/previousDayOpen)*100;
		 table = '<table class="table table-borderless" style="font-size:14px;margin-left:32px;"><tbody><tr><td class="text-left" style="color:#455a64;"><b>Open</b></td><td class="text-left" style="color: #4285F4;"><b>$ '+open+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>Low</b></td><td class="text-left" style="color: #DB4437"><b>$ '+low+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>High</b></td><td class="text-left" style="color: #0F9D58;"><b>$ '+high+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>Volume</b></td><td class="text-left" style="color: #FF9900;"><b>'+volume+'</b></td></tr><tr><td class="text-left" style="color:#455a64;"><b>Change</b></td><td class="text-left" style="color: #A3AAAE;"><b>'+percentage.toFixed(2)+'</b>&nbsp;<i class="fas fa-arrow-up" style="color: #0F9D58;"></i></td></tr></tbody></table>'

	}
	

	return table;
}

function removeFromWatchList(stockId){
	$.ajax({
		url: "watchlist.php",
		type: "POST",
		async:false,
		data: { "remove_from_watch_list": sessionStorage.getItem('userid'),
				"stockId":stockId
		    },
		success: function(result){
			console.log(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Watch list removal failed.")
		}
	});
}

$(document).ready(function(){ 

	getWatchListStocks();

	$("#watchListAddBarId").keyup(function() {
		var searchValue = $('#watchListAddBarId').val();
		if(searchValue === ""){
			document.getElementById("overlay").style.display = "none";
			return;
		}
		$.ajax({
			url: "watchlist.php",
			type: "POST",
			data: { "get_stock_names": searchValue
			    },
			success: function(result){
				var stocksData = JSON.parse(result);
				let stocks = stocksData.map(a => a.stockname);
				let stockIds = stocksData.map(a => a.stockid);
				$('#livesearch').empty();
				for (var i = 0; i < stocks.length; i++) {
					$('#livesearch').append('<li class="list-group-item" style="border-radius:23px;">'+stocks[i]+'<span hidden="true">'+stockIds[i]+'</span></li>');
				}
				document.getElementById("overlay").style.display = "block";

					
			},
			error: function(jqXHR, textStatus, errorThrown) {
			console.log("Watch list stock items fetch failed.")
			}
		});
	});

	$('#livesearch').on('click', 'li',function() {
		var stockName = $(this).html().toString();
		$('#watchListAddBarId').val(stockName.match(/.*(?=<span.*)/g)[0]);
		$('#watchListAddBarIdHidden').val(stockName.match(/(?<=.*"true">).*(?=<\/span.*)/g)[0]);
		document.getElementById("overlay").style.display = "none";
	});

	$('#watchListAddButton').on('click',function() {

		addToWatchList($('#watchListAddBarIdHidden').val());

	});

	$('#watchListRow').on('click','.watchListClose',function() {
	  var counter = $(this).siblings(".chartjs-render-monitor").attr('id').substr(-1);
	  $('#watchListDetailsId'+counter).remove();
	  removeFromWatchList($('#wStockID'+counter).html());
	  $(this).closest('.col-sm-4').remove();
	  
	});

});


$(document).ready(function () {
    $('#sidebarCollapse','#content').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
        $('img').toggle();
    
    });
});