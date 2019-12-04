<?php

session_start();

function add_money($user_id, $amount){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT balance from transactions where userid = '$user_id' ORDER BY transactionid DESC LIMIT 1;";
		$result = mysqli_query($con, $sql);
		$row = mysqli_fetch_row($result);
		$previous_balance = $row[0];
		$balance =  $amount + $previous_balance;
		$date = date("Y-m-d");

		$sql = "INSERT INTO transactions (userid,date,amount,type,balance) VALUES ('$user_id','$date','$amount','credit','$balance');";
		$result = mysqli_query($con, $sql);
		
		mysqli_close($con);
		return "Successfully added money.";	
	}	
}

function check_balance($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT balance from transactions where userid = '$user_id' ORDER BY transactionid DESC LIMIT 1;";
		$result = mysqli_query($con, $sql);
		$row = mysqli_fetch_row($result);
		$balance = $row[0];
		mysqli_close($con);
		return $balance;	
	}	
}

if (isset($_POST['add_money'])) {
    echo add_money($_POST['add_money'], $_POST['amount']);
}else if (isset($_POST['check_balance'])) {
    echo check_balance($_POST['check_balance']);
}

?>