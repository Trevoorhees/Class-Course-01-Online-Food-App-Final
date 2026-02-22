function checkInfo() {
  const email = document.getElementById("emailId").value.trim();
  const password = document.getElementById("password").value;

  if (!email) {
    alert("Please enter your email address.");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return false;
  }

  // We store the email in localStorage so dashboard.html can display it.
  localStorage.setItem("user", email);

  window.location.href = "dashboard.html";

  // Returning true allows the form to continue to dashboard.html
  return false;
}
