const userName = document.querySelector(".user_journey span");
const urlParams = new URLSearchParams(window.location.search);
const number = urlParams.get("number");
const orderNumber = document.querySelector(".order-number");
const haveOrder = document.querySelector(".have-order");
const noOrder = document.querySelector(".no-order");
const thankSection = document.querySelector(".thank");
const footer = document.querySelector("footer");
footer.style.height = "calc(100vh - 318px)";

function getOrderData() {
  fetch(`/api/order/${number}`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status == 403) {
        alert("請先登入系統");
        document.location.href = "/";
      }
      return response.json();
    })
    .then(function (data) {
      if (data.data != null) {
        orderNumber.textContent = number;
      } else {
        haveOrder.style.display = "None";
        noOrder.style.display = "flex";
      }
    });
}

checkLoginState().then(function (response) {
  userName.textContent = response;
});

getOrderData();
