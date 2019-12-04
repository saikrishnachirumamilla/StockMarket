
String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};


function getCartItems(){
	var increase = "increase";
	$.ajax({
          url: "cart.php",
          type: "POST",
          data: { "get_cart_items":sessionStorage.getItem('userid')
                },
          success: function(result){

          	$('#cartTable tbody').empty();

          	var cartData = JSON.parse(result);

          	if(cartData.length > 0){
          		$('#emptyCart').hide();
          		$('#cartTable').show();
          		for (var i = 0; i < cartData.length; i++) {
	          		$('#cartTable tbody').append('<tr><th scope="row"><div class="p-2"><div class="ml-3 d-inline-block align-middle"><h5 class="mb-0">'+'<div id="cStockId'+i+'" hidden = "true">'+cartData[i]["stockid"]+'</div><div id="cStockName'+i+'">'+cartData[i]["stockname"].toLowerCase().capitalize()+'</div></h5><span class="text-muted font-weight-normal font-italic d-block">Category: '+cartData[i]["category"].toLowerCase().capitalize()+'</span></div></div><td class="align-middle"><strong>$'+'<span id="cStockPrice'+i+'">'+cartData[i]["price"]+'</span></strong></td><td class="align-middle"><strong><a href="#" onclick = "updateCartItems(\'decrease\''+','+i+','+cartData[i]["stockid"]+');"class="text-dark"><i class="fa fa-minus-circle fa-lg" style="color:#007bff;"></i></a>&nbsp;&nbsp;'+'<span id="cStockQuantity'+i+'">'+cartData[i]["quantity"]+'</span>&nbsp;&nbsp;<a href="#" onclick = "updateCartItems(\'increase\''+','+i+','+cartData[i]["stockid"]+');"class="text-dark"><i class="fa fa-plus-circle fa-lg" style="color:#007bff;"></i></a></strong></td><td class="align-middle"><a href="#" onclick = "updateCartItems(\'remove\''+','+i+','+cartData[i]["stockid"]+');" class="text-dark"><i class="fa fa-trash" style="color:#FF5733;"></i></a></td></tr>');	
	          	}

	          	let stockPrice = cartData.map(a => a.price);
	          	let stockQuantity = cartData.map(a => a.quantity);

	          	var sPrice=stockPrice.map(Number);
	          	var sQuantity=stockQuantity.map(Number);

	          	var subTotal = sPrice.reduce((sum, val, i) => sum + (val * sQuantity[i]), 0);

	          	var tax = (subTotal / 100) * 8;

	          	var handlingCharges = 10;

	          	var cartTotal = subTotal+tax+handlingCharges;

	          	$('#cartSubtotal').html('$'+subTotal.toFixed(2));
	          	$('#cartHandling').html('$'+handlingCharges.toFixed(2));
	          	$('#cartTax').html('$'+tax.toFixed(2));
	          	$('#cartTotal').html('$'+cartTotal.toFixed(2));
	          }else{
	          	$('#emptyCart').show();
	          	$('#cartTable').hide();
	          	$('#cartSubtotal').html('$0.00');
	          	$('#cartHandling').html('$0.00');
	          	$('#cartTax').html('$0.00');
	          	$('#cartTotal').html('$0.00');
	          }
          	
          	


          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("Cart retreival failed.")
          }
         });
}


function updateCartItems(operation, index, stockId){

	if(operation === 'increase'){
		var quantity = $('#cStockQuantity'+index).html();
		$('#cStockQuantity'+index).html(parseInt(quantity)+1);
		updateCartQuantity(stockId,parseInt(quantity)+1);
	}else if(operation === 'decrease'){
		var quantity = $('#cStockQuantity'+index).html();
		if(parseInt(quantity) == 0){
			return;
		}
		if(parseInt(quantity)-1 == 0){
			return;
		}
		$('#cStockQuantity'+index).html(parseInt(quantity)-1);
		updateCartQuantity(stockId,parseInt(quantity)-1);
	}else if(operation === 'remove'){
		$("#cartTable tbody tr").eq(index).remove();
		removeCartItems(stockId);

	}
	

}

