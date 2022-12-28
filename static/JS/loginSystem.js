const memberButton = document.querySelector(".member");
const logoutButton = document.querySelector(".logout");
const liDiv = document.querySelector("nav ul");
const closeButton = document.querySelector(".close_img");
const loginPage = document.querySelector(".full_screen");
const loginDiv = document.querySelector(".member_login");
const signDiv = document.querySelector(".signup");
const memberTable = document.querySelector(".member_system");
const loginSubmit = document.querySelector(".member_login button");
const signupSubmit = document.querySelector(".signup button");
const signupButton = document.querySelector(".signup_button");
const loginButton = document.querySelector(".login_button");
const bookingButton = document.querySelector(".member_booking");
const memberHistoricalOrders = document.querySelector(".historical-orders");
const memberCenterBottun = document.querySelector(".member-center");
const hamburgerButton = document.querySelector(".hamburger");
const humburgerNavbar = document.querySelector(".navbar");
const hamburgerMemberCenterBottun = document.querySelector(
  ".hamburger-member-center"
);
const humburgerBookingButton = document.querySelector(
  ".hamburger-member-booking"
);
const humburgerHistoryButton = document.querySelector(
  ".hamburger-historical-orders"
);
const humburgerLoginButton = document.querySelector(".hamburger-login");
const humburgerLogoutButton = document.querySelector(".hamburger-logout");
console.log(humburgerLoginButton, humburgerLogoutButton);
const emailRegex =
  /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const numberRegex = /^\d{10}$/;

memberButton.addEventListener("click", showBlackScreen);
humburgerLoginButton.addEventListener("click", showBlackScreen);
function showBlackScreen() {
  loginPage.style.display = "flex";
  loginPage.style.animation = "show_member_system 0.5s forwards";
}

closeButton.addEventListener("click", close_black_screen);
function close_black_screen() {
  loginPage.style.animation = "close_member_system 0.5s forwards";
  setTimeout(() => {
    loginPage.style.display = "None";
  }, 500);
}

signupButton.addEventListener("click", showSignup);
function showSignup() {
  loginDiv.style.display = "None";
  signDiv.style.display = "flex";
}

loginButton.addEventListener("click", showLogin);
function showLogin() {
  loginDiv.style.display = "flex";
  signDiv.style.display = "None";
}

function eraseMessage(userDataForm) {
  setTimeout(() => {
    document.addEventListener(
      "click",
      () => {
        userDataForm.removeChild(singMessage);
      },
      { once: true }
    );
  }, 100);
}

signupSubmit.addEventListener("click", singup);
let singMessage = document.createElement("p");
function singup() {
  let userDataForm = document.querySelector(".signup form");
  let user_name = userDataForm[0].value;
  let user_email = userDataForm[1].value;
  let user_password = userDataForm[2].value;
  if (user_name == "" || user_email == "" || user_password == "") {
    singMessage.textContent = "姓名、信箱、密碼皆不可空白";
    singMessage.style.color = "red";
    userDataForm.appendChild(singMessage);
    eraseMessage(userDataForm);
  } else if (!emailRegex.test(user_email)) {
    singMessage.textContent = "信箱不符合格式";
    singMessage.style.color = "red";
    userDataForm.appendChild(singMessage);
    eraseMessage(userDataForm);
  } else {
    fetch(`/api/user`, {
      method: "POST",
      body: JSON.stringify({
        name: user_name,
        email: user_email,
        password: user_password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.ok == true) {
          singMessage.textContent = "註冊成功";
          singMessage.style.color = "green";
          userDataForm.appendChild(singMessage);
          eraseMessage(userDataForm);
        } else {
          singMessage.textContent = data.message;
          singMessage.style.color = "red";
          userDataForm.appendChild(singMessage);
          eraseMessage(userDataForm);
        }
      });
  }
}

loginSubmit.addEventListener("click", login);
function login() {
  let userDataForm = document.querySelector(".member_login form");
  let user_email = userDataForm[0].value;
  let user_password = userDataForm[1].value;
  if (user_email == "" || user_password == "") {
    singMessage.textContent = "信箱、密碼皆不可空白";
    singMessage.style.color = "red";
    userDataForm.appendChild(singMessage);
    eraseMessage(userDataForm);
  } else if (!emailRegex.test(user_email)) {
    singMessage.textContent = "信箱不符合格式";
    singMessage.style.color = "red";
    userDataForm.appendChild(singMessage);
    eraseMessage(userDataForm);
  } else {
    fetch(`/api/user/auth`, {
      method: "PUT",
      body: JSON.stringify({
        email: user_email,
        password: user_password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.ok) {
          alert("登入成功");
          document.location.href = location.href;
        } else {
          singMessage.textContent = data.message;
          singMessage.style.color = "red";
          userDataForm.appendChild(singMessage);
          eraseMessage(userDataForm);
        }
      });
  }
}

function checkLoginState() {
  return fetch(`/api/user/auth`, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data.data;
      if (data != null) {
        user_id = data.id;
        user_name = data.name;
        memberButton.style.display = "None";
        logoutButton.style.display = "block";
        humburgerLoginButton.style.display = "None";
        humburgerLogoutButton.style.display = "flex";

        return user_name;
      } else if (document.cookie != "") {
        let refresh_token = document.cookie.split("=")[1].split(";")[0];
        fetch(`/refresh`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refresh_token} `,
          },
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.ok) {
              document.location.href = location.href;
            } else {
              logout("expired");
            }
          });
      } else {
        return "isLogout";
      }
    });
}
checkLoginState();

function logout(logout_event) {
  fetch(`/api/user/auth`, {
    method: "DELETE",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (logout_event == "userLogout") {
        alert("已成功登出");
      } else {
        alert("登入逾時，請重新登入");
      }
      document.location.href = location.href;
    });
}

logoutButton.addEventListener("click", () => {
  logout("userLogout");
});
humburgerLogoutButton.addEventListener("click", () => {
  logout("userLogout");
});

function logInRequest(button, cb) {
  button.addEventListener("click", () => {
    let state = checkLoginState();
    state.then(function (response) {
      if (response == "isLogout") {
        showBlackScreen();
      } else {
        cb();
      }
    });
  });
}

logInRequest(bookingButton, () => {
  document.location.href = "/booking";
});
logInRequest(memberHistoricalOrders, () => {
  document.location.href = "/history_order";
});
logInRequest(humburgerBookingButton, () => {
  document.location.href = "/booking";
});
logInRequest(humburgerHistoryButton, () => {
  document.location.href = "/history_order";
});
logInRequest(memberCenterBottun, () => {
  document.location.href = "/member";
});
logInRequest(hamburgerMemberCenterBottun, () => {
  document.location.href = "/member";
});

count = 0;
hamburgerButton.addEventListener("click", () => {
  if (count % 2 == 0) {
    humburgerNavbar.style.display = "flex";
    count++;
  } else {
    humburgerNavbar.style.display = "None";
    count--;
  }
  console.log(count);
});
