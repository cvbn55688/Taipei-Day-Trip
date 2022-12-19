const alreadyOrderBottun = document.querySelector(".already-order");

function getOrders() {
  return fetch(`/api/order/user`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

getOrders();