function updateCartQuantity(stockId,quantity){
	$.ajax({
		url: "cart.php",
		type: "POST",
		data: { "update_cart_items":sessionStorage.getItem('userid'),
				"stockId":stockId,
				"quantity":quantity
		    },
		success: function(result){
			console.log(result);
			getCartItems();
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Cart update failed.")
		}
	});
}

function removeCartItems(stockId){
	$.ajax({
		url: "cart.php",
		type: "POST",
		data: { "delete_cart_items":sessionStorage.getItem('userid'),
				"stockId":stockId
		    },
		success: function(result){
			console.log(result);
			getCartItems();
			getCartCount();
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Cart update failed.")
		}
	});
}

function checkBalance(){
    var balance;
	$.ajax({
		url: "wallet.php",
		type: "POST",
		async: false,
		data: { "check_balance":sessionStorage.getItem('userid')
		    },
		success: function(result){
			console.log(result);
			if(result === ""){
				result ="0";
			}
			balance = JSON.parse(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Check Balance failed.")
		}
	});
	return balance.toFixed(2);
}

function makeTransaction(amount){
	var transactionId;
	$.ajax({
		url: "transactions.php",
		type: "POST",
		async: false,
		data: { "make_stock_transaction":sessionStorage.getItem('userid'),
				"amount":amount,
				"type":"debit"
		    },
		success: function(result){
			console.log("transactionId: "+ result);
			transactionId = JSON.parse(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Check Balance failed.")
		}
	});

	return transactionId;
}

function updateCartAfterTransaction(){
	$.ajax({
		url: "cart.php",
		type: "POST",
		async: false,
		data: { "update_cart_after_transaction":sessionStorage.getItem('userid')
		    },
		success: function(result){
			console.log(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Deletion of cart items after purchasing failed.")
		}
	});
}

function getCartCount(){
	$.ajax({
		url: "cart.php",
		type: "POST",
		async: false,
		data: { "get_cart_count":sessionStorage.getItem('userid')
		    },
		success: function(result){
			if(result === ""){
				result = 0;
			}
			$('#cartCount').html(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Check Balance failed.")
		}
	});
}

function checkWalletFields(amount, name, cnum, month, year, cvv){

	var flag = false;

	if(amount === ''){
		$('#wAmountError').html('Please enter the amount.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
	}else{
		if(!amount.match(/(\d+(\.\d+)?)/)){
		$('#wAmountError').html('Please enter valid amount.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;	
		}
	}

	if(name === ''){
		$('#wNameError').html('Please enter your name.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
	}else{
		if(!name.match(/^[a-zA-Z ]+$/)){
		$('#wNameError').html('Should contain only alphabets.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
		}
	}

	if(cnum === ''){
		$('#wNumError').html('Please enter your card number.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
	}else{
		if(!(cnum.match(/^\d{16}$/))){
		$('#wNumError').html('Should be a 16-digit number.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
		}
	}

	if(month === 'MM' && year === 'YYYY'){
		$('#wDateError').html('Please enter expiration date.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
	}

	if(cvv === ''){
		$('#wCVVError').html('Please enter CVV.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
	}else{
		if(!(cvv.match(/^\d{3}$/))){
		$('#wCVVError').html('Should be a 3-digit number.').css({"color":"#FF5733"}).fadeIn().fadeOut(3000);
		flag = true;
		}
	}
	return flag;
}

function update_analytics_after_transaction(transactionId,stockId,quantity,price){
	$.ajax({
		url: "analytics.php",
		type: "POST",
		async: false,
		data: { "update_analytics_after_transaction":sessionStorage.getItem('userid'),
				"transactionId":transactionId,
				"stockId":stockId,
				"quantity":quantity,
				"price":price
		    },
		success: function(result){
			console.log(result);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log("Check Balance failed.")
		}
	});
}

function insertToStocklist(userId,stockId,quantity){
	$.ajax({
          url: "mystocklist.php",
          type: "POST",
          data: { "insert_to_stocklist":userId,
          		  "stockId":stockId,
          		  "quantity":quantity
                },
          success: function(result){
          	console.log(result);
          }
        });
}

$(document).ready(function(){

	getCartCount();
	$('#walletAmount').html('$'+checkBalance());
	$('#nameUser').html(sessionStorage.getItem('fname').slice(1, -1).toLowerCase().capitalize()+" "+sessionStorage.getItem('lname').slice(1, -1).toLowerCase().capitalize());
   
    $("#addMoney").unbind().on('click', function() {

    	var amount = $("#wAmount").val();
    	var name = $("#wName").val();
    	var cnum = $("#wNum").val();
    	var month = $("#wMonth").val();
    	var year = $("#wYear").val();
    	var cvv = $("#wCVV").val();

    	if(!checkWalletFields(amount, name, cnum, month, year, cvv)){
    		$.ajax({
              url: "wallet.php",
              type: "POST",
              async: false,
              data: { "add_money":sessionStorage.getItem('userid'),
                      "amount" : amount
                    },
              success: function(result){
              	console.log(result);
              	$("#walletModal .close").click();
              	$('#walletAmount').html('$'+checkBalance());
              	$("#wAmount").val('');
              	$("#wName").val('');
              	$("#wNum").val('');
              	$("#wMonth").val('MM');
              	$("#wYear").val('YYYY');
              	$("#wCVV").val('');
              },
              error: function(jqXHR, textStatus, errorThrown) {
                console.log("Wallet add money failed.")
              }
            });

	    	var successOptions = {
	                autoHideDelay: 3000,
	                showAnimation: "slideDown",
	                hideAnimation: "slideUp",
	                hideDuration: 100,
	                arrowShow: false,
	                className: "success",
	                gap: 2

	            };

	        $.notify("Successfully added money to your account.\nYour updated balance - $"+checkBalance(), successOptions);
    	}



    });


    $("#cart").on('click', function() {
    	getCartItems();
    }); 

    $("#cartCheckout").unbind().on('click', function() {

    	var balance = checkBalance();
    	var cartTotal = parseFloat($('#cartTotal').html().match(/-?\d+\.?\d*/));
    	var cartErrorMessage;

    	if(balance >= cartTotal){
    		console.log("Sufficient Funds.")
    		var transactionId = makeTransaction(cartTotal);
    		cartErrorMessage = "Stocks successfully added to your account.";
    		className = "success";
    		$('#walletAmount').html('$'+checkBalance());
    		

    		var rowCount = $('#cartTable tbody tr').length;

    		for (var i = 0; i < rowCount; i++) {
    			var stockId = parseInt($('#cStockId'+i).html());
    			var quantity = parseInt($('#cStockQuantity'+i).html());
    			var price = parseFloat($('#cStockPrice'+i).html());
    			insertToStocklist(sessionStorage.getItem('userid'),stockId,quantity)
    			update_analytics_after_transaction(transactionId,stockId,quantity,price);
    		}

    		updateCartAfterTransaction();
    		getCartCount();

    	}else{
    		cartErrorMessage = "Insufficient Funds.";
    		className = "error";

    	}

    	$("#cartModal .close").click();

    	var successOptions = {
                autoHideDelay: 3000,
                showAnimation: "slideDown",
                hideAnimation: "slideUp",
                hideDuration: 100,
                arrowShow: false,
                className: className,
                gap: 2

            };

        $.notify(cartErrorMessage, successOptions);

    });

    $("#wallet").on('click', function() {
    	$('#modalBalance').html('$'+checkBalance());
    });

    $("#logout").unbind().on('click', function() {
    	sessionStorage.clear();
    	window.location.href = 'signin.html';
    });
    
    if(JSON.parse(sessionStorage.getItem("type")) === "admin"){
    	$(".admin").show();
    }else{
    	$(".admin").hide();
    }

});