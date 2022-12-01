const member_button = document.querySelector(".member")
const li_div = document.querySelector("nav ul")
const close_button = document.querySelector(".close_img")
const login_page = document.querySelector(".full_screen")
const login_div = document.querySelector(".member_login")
const sign_div = document.querySelector(".signup")
const member_table = document.querySelector(".member_system")
const login_submit = document.querySelector(".member_login button")
const signup_submit = document.querySelector(".signup button")

member_button.addEventListener("click", show_black_screen)
function show_black_screen(){
  login_page.style.display = "flex"
}

close_button.addEventListener("click", close_black_screen)
function close_black_screen(){
  login_page.style.display = "None"
}

let signup_button = document.querySelector(".signup_button");
signup_button.addEventListener("click", show_signup)
function show_signup(){
  login_div.style.display = "None"
  sign_div.style.display = "flex"
}

let login_button = document.querySelector(".login_button");
login_button.addEventListener("click", show_login)
function show_login(){
  login_div.style.display = "flex"
  sign_div.style.display = "None"
}

signup_submit.addEventListener("click", singup)
function singup(){
    let user_data = document.querySelector(".signup form")
    let user_name = user_data[0].value
    let user_email = user_data[1].value
    let user_password = user_data[2].value
    if (user_name == "" || user_email == "" || user_password == ""){
        alert("姓名、信箱、密碼皆不可空白")
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
                alert("註冊成功")
                document.location.href=`/`
            }else{
                alert(data["message"])
            }
          }
        )
    }
}

login_submit.addEventListener("click", login)
function login(){
    let user_data = document.querySelector(".member_login form")
    let user_email = user_data[0].value
    let user_password = user_data[1].value
    if (user_email == "" || user_password == ""){
        alert("信箱、密碼皆不可空白")
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
                console.log(data)
                if (data["ok"] == true){
                    alert("登入成功")
                    document.location.href=`/`
                }else{
                    alert(data["message"])
                }
            })
        
    }
}

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
            data = data["data"]
            if (data != null){
                console.log("have cookie")
                user_id = data["id"]
                user_name = data["name"]
                console.log(user_id, user_name)
                member_button.style.display = "None"
                let logout_button = document.createElement("li")
                logout_button.textContent = "登出"
                li_div.appendChild(logout_button)
                logout_button.addEventListener("click", ()=>{
                    logout()
                })
            }
        })
}
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
        console.log(data)
        alert("已成功登出")
        document.location.href=`/`
    })
    
}