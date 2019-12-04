<?php

session_start();

function get_cart_items($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT cartid,cart.stockid,quantity,stockname,open AS price,category FROM cart INNER JOIN stocklist on cart.stockid = stocklist.stockid where userid = '$user_id'";
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}	
}

function update_cart_items($user_id,$stock_id,$quantity){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "UPDATE cart SET quantity = '$quantity' WHERE userid = '$user_id' and stockid = '$stock_id';";
		$result = mysqli_query($con, $sql);
		mysqli_close($con);
		return "Successfully updated cart items quantity.";	
	}	
}

function delete_cart_items($user_id,$stock_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "DELETE FROM cart WHERE userid = '$user_id' and stockid = '$stock_id';";
		$result = mysqli_query($con, $sql);
		mysqli_close($con);
		return "Successfully deleted cart items.";	
	}	
}


function get_cart_count($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT userid,COUNT(*) FROM cart WHERE userid = '$user_id' GROUP BY userid;";
		$result = mysqli_query($con, $sql);
		$row = mysqli_fetch_row($result);
		$count = $row[1];
		return $count;	
	}
}

function update_cart_after_transaction($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "DELETE FROM cart WHERE userid = '$user_id';";
		$result = mysqli_query($con, $sql);
		mysqli_close($con);
		return "Cart items deleted after purchase.";	
	}	
}

if (isset($_POST['get_cart_items'])) {
    echo get_cart_items($_POST['get_cart_items']);
}elseif (isset($_POST['update_cart_items'])) {
    echo update_cart_items($_POST['update_cart_items'],$_POST['stockId'],$_POST['quantity']);
}elseif (isset($_POST['delete_cart_items'])) {
    echo delete_cart_items($_POST['delete_cart_items'],$_POST['stockId']);
}elseif (isset($_POST['get_cart_count'])) {
    echo get_cart_count($_POST['get_cart_count']);
}elseif (isset($_POST['update_cart_after_transaction'])) {
    echo update_cart_after_transaction($_POST['update_cart_after_transaction']);
}

?>