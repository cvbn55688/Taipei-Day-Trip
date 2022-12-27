const alreadyOrderBottun = document.querySelector(".already-order");
const showOrders = document.querySelector(".show-orders");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
function getOrders() {
  return fetch(`/api/order/user`)
    .then(function (response) {
      if (response.status == 403) {
        alert("請先登入會員");
        document.location.href = "/";
      }
      return response.json();
    })
    .then(function (data) {
      if (data.length != 0) {
        data.forEach((order) => {
          let number = order.number;
          let contactEmail = order.contact.email;
          let contactName = order.contact.name;
          let contactPhone = order.contact.phone;

          let newOrderCard = document.createElement("div");
          newOrderCard.classList.add("order-card");
          showOrders.appendChild(newOrderCard);

          let newTitleDiv = document.createElement("div");
          newTitleDiv.classList.add("title");
          newOrderCard.appendChild(newTitleDiv);

          let newTitleDivP = document.createElement("p");
          newTitleDivP.textContent = "訂單編號";
          newTitleDiv.appendChild(newTitleDivP);

          let newTitleDivSpan = document.createElement("span");
          newTitleDivSpan.classList.add("number");
          newTitleDivSpan.textContent = number;
          newTitleDivP.appendChild(newTitleDivSpan);

          let triangleImg = document.createElement("img");
          triangleImg.src = "../IMG/2203515_media_music_play_triangle_icon.png";
          newTitleDiv.appendChild(triangleImg);
          tripLength = order.trips.length;
          attractionCount = 0;
          order.trips.forEach((attraction) => {
            let imgUrl = attraction.images;
            let attractionName = attraction.attraction_name;
            let date = attraction.date;
            let price = attraction.price;
            let attractionAddress = attraction.address;
            let attractionId = attraction.attraction_id;
            if (attraction.time == "morning") {
              attractionTime = "早上9點到中午12點";
            } else {
              attractionTime = "下午1點到下午4點";
            }

            let newTripOrderDiv = document.createElement("div");
            newTripOrderDiv.classList.add("trips-order");
            newOrderCard.appendChild(newTripOrderDiv);

            let newAttractionImg = document.createElement("img");
            newAttractionImg.src = imgUrl;
            newTripOrderDiv.appendChild(newAttractionImg);

            let newOrderInfoDiv = document.createElement("div");
            newOrderInfoDiv.classList.add("order-info");
            newTripOrderDiv.appendChild(newOrderInfoDiv);

            let newAttractionTitleP = document.createElement("a");
            newAttractionTitleP.classList.add("attraction_title");
            newAttractionTitleP.textContent = "台北一日遊：" + attractionName;
            newAttractionTitleP.href = `/attraction/${attractionId}`;
            newOrderInfoDiv.appendChild(newAttractionTitleP);

            let newDateP = document.createElement("p");
            newDateP.textContent = "日期：" + date;
            newOrderInfoDiv.appendChild(newDateP);

            let newTimeP = document.createElement("p");
            newTimeP.textContent = "時間：" + attractionTime;
            newOrderInfoDiv.appendChild(newTimeP);

            let newPriceP = document.createElement("p");
            newPriceP.textContent = "費用：" + price;
            newOrderInfoDiv.appendChild(newPriceP);

            let newAddressP = document.createElement("p");
            newAddressP.textContent = "地點：" + attractionAddress;
            newOrderInfoDiv.appendChild(newAddressP);

            let newContactInfoDiv = document.createElement("div");
            newContactInfoDiv.classList.add("contact-info");
            newTripOrderDiv.appendChild(newContactInfoDiv);

            let newContactTitleP = document.createElement("p");
            newContactTitleP.classList.add("contact_title");
            newContactTitleP.textContent = "聯絡使用者資訊";
            newContactInfoDiv.appendChild(newContactTitleP);

            let newNameP = document.createElement("p");
            newNameP.textContent = "姓名：" + contactName;
            newContactInfoDiv.appendChild(newNameP);

            let newEmailP = document.createElement("p");
            newEmailP.textContent = "信箱：" + contactEmail;
            newContactInfoDiv.appendChild(newEmailP);

            let newPhoneP = document.createElement("p");
            newPhoneP.textContent = "電話：" + contactPhone;
            newContactInfoDiv.appendChild(newPhoneP);

            attractionCount = attractionCount + 1;

            let newHr = document.createElement("hr");
            if (attractionCount != tripLength) {
              newOrderCard.appendChild(newHr);
            }

            let count = 1;
            newTitleDiv.addEventListener("click", () => {
              if (count % 2 != 0) {
                triangleImg.style.transform = "rotate(0deg)";
                newTripOrderDiv.style.animation = "hide 0.5s forwards";
                newOrderCard.style.padding = "0";
                setTimeout(() => {
                  newTripOrderDiv.style.display = "None";
                  newHr.style.display = "None";
                }, 400);

                count++;
              } else {
                newTripOrderDiv.style.display = "flex";
                newHr.style.display = "flex";
                triangleImg.style.transform = "rotate(90deg)";
                newTripOrderDiv.style.animation = "show 1s forwards";
                newOrderCard.style.padding = "0 0 40px 0";
                count--;
              }
              console.log(count);
            });
          });
        });
      } else {
        let noOrder = document.createElement("p");
        noOrder.classList.add("showNoOrder");
        noOrder.textContent = "目前沒有任何訂單";
        showOrders.appendChild(noOrder);
        main.style.minHeight = "auto";
        footer.style.height = "calc(100vh - 216px)";
        footer.style.justifyContent = "start";
        footer.style.paddingTop = "45px";
      }
    });
}

getOrders();
