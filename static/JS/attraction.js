const url = location.href;
const arrtacrionId = url.split("/").pop();

function getAttraction() {
  return fetch(`/api/attraction/${arrtacrionId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data.data;
      attractionName = data.name;
      category = data.category.replace(/\s+/g, "");
      mrt = data.mrt;
      description = data.description;
      address = data.address;
      transport = data.transport;
      imgs = data.images;
      document.title = attractionName;
      const img_div = document.querySelector(".imges");
      imgs.forEach((img) => {
        let newImg = document.createElement("img");
        newImg.src = img;
        img_div.appendChild(newImg);
      });

      const arrtactionTitleDiv = document.querySelector(".arrtaction_title");
      let attractionTitle = document.createElement("p");
      attractionTitle.classList.add("profile_title");
      attractionTitle.textContent = attractionName;
      arrtactionTitleDiv.appendChild(attractionTitle);

      let attractionSubtitle = document.createElement("p");
      attractionSubtitle.classList.add("profile_subtitle");
      if (mrt) {
        attractionSubtitle.textContent = `${category} at ${mrt}`;
      } else {
        attractionSubtitle.textContent = `${category}`;
      }
      arrtactionTitleDiv.appendChild(attractionSubtitle);

      const descriptionDiv = document.querySelector(".description");
      let description_p = document.createElement("p");
      description_p.textContent = description;
      descriptionDiv.appendChild(description_p);

      const addressDiv = document.querySelector(".address");
      let addressP = document.createElement("p");
      addressP.textContent = address;
      addressDiv.appendChild(addressP);

      const transportDiv = document.querySelector(".transport");
      let transportP = document.createElement("p");
      transportP.textContent = transport;
      transportDiv.appendChild(transportP);

      imgItems = document.querySelectorAll(".imges img");
      return imgItems;
    });
}
let imges = getAttraction();
let current = 0;

imges.then((value) => {
  const pictureDiv = document.querySelector(".dot");
  for (let i = 0; i < value.length; i++) {
    let newDot = document.createElement("div");
    newDot.classList.add("dot_child");
    newDot.setAttribute("id", i);
    pictureDiv.appendChild(newDot);
  }
  const dotDiv = document.querySelectorAll(".dot_child");
  dotDiv[current].style.backgroundColor = "#000000";
  pictureDiv.addEventListener("click", getUserDot);
  function getUserDot(eve) {
    id = eve.target.id;
    if (id != "") {
      dotDiv[current].style.backgroundColor = "#ffffff";
      changePic(Number(id));
    }
  }
  pictureDiv.addEventListener("mouseover", (eve) => {
    id = eve.target.id;
    if (id != current && id != "") {
      eve.target.style.backgroundColor = "#000000";
      eve.target.style.animation = "appear_dot 0.25s forwards";
    }
  });
  pictureDiv.addEventListener("mouseout", (eve) => {
    id = eve.target.id;
    if (id != current && id != "") {
      eve.target.style.backgroundColor = "#ffffff";
      eve.target.style.animation = "disappear_dot 0.25s forwards";
    }
  });
  function changePic(id) {
    if (id > current) {
      value[current].style.animation = "hideRight 1s forwards";
      current = id;
      value[current].style.animation = "showRight 1s forwards";
    }
    if (id < current) {
      value[current].style.animation = "hideLeft 1s forwards";
      current = id;
      value[current].style.animation = "showLeft 1s forwards";
    }
    dotDiv[current].style.backgroundColor = "#000000";
  }
  function nextPic() {
    value[current].style.animation = "hideRight 1s forwards";
    value[current >= value.length - 1 ? 0 : current + 1].style.animation =
      "showRight 1s forwards";
    dotDiv[current].style.backgroundColor = "#ffffff";
    if (current < value.length - 1) {
      current++;
      dotDiv[current].style.backgroundColor = "#000000";
    } else {
      current = 0;
      dotDiv[current].style.backgroundColor = "#000000";
    }
  }
  function preciousPic() {
    value[current].style.animation = "hideLeft  1s forwards";
    value[current > 0 ? current - 1 : value.length - 1].style.animation =
      "showLeft 1s forwards";
    dotDiv[current].style.backgroundColor = "#ffffff";
    if (current > 0) {
      current--;
      dotDiv[current].style.backgroundColor = "#000000";
    } else {
      current = value.length - 1;
      dotDiv[current].style.backgroundColor = "#000000";
    }
  }
  const nextButton = document.querySelector(".right_arrow");
  const previousButton = document.querySelector(".left_arrow");
  const allPicTouch = document.querySelector(".picture");
  nextButton.addEventListener("click", nextPic);
  previousButton.addEventListener("click", preciousPic);
  const picTurn = window.setInterval(nextPic, 3000);
});

const morning = document.querySelector(".morning");
const afternoon = document.querySelector(".afternoon");
const cost = document.querySelector("#p_6");
morning.addEventListener("click", () => {
  cost.textContent = "新台幣2000元";
});
afternoon.addEventListener("click", () => {
  cost.textContent = "新台幣2500元";
});

const bookingSubmit = document.querySelector(".booking button");
bookingSubmit.addEventListener("click", () => {
  let bookingDate = document.querySelector(".booking .date input");
  let bookingTime = document.querySelectorAll(".booking .time input");
  let morning = window
    .getComputedStyle(bookingTime[0], "::before")
    .background.slice(5, 6);
  let afternoon = window
    .getComputedStyle(bookingTime[1], "::before")
    .background.slice(5, 6);
  let price = 0;
  bookingTime = "";

  if (bookingDate.value == "") {
    alert("請填入日期");
  } else {
    bookingDate = bookingDate.value;
    if (morning != 0) {
      bookingTime = "morning";
      price = 2000;
    } else {
      bookingTime = "afternoon";
      price = 2500;
    }
    fetch(`/api/booking`, {
      method: "POST",
      body: JSON.stringify({
        attractionId: arrtacrionId,
        date: bookingDate,
        time: bookingTime,
        price: price,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        if (response.status == 403) {
          showBlackScreen();
        } else {
          return response.json();
        }
      })
      .then(function (data) {
        if (data.ok) {
          alert("預約成功");
          document.location.href = "/booking";
        }
      });
  }
});

const dateImput = document.querySelector("#Date");
dateImput.addEventListener("click", () => {
  let date_now = new Date();
  let year = date_now.getFullYear();
  let month =
    date_now.getMonth() + 1 < 10
      ? "0" + (date_now.getMonth() + 1)
      : date_now.getMonth() + 1;
  let date =
    date_now.getDate() < 10 ? "0" + date_now.getDate() : date_now.getDate();
  console.log(date);
  dateImput.setAttribute("min", year + "-" + month + "-" + date);
});
