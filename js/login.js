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

  localStorage.setItem("user", email);

  window.location.href = "dashboard.html";

  return false;
}
