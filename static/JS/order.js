const submitButton = document.querySelector(".submit_disabled");
const totalPrice = document.querySelector(".sum");
const attractionList = getBookingInfo();
const contactNameInput = document.querySelector(".name");
const contactEmailInput = document.querySelector(".email");
const contactPhoneInput = document.querySelector(".phone");
const cardNumberInput = document.querySelector("#card-number");
const cardDateInput = document.querySelector("#card-expiration-date");
const cardCcvInput = document.querySelector("#card-ccv");
const loadingScreen = document.querySelector(".loading-screen");
const checkNameIMG = document.querySelector(".check-img-name");
const checkEmailIMG = document.querySelector(".check-img-email");
const checkPhoneIMG = document.querySelector(".check-img-phone");
const checkNumberIMG = document.querySelector(".check-img-number");
const checkDateIMG = document.querySelector(".check-img-date");
const checkCcvIMG = document.querySelector(".check-img-ccv");
TPDirect.setupSDK(
  126793,
  "app_5CVvEuP2FvOwFoi4KKx2hNx6O71LdE9ta67C4rSXczDk2zXknCmRl6Oe6H3R",
  "sandbox"
);
let fields = {
  number: {
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "後三碼",
  },
};
TPDirect.card.setup({
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: "black",
      "font-weight": "500",
      "font-style": "normal",
    },
    // Styling ccv field
    "input.ccv": {},
    // Styling expiration-date field
    "input.expiration-date": {},
    // Styling card-number field
    "input.card-number": {},
    // style focus state
    ":focus": {
      color: "orange",
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },

    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

function cardCheck(cardTargetInput, checkTargetIMG, status) {
  if (status == false) {
    cardTargetInput.style.border = "2px solid red";
    checkTargetIMG.src = "../IMG/close.png";
    return false;
  } else {
    cardTargetInput.style.border = "2px solid rgb(28, 218, 40)";
    checkTargetIMG.src = "../IMG/accept.png";
    return true;
  }
}

TPDirect.card.onUpdate(function (update) {
  if (update.canGetPrime) {
    if (
      checkInfo(contactNameInput, checkNameIMG) ||
      checkInfo(contactEmailInput, checkEmailIMG) ||
      checkInfo(contactPhoneInput, checkPhoneIMG)
    ) {
    }

    submitButton.classList.remove("submit_disabled");
    submitButton.addEventListener("click", onSubmit);
  } else {
    submitButton.classList.add("submit_disabled");
    submitButton.removeEventListener("click", onSubmit);
  }

  if (update.status.number === 2) {
    cardCheck(cardNumberInput, checkNumberIMG, false);
  } else if (update.status.number === 0) {
    cardCheck(cardNumberInput, checkNumberIMG, true);
  }

  if (update.status.expiry === 2) {
    cardCheck(cardDateInput, checkDateIMG, false);
  } else if (update.status.expiry === 0) {
    cardCheck(cardDateInput, checkDateIMG, true);
  }

  if (update.status.ccv === 2) {
    cardCheck(cardCcvInput, checkCcvIMG, false);
  } else if (update.status.ccv === 0) {
    cardCheck(cardCcvInput, checkCcvIMG, true);
  }
});

function appendErrorMes(checkInput, checkTarget, checkMes) {
  checkrespond = document.createElement("p");
  checkrespond.classList.add("check-error");
  checkrespond.textContent = checkMes;
  checkTarget.appendChild(checkrespond);
  checkInput.style.border = "2px solid red";
}

function checkInfo(checkTargetInput, checkTargetIMG) {
  checkTargetInput.addEventListener("blur", () => {
    if (checkTargetInput.value == "") {
      cardCheck(checkTargetInput, checkTargetIMG, false);
    } else if (
      checkTargetInput == contactEmailInput &&
      !emailRegex.test(checkTargetInput.value)
    ) {
      cardCheck(checkTargetInput, checkTargetIMG, false);
    } else if (
      checkTargetInput == contactPhoneInput &&
      !numberRegex.test(checkTargetInput.value)
    ) {
      cardCheck(checkTargetInput, checkTargetIMG, false);
    } else {
      cardCheck(checkTargetInput, checkTargetIMG, true);
    }
  });
}

checkInfo(contactNameInput, checkNameIMG);
checkInfo(contactEmailInput, checkEmailIMG);
checkInfo(contactPhoneInput, checkPhoneIMG);

function onSubmit() {
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  loadingScreen.style.display = "flex";
  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    loadingScreen.style.display = "None";
    return;
  }

  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      loadingScreen.style.display = "None";
      return;
    }

    attractionList.then(function (tripList) {
      let contactInfo = document.querySelectorAll(".contact_info input");
      let contactName = contactInfo[0].value;
      let contactEmail = contactInfo[1].value;
      let contactPhone = contactInfo[2].value;

      fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          prime: result.card.prime,
          order: {
            price: Number(totalPrice.textContent),
            trips: tripList,
          },
          contact: {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          },
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.error) {
            alert(data.message);
            loadingScreen.style.display = "None";
          } else {
            data = data.data;
            number = data.number;
            alert(data.payment.message);
            loadingScreen.style.display = "None";
            if (data.payment.status == 0) {
              document.location.href = `/thankyou?number=${number}`;
            }
          }
        });
    });
  });
}
