const nameEdit = document.querySelector("#e1");
const emailEdit = document.querySelector("#e2");
const phoneEdit = document.querySelector("#e3");
const userName = document.querySelector(".user-name");
const userNameInput = document.querySelector(".user-name-input");
const userEmail = document.querySelector(".user-email");
const userEmailInput = document.querySelector(".user-email-input");
const userPhone = document.querySelector(".user-phone");
const userPhoneInput = document.querySelector(".user-phone-input");
const userHeadImgInput = document.querySelector("#head-img-input");
const userHeadImg = document.querySelector("#head-img");

let countName = 0;
let countEmail = 0;
let countPhone = 0;

function editInfo(updateTarget, editButton, info, infoInput, countInfo) {
  if (countInfo == 0) {
    info.style.display = "None";
    infoInput.style.display = "flex";
    editButton.textContent = "儲存";
  } else {
    info.style.display = "flex";
    infoInput.style.display = "None";
    editButton.textContent = "編輯";
    if (infoInput.value == "") {
      return;
    }
    if (updateTarget == "email" && !emailRegex.test(infoInput.value)) {
      alert("電子信箱不符合格式");
      return;
    }
    if (updateTarget == "phone" && !numberRegex.test(infoInput.value)) {
      alert("電話號碼請輸入10碼數字");
      return;
    }
    fetch(`/api/user_update`, {
      method: "PUT",
      body: JSON.stringify({
        updateTarget: updateTarget,
        targetValue: infoInput.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        getUserInfo();
      });
  }
}
nameEdit.addEventListener("click", () => {
  if (countName == 0) {
    editInfo("name", nameEdit, userName, userNameInput, 0);
    countName++;
  } else {
    editInfo("name", nameEdit, userName, userNameInput, 1);
    countName--;
  }
});

emailEdit.addEventListener("click", () => {
  if (countEmail == 0) {
    editInfo("email", emailEdit, userEmail, userEmailInput, 0);
    countEmail++;
  } else {
    editInfo("email", emailEdit, userEmail, userEmailInput, 1);
    countEmail--;
  }
});

phoneEdit.addEventListener("click", () => {
  if (countPhone == 0) {
    editInfo("phone", phoneEdit, userPhone, userPhoneInput, 0);
    countPhone++;
  } else {
    editInfo("phone", phoneEdit, userPhone, userPhoneInput, 1);
    countPhone--;
  }
});

userHeadImgInput.addEventListener("change", (eve) => {
  let file = eve.target.files[0];

  let reader = new FileReader();
  reader.addEventListener("load", () => {
    userHeadImg.src = reader.result;
    imgBase64 = reader.result;
    console.log(imgBase64);
    fetch(`/img_uploads`, {
      method: "POST",
      body: JSON.stringify({
        imgBase64: imgBase64,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  });
  reader.readAsDataURL(file);
});

function getUserInfo() {
  fetch(`/api/user/auth`, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data.data;
      console.log(data);
      userName.textContent = data.name;
      userEmail.textContent = data.email;
      userPhone.textContent = data.user_phone;
    });
}

function getUserIMG() {
  fetch(`/api/user/headIMG`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status == 403) {
        alert("請先登入系統");
        document.location.href = "/";
      }
      return response.json();
    })
    .then(function (data) {
      userHeadImg.src = data.data.head_img;
    });
}

getUserInfo();
getUserIMG();
