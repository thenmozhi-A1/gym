<?php $name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$goals = $_POST['goals'];
$formcontent="Name: $uname \n Phone: $phone \n Email: $email  \n My Goals: $goals";
$recipient = "2002dineshmurugan@gmail.com";
$subject = "Contact Form";
$mailheader = "From: $email \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
echo"<script>alert('Thank you for visiting gym bro');window.top.location='index.html';</script>";
?>