<?php
session_start();
$email = $_POST['email'];
$password = $_POST['password'];
$pswd=SHA1($password);

$servername = "localhost";
$user_name = "root";
$pass_word = "root";
$db = 'stockmarket';
$port = 8888;

// Create connection
$conn = mysqli_connect($servername, $user_name, $pass_word, $db, $port);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if($conn)
{
	function alert($msg) {
		echo "<script type='text/javascript'>alert('$msg');</script>";
	}
	$query = "SELECT userid FROM userdata WHERE username='$email' and password='$pswd'";
	$sql = "SELECT userid FROM userdata WHERE username='$email'";
    $query_run = mysqli_query($conn,$query);
    $result = mysqli_query($conn,$sql);
	if (mysqli_num_rows($result)!=0) 
	{   
		if (mysqli_num_rows($query_run)!=0) 
		{
	    	$row = mysqli_fetch_array($query_run);
	    	echo $row['userid'];
		}
		else{
			echo "Password is incorrect try again.";
			//header( 'refresh:0.5 ; URl= signin.html' ) ;
		}
	}
	else{
		echo "User is not registered with us. Signup to continue.";
		//header( 'refresh:0.5 ; URl= signup.html' ) ;
	}
}
mysqli_close(conn);
?>