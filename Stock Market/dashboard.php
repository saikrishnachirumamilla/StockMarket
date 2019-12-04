<?php

session_start();

function allstockload(){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		$sql = "Select * from stocklist where deleted=false order by stockname;";
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}		

}

function insertNewStock($stockName,$stockCode,$open,$high,$low,$category,$volume){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		$sql = "INSERT INTO stocklist(stockname, stock_symbol, open, volume, high, low, category) VALUES('$stockName','$stockCode','$open','$volume','$high','$low','$category');";
		$result = mysqli_query($con, $sql);
		if($result)
		{
			echo "New Stock Insertion Success";
		}
		else
		{
			echo "New Stock Insertion Failed";
		}
		mysqli_close($con);	
	}		

}


// added below and isset
function buynewstock($stockid,$userid,$inputfield)
{
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}
	else
	{
		$sql_1="select * from cart where userid='$userid' and stockid=$stockid;";
		$result_1 = mysqli_query($con, $sql_1);

		if (mysqli_num_rows($result_1)>0)
		{
			$row = mysqli_fetch_assoc($result_1);
			$quantity=$row['quantity']+$inputfield;
			$sql="update cart set quantity='$quantity' where userid='$userid' and stockid=$stockid ;";
			$result = mysqli_query($con, $sql);
			if($result)
			{
				echo "cart update success";
			}
			else
			{
				echo "cart update failed";
			}

		}
		else
		{
			$sql="INSERT INTO cart(userid, stockid, quantity) VALUES('$userid','$stockid','$inputfield') ;";
			$result = mysqli_query($con, $sql);
			if($result)
			{
				echo "cart insert success";
			}
			else
			{
				echo "cart insert failed";
			}
		}
		mysqli_close($con);	
	}
}

function deleteStock($stock_id)
{
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}
	else
	{
		$sql="update stocklist set deleted=true where stockid='$stock_id';";
		$result = mysqli_query($con, $sql);
		if($result)
		{
			echo "Successfully deleted stock";
		}
		else
		{
			echo "Stock deletion did not happend";
		}
	}
}

function get_user_details($user_id){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		$sql = "SELECT firstname,lastname,type FROM userdata where userid = '$user_id';";
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}
}

function updateexsistingstock($stock_id,$open,$high,$low,$volume,$category){
	$con = mysqli_connect("localhost", "root", "root", "stockmarket",8889);
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}
	else
	{
		$sql="update stocklist set open='$open', high='$high',low='$low',volume='$volume',category='$category' where stockid='$stock_id';";
		$result = mysqli_query($con, $sql);
		if($result)
		{
			echo "stock update success";
		}
		else
		{
			echo "stock update fail";
		}
	}
	mysqli_close($con);
}


if (isset($_POST['allstockload'])) 
	{
    echo allstockload();
	}
elseif(isset($_POST['insertNewStock']))
	{
		echo insertNewStock($_POST['stockName'],$_POST['stockCode'],
			$_POST['open'],$_POST['high'],$_POST['low'],$_POST['category'],$_POST['volume']);
	}
	elseif(isset($_POST['buynewstock']))
	{
		echo buynewstock($_POST['stockid'],$_POST['userid'],
			$_POST['input_field']);
	}
	elseif(isset($_POST['deleteStock']))
	{
		echo deleteStock($_POST['deleteStock']);
	}
elseif(isset($_POST['get_user_details']))
	{
		echo get_user_details($_POST['get_user_details']);
	}elseif(isset($_POST['updateexsistingstock']))
	{
		echo updateexsistingstock($_POST['updateexsistingstock'],$_POST['updateopen'],
			$_POST['updatehigh'],$_POST['updatelow'],$_POST['updatevolume'],$_POST['updatecategory']);
	}

?>