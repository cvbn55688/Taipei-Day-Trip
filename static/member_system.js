const member_button = document.querySelector(".member");
const li_div = document.querySelector("nav ul");
const close_button = document.querySelector(".close_img");
const login_page = document.querySelector(".full_screen");
const login_div = document.querySelector(".member_login");
const sign_div = document.querySelector(".signup");
const member_table = document.querySelector(".member_system");
const login_submit = document.querySelector(".member_login button");
const signup_submit = document.querySelector(".signup button");
const signup_button = document.querySelector(".signup_button");
const login_button = document.querySelector(".login_button");

member_button.addEventListener("click", show_black_screen);
function show_black_screen(){
  login_page.style.animation = "show_member_system 0.5s forwards"
};

close_button.addEventListener("click", close_black_screen);
function close_black_screen(){
  login_page.style.animation = "close_member_system 0.5s forwards"
};

signup_button.addEventListener("click", show_signup);
function show_signup(){
  login_div.style.display = "None";
  sign_div.style.display = "flex";
};

login_button.addEventListener("click", show_login);
function show_login(){
  login_div.style.display = "flex";
  sign_div.style.display = "None";
};

function erase_message(user_data_form){
    setTimeout(() => {
        document.addEventListener("click", ()=>{
            user_data_form.removeChild(sing_message)
        }, {once : true});
    }, 100);
}

signup_submit.addEventListener("click", singup);
let sing_message = document.createElement("p")
function singup(){
    let user_data_form = document.querySelector(".signup form");
    let user_name = user_data_form[0].value;
    let user_email = user_data_form[1].value;
    let user_password = user_data_form[2].value;
    if (user_name == "" || user_email == "" || user_password == ""){
        sing_message.textContent = "姓名、信箱、密碼皆不可空白";
        sing_message.style.color = "red";
        user_data_form.appendChild(sing_message);
        erase_message(user_data_form)
        
    }else{
        fetch(
            `/api/user`, {
                method: "POST",
                body: JSON.stringify({
                name: user_name,
                email: user_email,
                password:  user_password,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data["ok"] == true){
                sing_message.textContent = "註冊成功";
                sing_message.style.color = "green";
                user_data_form.appendChild(sing_message);
                erase_message(user_data_form)
            }else{
                sing_message.textContent = data["message"];
                sing_message.style.color = "red";
                user_data_form.appendChild(sing_message);
                erase_message(user_data_form)
            };
            
          }
        );
    };
    
};

login_submit.addEventListener("click", login)
function login(){
    let user_data_form = document.querySelector(".member_login form");
    let user_email = user_data_form[0].value;
    let user_password = user_data_form[1].value;
    if (user_email == "" || user_password == ""){
        sing_message.textContent = "信箱、密碼皆不可空白";
        sing_message.style.color = "red";
        user_data_form.appendChild(sing_message);
        erase_message(user_data_form)
    }else{
        fetch(
            `/api/user/auth`, {
                method: "PUT",
                body: JSON.stringify({
                email: user_email,
                password:  user_password,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
            .then(function(response) {
                return response.json();
              })
              .then(function (data) {
                if (data["ok"]){
                    alert("登入成功");
                    document.location.href = location.href
                }else{
                    sing_message.textContent = data["message"];
                    sing_message.style.color = "red";
                    user_data_form.appendChild(sing_message);
                    erase_message(user_data_form)
                };
            });
        
    };
};

function check_login_state(){
    fetch(
        `/api/user/auth`, {
            method: "GET",
        }
        )
        .then(function(response){
            return response.json();
        })
        .then(function (data) {
            data = data["data"];
            if (data != null){
                user_id = data["id"];
                user_name = data["name"];
                member_button.style.display = "None";
                let logout_button = document.createElement("li");
                logout_button.textContent = "登出系統";
                li_div.appendChild(logout_button);
                logout_button.addEventListener("click", ()=>{
                    logout();
                });
            };
        });
};
check_login_state()

function logout(){
    fetch(
        `/api/user/auth`, {
            method: "DELETE",
        }
    )
    .then(function(response){
        return response.json();
    })
    .then(function (data) {
        alert("已成功登出");
        document.location.href = location.href
    });
};