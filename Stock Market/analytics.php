<?php

session_start();


function update_analytics_after_transaction($user_id, $transaction_id, $stock_id, $quantity, $price){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "INSERT INTO analytics (quantity,userid,stockid,transactionid,price) VALUES ('$quantity','$user_id','$stock_id','$transaction_id','$price');";
		$result = mysqli_query($con, $sql);
		mysqli_close($con);
		return "Analytics data updated after purchase.";	
	}	
}


function get_analytics_details($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT oof.stockid, stockname, price, quantity, open from (Select foo.stockid, price, quantity from(SELECT stockid, sum(price*quantity) as price FROM analytics where userid = '$user_id' group by stockid) as foo inner join mystock on mystock.stockid = foo.stockid) as oof inner join stocklist on oof.stockid = stocklist.stockid";
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}	
}

function get_individual_analytics_details($user_id, $stock_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
		if(!$con){
			echo "Could not connect";
			echo mysqli_error($con);
		}else{
			
			$sql = "SELECT transactions.date, quantity,price,type from analytics inner join transactions on analytics.transactionid = transactions.transactionid where analytics.userid = '$user_id' and analytics.stockid = '$stock_id';";
			$result = mysqli_query($con, $sql);
			$rows = array();
			while($r = mysqli_fetch_assoc($result)) {
			  $rows[] = $r;
			}
			mysqli_close($con);
			return json_encode($rows);	
		}
}

if (isset($_POST['update_analytics_after_transaction'])) {
    echo update_analytics_after_transaction($_POST['update_analytics_after_transaction'],$_POST['transactionId'],$_POST['stockId'],$_POST['quantity'],$_POST['price']);
}else if (isset($_POST['get_analytics_details'])) {
    echo get_analytics_details($_POST['get_analytics_details']);
}else if (isset($_POST['get_individual_analytics_details'])) {
    echo get_individual_analytics_details($_POST['get_individual_analytics_details'], $_POST['stockId']);
}

?>
