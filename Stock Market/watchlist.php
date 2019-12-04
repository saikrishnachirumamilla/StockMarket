<?php

session_start();

function get_stock_names($stock_name){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT stockname,stockid FROM stocklist WHERE stockname LIKE '%$stock_name%' LIMIT 5";
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}
}

function get_watchlist_count($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT userid,COUNT(*) FROM watchlist WHERE userid = '$user_id' GROUP BY userid;";
		$result = mysqli_query($con, $sql);
		$row = mysqli_fetch_row($result);
		$count = $row[1];
		return $count;		
	}
}

function add_to_watch_list($user_id,$stock_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "INSERT INTO watchlist (userid, stockid) VALUES ('$user_id','$stock_id');";
		$result = mysqli_query($con, $sql);
		return "Successfully added to the watchlist.";		
	}
}


function get_watch_list_stocks($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "SELECT stockname,stocklist.stockid FROM stocklist INNER JOIN watchlist on stocklist.stockid = watchlist.stockid where userid = '$user_id';";
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);			
	}
}

function remove_from_watch_list($user_id,$stock_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		
		$sql = "DELETE FROM watchlist WHERE userid = '$user_id' AND stockid = '$stock_id';";
		$result = mysqli_query($con, $sql);
		return "Successfully removed from the watchlist.";		
	}
}

if (isset($_POST['get_stock_names'])) {
    echo get_stock_names($_POST['get_stock_names']);
}elseif (isset($_POST['get_watchlist_count'])) {
    echo get_watchlist_count($_POST['get_watchlist_count']);
}elseif (isset($_POST['add_to_watch_list'])) {
    echo add_to_watch_list($_POST['add_to_watch_list'],$_POST['stockId']);
}elseif (isset($_POST['get_watch_list_stocks'])) {
    echo get_watch_list_stocks($_POST['get_watch_list_stocks']);
}elseif (isset($_POST['remove_from_watch_list'])) {
    echo remove_from_watch_list($_POST['remove_from_watch_list'],$_POST['stockId']);
}

?>