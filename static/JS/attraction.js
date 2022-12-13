const url = location.href;
const arrtacrion_id = url.split("/").pop();

function get_attraction() {  
    return fetch(
      `/api/attraction/${arrtacrion_id}`
    )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        data = data["data"];
        attraction_name = data["name"];
        category = data["category"].replace(/\s+/g,'');
        mrt = data["mrt"];
        description = data["description"];
        address = data["address"];
        transport = data["transport"];
        imgs = data["images"];

        document.title = attraction_name;
        const img_div = document.querySelector(".imges");
        imgs.forEach(img => {
          let new_img = document.createElement("img");
          new_img.src = img;
          img_div.appendChild(new_img);

        });

        const arrtaction_title_div = document.querySelector(".arrtaction_title");
        let attraction_title = document.createElement("p");
        attraction_title.classList.add("profile_title");
        attraction_title.textContent = attraction_name;
        arrtaction_title_div .appendChild(attraction_title);

        let attraction_subtitle = document.createElement("p");
        attraction_subtitle.classList.add("profile_subtitle");
        if (mrt){
            attraction_subtitle.textContent = `${category} at ${mrt}`
        }else{
            attraction_subtitle.textContent = `${category}`
        };
        arrtaction_title_div .appendChild(attraction_subtitle);

        const description_div = document.querySelector(".description");
        let description_p = document.createElement("p");
        description_p.textContent = description;
        description_div.appendChild(description_p);

        const address_div = document.querySelector(".address");
        let address_p = document.createElement("p");
        address_p.textContent = address;
        address_div.appendChild(address_p);

        const transport_div = document.querySelector(".transport");
        let transport_p = document.createElement("p");
        transport_p.textContent = transport;
        transport_div.appendChild(transport_p);
        
        img_items = document.querySelectorAll(".imges img");
        return img_items
    });
};
let imges = get_attraction();
let current = 0;

imges.then((value) => {
    const picture_div = document.querySelector(".dot");
    for (let i = 0; i < value.length; i++){
      let new_dot = document.createElement("div");
      new_dot.classList.add("dot_child");
      new_dot.setAttribute("id", i);
      picture_div.appendChild(new_dot);
    };
    const dot_div = document.querySelectorAll(".dot_child");
    dot_div[current].style.backgroundColor = "#000000";  
    picture_div.addEventListener("click",get_user_dot);
    function get_user_dot(eve){
      id = eve.target.id;
      if (id != ""){
        dot_div[current].style.backgroundColor = "#ffffff"; 
        change_pic(Number(id));
      }
    }
    picture_div.addEventListener("mouseover",(eve) => {
      id = eve.target.id;
      if (id != current && id != ""){
        eve.target.style.backgroundColor = "#000000"; 
        eve.target.style.animation = "appear_dot 0.25s forwards";
      }
    })
    picture_div.addEventListener("mouseout",(eve) => {
      id = eve.target.id;
      if (id != current && id != ""){
        eve.target.style.backgroundColor = "#ffffff"; 
        eve.target.style.animation = "disappear_dot 0.25s forwards";
      }
    })
    function change_pic(id){
      if (id > current){
        value[current].style.animation = "hideRight 1s forwards";
        current = id;
        value[current].style.animation = "showRight 1s forwards";
      }
      if (id < current){
        value[current].style.animation = "hideLeft 1s forwards";
        current = id;
        value[current].style.animation = "showLeft 1s forwards";
      }
      dot_div[current].style.backgroundColor = "#000000";  
    }
    function next_pic(){
      value[current].style.animation = "hideRight 1s forwards";
      value[current >= value.length - 1 ? 0 : current + 1].style.animation =
      "showRight 1s forwards";
      dot_div[current].style.backgroundColor = "#ffffff"; 
      if (current < value.length - 1){
        current++;
        dot_div[current].style.backgroundColor = "#000000";  
      }else{
        current = 0;
        dot_div[current].style.backgroundColor = "#000000"; 
      };
    };
    function precious_pic(){
      value[current].style.animation = "hideLeft  1s forwards";
      value[current > 0 ? current - 1 : value.length -1].style.animation =
      "showLeft 1s forwards";
      dot_div[current].style.backgroundColor = "#ffffff"; 
      if (current > 0 ){
        current--;
        dot_div[current].style.backgroundColor = "#000000";  
      }else{
        current = value.length -1;
        dot_div[current].style.backgroundColor = "#000000";  
      };
    };
    const next_button = document.querySelector(".right_arrow");
    const previous_button = document.querySelector(".left_arrow");
    const all_pic_touch = document.querySelector(".picture");
    next_button.addEventListener("click", next_pic);
    previous_button.addEventListener("click", precious_pic);
    const pic_turn = window.setInterval(next_pic, 3000);

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
bookingSubmit.addEventListener("click", ()=>{
    let bookingDate = document.querySelector(".booking .date input");
    let bookingTime = document.querySelectorAll(".booking .time input");
    let morning = (window.getComputedStyle(bookingTime[0],'::before').background).slice(5,6);
    let afternoon = (window.getComputedStyle(bookingTime[1],'::before').background).slice(5,6);
    let price = 0;
    bookingTime = "";

    if (bookingDate.value == ""){
      alert("請填入日期");
    }else{
      bookingDate = bookingDate.value;
      if (morning != 0) {
        bookingTime = "morning";
        price = 2000;
      }else{
        bookingTime = "afternoon";
        price = 2500;
      };
      fetch(
        `/api/booking`, {
            method: "POST",
            body: JSON.stringify({
            attractionId: arrtacrion_id,
            date: bookingDate,
            time:  bookingTime,
            price: price
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            }
          })
        .then(function(response){
          if (response.status == 403){
            show_black_screen();
          }else{
            return response.json();
          };
        })
        .then(function (data) {
          if (data.ok){
            alert("預約成功");
            document.location.href = "/booking";
          };
        });
    };
});