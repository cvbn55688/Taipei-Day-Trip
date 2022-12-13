const footer = document.querySelector("footer");
const mid_journey = document.querySelector(".mid_journey");
const mainDiv = document.querySelector(".top_journey");
const userName = document.querySelector(".user_journey span")
check_login_state().then(function(response){
    userName.textContent = response
})

function getBookingInfo(){
    let journeyBox = document.querySelector(".journey");
    let totalPrice = 0;
    fetch(
        `/api/booking`, {
            method: "GET",
        })
        .then(function(response){
            if (response.status == 403){
                alert("請先登入系統");
                document.location.href = "/";
            }
            return response.json();
        })
        .then(function (data) {
            data = data.data;
            if (data.length != 0){
                let attractionIds = [];
                data.forEach(element => {
                    attractionImg = element.attraction.image;
                    attractionName = element.attraction.name;
                    attractionIds.push(element.attraction.id);
                    bookingId = element.attraction.booking_id;
                    date = element.date;
                    time = element.time;
                    price = element.price;
                    totalPrice += price;
                    address = element.attraction.address;
                    if(time == "morning"){
                        time = "早上9點到中午12點";
                    }else{
                        time = "下午1點到下午4點";
                    };
                    let newCard = document.createElement("div");
                    newCard.classList.add("journey_card");
                    newCard.setAttribute("id", bookingId);
                    journeyBox.appendChild(newCard);
    
                    newImg = document.createElement("img");
                    newImg.classList.add("imges");
                    newImg.src = attractionImg;
                    newCard.appendChild(newImg);
    
                    let newAttractionInfo = document.createElement("div");
                    newAttractionInfo.classList.add("attraction_info");
                    newCard.appendChild(newAttractionInfo);
    
                    let newAttractionTitle = document.createElement("p");
                    newAttractionTitle.classList.add("attraction_title");
                    newAttractionTitle.textContent = "台北一日遊：";
                    let newAttractionName = document.createElement("span");
                    newAttractionName.classList.add("attraction_name");
                    newAttractionName.textContent = attractionName;
                    newAttractionTitle.appendChild(newAttractionName);
                    newAttractionInfo.appendChild(newAttractionTitle);
    
                    let newDate = document.createElement("p");
                    newDate.textContent = "日期：" + date;
                    newAttractionInfo.appendChild(newDate);
    
                    let newTime = document.createElement("p");
                    newTime.textContent = "時間：" + time;
                    newAttractionInfo.appendChild(newTime);
    
                    let newPrice = document.createElement("p");
                    newPrice.textContent = "費用：" + price;
                    newAttractionInfo.appendChild(newPrice);
    
                    let newAddress = document.createElement("p");
                    newAddress.textContent = "地點：" + address;
                    newAttractionInfo.appendChild(newAddress);
    
                    let newDelete = document.createElement("img");
                    newDelete.classList.add("delete");
                    newDelete.src = "../IMG/icon_delete.png";
                    newCard.appendChild(newDelete);
    
                    let newHr = document.createElement("hr");
                    journeyBox.appendChild(newHr);
                });

                let s = new Set(attractionIds);
                if (attractionIds.length == s.size){
                    console.log("陣列中沒有重複值");
                } else {
                    console.log("陣列中有重複值");
                    alert("注意，您有景點重複，請查明後再下訂，避免重複扣款。");
                }
            }else{
                let noBooking = document.createElement("p");
                noBooking.classList.add("showNoBooking");
                noBooking.textContent = "目前沒有任何待預訂的行程";
                mainDiv.appendChild(noBooking);
                mid_journey.style.display = "None";
                footer.style.height = "100vh";
                footer.style.alignItems = "start";
                footer.style.paddingTop = "45px";
            };
            
            deleteBooking();
            let sumDiv = document.querySelector(".sum");
            sumDiv.textContent = totalPrice;
        });
};
getBookingInfo();

function deleteBooking(){
    let journeyBoxs = document.querySelectorAll(".journey .delete");
    journeyBoxs.forEach(journeyBox => {
        journeyBox.addEventListener("click", (eve)=>{
            booking_id = eve.target.parentElement.attributes.id.value;
    
            fetch(
                `/api/booking`, {
                    method: "DELETE",
                    body: JSON.stringify({
                    id: booking_id,
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                })
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    if (data.ok){
                        alert("已成功刪除預定行程")
                        document.location.href = location.href
                    };
                });
        });
    });
};
