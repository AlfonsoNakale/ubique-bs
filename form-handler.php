<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for security
header("Content-Security-Policy: default-src 'self'");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Initialize response array
  $response = [
    'success' => false,
    'message' => '',
    'errors' => []
  ];

  // Determine form type
  $isDemoForm = isset($_POST['req-Name-2']);

  if ($isDemoForm) {
    // Demo form validation
    $name = htmlspecialchars(trim($_POST['req-Name-2']));
    $company = htmlspecialchars(trim($_POST['req-Company-Name-2']));
    $email = htmlspecialchars(trim($_POST['req-Email-2']));
    $users = htmlspecialchars(trim($_POST['Number-of-users-2']));
    $message = htmlspecialchars(trim($_POST['req-Message-2']));

    // Validate required fields
    if (empty($name)) {
      $response['errors'][] = 'Name is required.';
    }
    if (empty($company)) {
      $response['errors'][] = 'Company name is required.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $response['errors'][] = 'A valid email is required.';
    }

    $subject = 'New Demo Request';
    $body = "Demo Request Details:\n\n" .
      "Name: $name\n" .
      "Company: $company\n" .
      "Email: $email\n" .
      "Number of Users: $users\n" .
      "Additional Information:\n$message";
  } else {
    // Contact form validation
    $name = htmlspecialchars(trim($_POST['Name']));
    $email = htmlspecialchars(trim($_POST['Email']));
    $message = htmlspecialchars(trim($_POST['Message']));

    // Validate required fields
    if (empty($name)) {
      $response['errors'][] = 'Name is required.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $response['errors'][] = 'A valid email is required.';
    }
    if (empty($message)) {
      $response['errors'][] = 'Message is required.';
    }

    $subject = 'New Contact Form Submission';
    $body = "Contact Form Details:\n\n" .
      "Name: $name\n" .
      "Email: $email\n" .
      "Message:\n$message";
  }

  // If there are no validation errors, send email
  if (empty($response['errors'])) {
    $toEmail = 'sales@ubique-bs.com'; // Replace with your actual email
    $headers = [
      'From' => $email,
      'Reply-To' => $email,
      'X-Mailer' => 'PHP/' . phpversion(),
      'Content-Type' => 'text/plain; charset=utf-8'
    ];

    if (mail($toEmail, $subject, $body, $headers)) {
      $response['success'] = true;
      $response['message'] = 'Thank you for your submission!';
    } else {
      $response['message'] = 'Failed to send email. Please try again later.';
    }
  } else {
    $response['message'] = 'Please correct the following errors:';
  }

  // Send JSON response
  header('Content-Type: application/json');
  echo json_encode($response);
  exit;
}
