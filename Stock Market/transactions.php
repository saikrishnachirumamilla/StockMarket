<?php

session_start();

function fetch_transactions($user_id){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		$sql = "Select * from transactions where userid = ".$user_id;
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}		

}

function fetch_transactions_btwn_dates($user_id, $start_date, $end_date){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		$sql = "Select * from transactions where (CASE WHEN '$start_date' = '' THEN 1 ELSE date >= '$start_date' END) AND (CASE WHEN '$end_date' = '' THEN 1 ELSE date <= '$end_date' END) and userid = '$user_id'";
		//echo $sql;
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}

}

function make_stock_transaction($user_id, $amount, $type){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT balance from transactions where userid = '$user_id' ORDER BY transactionid DESC LIMIT 1;";
		$result = mysqli_query($con, $sql);
		$row = mysqli_fetch_row($result);
		$previous_balance = $row[0];
		$current_balance = $previous_balance - $amount;
		$date = date("Y-m-d");

		$sql = "INSERT INTO transactions (userid,date,amount,type,balance) VALUES ('$user_id','$date','$amount','$type','$current_balance');";
		$result = mysqli_query($con, $sql);

		$transaction_id = mysqli_insert_id($con);
		mysqli_close($con);
		return $transaction_id;	
	}
}



if (isset($_POST['fetch_transactions'])) {
    echo fetch_transactions($_POST['fetch_transactions']);
}elseif (isset($_POST['fetch_transactions_btwn_dates'])) {
    echo fetch_transactions_btwn_dates($_POST['fetch_transactions_btwn_dates'],$_POST['startDate'],$_POST['endDate']);
}elseif (isset($_POST['make_stock_transaction'])) {
    echo make_stock_transaction($_POST['make_stock_transaction'],$_POST['amount'],$_POST['type']);
}

?>