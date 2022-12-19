const submitButton = document.querySelector(".submit_disabled");
const totalPrice = document.querySelector(".sum");
const attractionList = getBookingInfo();
const contactNameInput = document.querySelector(".name");
const contactEmailInput = document.querySelector(".email");
const contactPhoneInput = document.querySelector(".phone");
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

TPDirect.card.onUpdate(function (update) {
  if (update.canGetPrime) {
    submitButton.classList.remove("submit_disabled");
    submitButton.addEventListener("click", onSubmit);
  } else {
    submitButton.classList.add("submit_disabled");
    submitButton.removeEventListener("click", onSubmit);
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  if (update.cardType === "visa") {
    // Handle card type visa.
  }
});

function onSubmit() {
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  if (
    contactEmailInput.value == "" ||
    contactNameInput.value == "" ||
    contactPhoneInput.value == ""
  ) {
    alert("姓名、信箱、手機號碼不可空白");
    return;
  } else if (!emailRegex.test(contactEmailInput.value)) {
    alert("信箱不符合格式，請包含'@'、'.com'");
    return;
  } else if (!numberRegex.test(contactPhoneInput.value)) {
    alert("電話號碼不符合格式，請輸入電話號碼十碼");
    return;
  }

  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }

  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
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
          } else {
            data = data.data;
            number = data.number;
            alert(data.payment.message);
            if (data.payment.status == 0) {
              document.location.href = `/thankyou?number=${number}`;
            }
          }
        });
    });
  });
}
