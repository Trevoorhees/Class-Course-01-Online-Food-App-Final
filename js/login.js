function checkInfo() {
  const email = document.getElementById("emailId").value;
  const password = document.getElementById("password").value;

  // logic

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return false;
  } else {
    localStorage.setItem("user", email); // email id set in local storage
    return true;
  }
}
