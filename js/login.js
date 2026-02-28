function checkInfo() {
  const email = document.getElementById("emailId").value.trim(); // Grab the email input value and remove extra spaces at the start and end
  const password = document.getElementById("password").value; // Grab the password input value

  if (!email) {
    alert("Please enter your email address."); // If email is empty after trimming, show an alert and stop submission
    return false; // Returning false prevents the form from submitting
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return false; // If password is too short, show an alert and stop submission
  }

  localStorage.setItem("user", email); // Save the email in localStorage so dashboard.html can read it later

  window.location.href = "dashboard.html"; // Manually navigate to the dashboard page

  return false; 
}
