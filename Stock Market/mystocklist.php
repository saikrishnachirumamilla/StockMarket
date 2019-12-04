<?php

session_start();

function mystockload($user_Id){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else{
		$sql = "Select stl.*,ms.* from stocklist stl,mystock ms where ms.stockid=stl.stockid and stl.stockid in (select stockid from mystock where userid='$user_Id');";
		//return $sql;
		$result = mysqli_query($con, $sql);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
		  $rows[] = $r;
		}
		mysqli_close($con);
		return json_encode($rows);	
	}		

}



function sellupdate($stock_id,$user_id,$sellcount){

	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
 		echo "Could not connect";
 		echo mysqli_error($con);
 	}
 	else{
 			$sql_1="select open from stocklist where stockid ='$stock_id';";
 		    $result_1 = mysqli_query($con, $sql_1);
 		    if($result_1)
 		    {
 		    	$row_1=mysqli_fetch_assoc($result_1);
 		    	$open=$row_1['open'];
 		    	$amount=$row_1['open']*$sellcount;
 		    	$sql_2="SELECT balance from transactions where userid = '$user_id' ORDER BY transactionid DESC LIMIT 1;";
 		    	$result_2 = mysqli_query($con, $sql_2);
 		    	if($result_2)
 		    	{
 		    		$row_2=mysqli_fetch_assoc($result_2);
 		    		$total_balance=$row_2['balance']+$amount;
 		    		$sql_3 = "insert into transactions(userid, date, amount, type, balance) values('$user_id',NOW(),'$amount','credit','$total_balance');";
 		    		$result_3 = mysqli_query($con, $sql_3);
 		    		if($result_3)
 		    		{
	 		    		$last_id =mysqli_insert_id($con);
	 		    		$sql_5="INSERT INTO analytics(userid, transactionid, stockid, quantity, price) VALUES ('$user_id','$last_id','$stock_id','$sellcount','$open'*-1);";
	 		    		$result_5 = mysqli_query($con, $sql_5);
	 		    		if($result_5)
	 		    		{
		 		    		$sql_6="select quantity from mystock where stockid ='$stock_id' and userid ='$user_id';";
		 		    		$result_6=mysqli_query($con, $sql_6);
		 		    		if($result_6)
		 		    		{
			 		    		$row_6=mysqli_fetch_assoc($result_6);
			 		    		if($row_6['quantity']==$sellcount)
			 		    		{
			 		    			$sql_7="delete from mystock where stockid ='$stock_id' and userid ='$user_id';";
			 		    			$result_7=mysqli_query($con, $sql_7);
			 		    			echo "successfully sold stock";
			 		    		}
			 		    		else if($row_6['quantity']>$sellcount)
			 		    		{
			 		    			$q = $row_6["quantity"];
			 		    			$sql_8="update mystock set quantity='$q'-'$sellcount' where stockid ='$stock_id' and userid ='$user_id';";
			 		    			$result_8=mysqli_query($con, $sql_8);
			 		    			echo "successfully sold stock";
			 		     		}
			 		     	}
			 		     	else
			 		     	{
			 		     		echo "result_6 failed";
			 		     	}
			 		     }
			 		    else
			 		    {
			 		     	echo "result_5 failed";
			 		    }
			 		}
			 		else
			 		{
			 			echo "result_3 failed";
			 		}
			 	}
			 	else
			 	{
			 		echo "result_2 failed";
			 	}
			}
			else
			{
				echo "result_2 failed";
			}
 		}
 }
// 		$sql_1="select open from stocklist where stockid='$stock_id';";
// 		$result_1 = mysqli_query($con, $sql_1);
// 		$amount=$result_1*$sellcount;
// 		$sql_2="SELECT balance FROM ( SELECT * FROM `transactions` ORDER BY date DESC ) t1 where userid='$user_id' GROUP BY userid;";
// 		$result_2 = mysqli_query($con, $sql_2);
// 		$balance=$result_2+$amount;
// 		$sql_3 = "insert into transactions(userid, date, amount, type, balance) values('$user_id',curdate(),'$amount','debit','$balance');";
// 		$result_3 = mysqli_query($con, $sql_3);
// 		$sql_4="select last_insert_id();";
// 		$result_4 = mysqli_query($con, $sql_4);
// 		$sql_5="INSERT INTO analytics(userid, transactionid, stockid, quantity, price) VALUES ('$user_id','$result4','$stock_id','$sellcount','$amount');";
// 		$result_5 = mysqli_query($con, $sql_5);
// 		$sql_6="select quantity from mystock where userid='$user_id' and stockid='$stock_id';";
// 		$result_6 = mysqli_query($con, $sql_6);
// 		if($quantity==$result6)
// 		{
// 			$sql_7="delete from mystock where userid='$user_id' and stockid='$stock_id';";
// 			$result_7 = mysqli_query($con, $sql_7);
// 			echo "success";
// 		}
// 		else if ($sellcount>$result6){
// 			$sql_8="update mystock set quantity=('$result6'-'$sellcount')where userid='$user_id' and stockid='$stock_id';";
// 			$result_8= mysqli_query($con, $sql_8);
// 			echo "failure";
// 		}
		
// 		mysqli_close($con);
		
// 	}		

// }

 function insert_to_stocklist($user_id,$stock_id,$quantity)
{
	$con = mysqli_connect("localhost", "root", "root", "stockmarket");
	if(!$con){
		echo "Could not connect";
		echo mysqli_error($con);
	}else
	{
		$sql_1="select * from mystock where userid='$user_id' and stockid='$stock_id';";
		echo $sql_1;
		$result_1 = mysqli_query($con, $sql_1);
		if (mysqli_num_rows($result_1)>0)
		{
			$row = mysqli_fetch_assoc($result_1);
			$quantity=$row['quantity']+$quantity;
			$sql="update mystock set quantity='$quantity' where userid='$user_id' and stockid='$stock_id';";
			$result = mysqli_query($con, $sql);
			if($result)
			{
				echo "mystock update success";
			}
			else
			{
				echo "mystock update failed";
			}
		}
		else
		{
			$sql="INSERT INTO mystock(userid, stockid, quantity) VALUES('$user_id','$stock_id','$quantity') ;";
			echo $sql;
			$result = mysqli_query($con, $sql);
			if($result)
			{
				echo "mystock insert success";
			}
			else
			{
				echo "mystock insert failed";
			}
		}
		mysqli_close($con);
	}
}



if (isset($_POST['mystockload'])) 
	{
    echo mystockload($_POST['userId']);
	}
	elseif(isset($_POST['sellupdate']))
	{
		echo sellupdate($_POST['sellupdate'],$_POST['userid'],
			$_POST['sellcount']);
	}elseif (isset($_POST['insert_to_stocklist'])) {
    echo insert_to_stocklist($_POST['insert_to_stocklist'],$_POST['stockId'],$_POST['quantity']);
}

?>