let url = location.href;
let arrtacrion_id = url.split("/").pop();

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

        const img_div = document.querySelector(".imges")
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
        }
        arrtaction_title_div .appendChild(attraction_subtitle)

        const description_div = document.querySelector(".description");
        let description_p = document.createElement("p");
        description_p.textContent = description;
        description_div.appendChild(description_p)

        const address_div = document.querySelector(".address");
        let address_p = document.createElement("p");
        address_p.textContent = address;
        address_div.appendChild(address_p);

        const transport_div = document.querySelector(".transport");
        let transport_p = document.createElement("p");
        transport_p.textContent = transport;
        transport_div.appendChild(transport_p);
        
        img_items = document.querySelectorAll(".imges img")
        return img_items
    });
};
let imges = get_attraction();
let current = 0;

imges.then((value) => {
    const picture_div = document.querySelector(".dot")
    for (let i = 0; i < value.length; i++){
      let new_dot = document.createElement("div");
      new_dot.classList.add("dot_child");
      new_dot.setAttribute("id", i);
      picture_div.appendChild(new_dot)
    };
    let dot_div = document.querySelectorAll(".dot_child");
    dot_div[current].style.backgroundColor = "#000000";  
    // let dot_parent_div = document.querySelector(".dot");
    picture_div.addEventListener("click",get_user_dot);
    function get_user_dot(eve){
      id = eve.target.id;
      if (id != ""){
        dot_div[current].style.backgroundColor = "#ffffff"; 
        change_pic(Number(id))
      }
    }
    picture_div.addEventListener("mouseover",(eve) => {
      id = eve.target.id;
      if (id != current && id != ""){
        eve.target.style.backgroundColor = "#000000"; 
        eve.target.style.animation = "appear_dot 0.25s forwards"
      }
    })
    picture_div.addEventListener("mouseout",(eve) => {
      id = eve.target.id;
      if (id != current && id != ""){
        eve.target.style.backgroundColor = "#ffffff"; 
        eve.target.style.animation = "disappear_dot 0.25s forwards"
      }
    })
    function change_pic(id){
      if (id > current){
        value[current].style.animation = "hideRight 1s forwards";
        current = id;
        value[current].style.animation =
        "showRight 1s forwards";
      }
      if (id < current){
        value[current].style.animation = "hideLeft 1s forwards";
        current = id;
        value[current].style.animation =
        "showLeft 1s forwards";
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
    let next_button = document.querySelector(".right_arrow");
    let previous_button = document.querySelector(".left_arrow");
    let all_pic_touch = document.querySelector(".picture");
    next_button.addEventListener("click", next_pic);
    previous_button.addEventListener("click", precious_pic);
    let pic_turn = window.setInterval(next_pic, 3000);

  });


  
  let login = document.querySelector(".login")
  login.addEventListener("click", show_black_screen)
  let close_button = document.querySelector(".close_img")
  close_button.addEventListener("click", close_black_screen)
  let login_page = document.querySelector(".full_screen")
  let login_div = document.querySelector(".member_login")
  let sign_div = document.querySelector(".signup")
  let member_table = document.querySelector(".member_system")
  function show_black_screen(){
    login_page.style.display = "flex"
  }
  function close_black_screen(){
    login_page.style.display = "None"
  }
  
  let signup_button = document.querySelector(".signup_button");
  signup_button.addEventListener("click", show_signup)
  function show_signup(){
    login_div.style.display = "None"
    sign_div.style.display = "block"
    member_table.style.height = "340px"
  }
  
  let login_button = document.querySelector(".login_button");
  login_button.addEventListener("click", show_login)
  function show_login(){
    login_div.style.display = "block"
    sign_div.style.display = "None"
    member_table.style.height = "285px"
  }

const morning = document.querySelector(".morning");
const afternoon = document.querySelector(".afternoon");
const cost = document.querySelector("#p_6");
morning.addEventListener("click", () => {
  cost.textContent = "新台幣2000元"
});
afternoon.addEventListener("click", () => {
  cost.textContent = "新台幣2500元"
})

