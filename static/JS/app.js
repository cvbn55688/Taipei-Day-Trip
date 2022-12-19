const categoryDiv = document.querySelector(".category");
const serachInput = document.querySelector(".search_bar input");
const searchButton = document.querySelector(".img_box");
const target = document.querySelector("footer");
const callback = (entries) => {
  if (entries[0].isIntersecting) {
    if (page != null) {
      addAttraction();
    } else {
      observer.unobserve(target);
    }
  }
};
const observer = new IntersectionObserver(callback, {
  threshold: 0.9,
});

let page = 0;
let keyword = "";

function addAttraction() {
  let midDiv = document.querySelector(".mid");
  return fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      attractionsData = data["data"];
      attractionsData.forEach((data) => {
        let name = data["name"];
        let address = data["address"];
        let category = data["category"];
        let description = data["description"];
        let mrt = data["mrt"];
        let id = data["id"];
        let images = data["images"];

        let newCard = document.createElement("a");
        newCard.classList.add("card");
        newCard.setAttribute("id", id);
        newCard.href = `/attraction/${id}`;

        let newAttraction = document.createElement("div");
        newAttraction.classList.add("attraction");

        let newImg = document.createElement("img");
        newImg.src = images[0];

        let attractionName = document.createElement("p");
        attractionName.classList.add("attraction_name");
        attractionName.textContent = name;

        let newDetails = document.createElement("div");
        newDetails.classList.add("details");

        let newMrt = document.createElement("p");
        newMrt.classList.add("mrt");
        newMrt.textContent = mrt;

        let newCAT = document.createElement("p");
        newCAT.classList.add("CAT");
        newCAT.textContent = category;

        midDiv.appendChild(newCard);
        newCard.appendChild(newAttraction);
        newCard.appendChild(newDetails);
        newAttraction.appendChild(newImg);
        newAttraction.appendChild(attractionName);
        newDetails.appendChild(newMrt);
        newDetails.appendChild(newCAT);
      });
      page = data["nextPage"];
      observer.observe(target);
      let dataLength = data["data"].length;

      return dataLength;
    });
}
addAttraction();

searchButton.addEventListener("click", attraction_search);
async function attraction_search() {
  let midDiv = document.querySelector(".mid");
  let main = document.querySelector("main");
  let searchWord = document.querySelector(".search_bar input");
  keyword = searchWord["value"];
  page = 0;
  observer.unobserve(target);
  midDiv.remove();
  let newContent = document.createElement("div");
  newContent.classList.add("mid");
  main.appendChild(newContent);
  dataLength = await addAttraction();
  if (dataLength == 0) {
    alert("查無資料");
  }
}

function get_category() {
  fetch(`/api/categories`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data["data"];
      data.forEach((CAT) => {
        let CatDiv = document.createElement("div");
        CatDiv.textContent = CAT;
        categoryDiv.appendChild(CatDiv);
      });
    });
}
get_category();

serachInput.addEventListener("click", show_CAT);
let CatBox = document.querySelector(".category");
function show_CAT() {
  CatBox.style.display = "grid";
  CatBox.addEventListener("mousedown", get_user_CAT);
  serachInput.addEventListener("blur", close_CAT);
}

function get_user_CAT(eve) {
  CatName = eve.target.innerHTML.replace(/\s+/g, "");
  if (CatName.substr(0, 5) != "<div>") {
    document.querySelector(".search_bar input").value = CatName;
  }
}

function close_CAT() {
  CatBox.style.display = "None";
}
