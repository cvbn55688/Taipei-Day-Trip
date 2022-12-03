const category_div = document.querySelector(".category");
const serach_input = document.querySelector(".search_bar input");
const search_button = document.querySelector(".img_box");
const target = document.querySelector("footer");
const callback = (entries) => {
  if (entries[0].isIntersecting){
    if (page != null){
      add_attraction();
    }else{
      observer.unobserve(target);
    };
  };
};
const observer = new IntersectionObserver(callback, {
threshold: 0.9,
});
let page = 0;
let keyword = "";

function add_attraction() {  
  let mid_div = document.querySelector(".mid");
  return fetch(
    `/api/attractions?page=${page}&keyword=${keyword}`
  )
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    attractions_data = data["data"];
    attractions_data.forEach(data => {
      let name = data["name"];
      let address = data["address"];
      let category = data["category"];
      let description = data["description"];
      let mrt = data["mrt"];
      let id = data["id"];
      let images = data["images"];

      let new_card = document.createElement("a");
      new_card.classList.add("card");
      new_card.setAttribute("id", id);
      new_card.href = `/attraction/${id}`

      let new_attraction = document.createElement("div");
      new_attraction.classList.add("attraction");

      let new_img = document.createElement("img");
      new_img.src = images[0];

      let attraction_name = document.createElement("p");
      attraction_name.classList.add("attraction_name");
      attraction_name.textContent = name;

      let new_details = document.createElement("div");
      new_details.classList.add("details");

      let new_mrt = document.createElement("p");
      new_mrt.classList.add("mrt");
      new_mrt.textContent = mrt;

      let new_CAT = document.createElement("p");
      new_CAT.classList.add("CAT");
      new_CAT.textContent = category;

      mid_div.appendChild(new_card);
      new_card.appendChild(new_attraction);
      new_card.appendChild(new_details);
      new_attraction.appendChild(new_img);
      new_attraction.appendChild(attraction_name);
      new_details.appendChild(new_mrt);
      new_details.appendChild(new_CAT);
    });
    page = data["nextPage"];
    observer.observe(target);
    let data_length = data["data"].length;
    return data_length;
  });
};
add_attraction();

search_button.addEventListener("click",attraction_search);
async function attraction_search(){
  let mid_div = document.querySelector(".mid");
  let main = document.querySelector("main");
  let search_word = document.querySelector(".search_bar input");
  keyword = search_word["value"];
  page = 0;
  observer.unobserve(target);
  mid_div.remove();
  let new_content = document.createElement("div");
  new_content.classList.add("mid");
  main.appendChild(new_content);
  data_length = await add_attraction();
  if (data_length == 0){
    alert("查無資料");
  };
};

function get_category(){
  fetch(
    `/api/categories`
  )
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data = data["data"];
    data.forEach(CAT => {
      let CAT_div = document.createElement("div");
      CAT_div.textContent = CAT;
      category_div.appendChild(CAT_div);
    });
  });
};
get_category();

serach_input.addEventListener("click", show_CAT);
let CAT_box = document.querySelector(".category");
function show_CAT(){
  CAT_box.style.display = "grid";
  CAT_box.addEventListener("mousedown", get_user_CAT);
  serach_input.addEventListener("blur", close_CAT);
};

function get_user_CAT(eve){
    CAT_name = eve.target.innerHTML.replace(/\s+/g,'');
    if(CAT_name.substr(0,5) != "<div>"){
      document.querySelector(".search_bar input").value = CAT_name;
  };
};

function close_CAT(){
  CAT_box.style.display = "None";
};

