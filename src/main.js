import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > defs > linearGradient stop:nth-child(1)"
)
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > defs > linearGradient stop:nth-child(2)"
)

console.log(ccBgColor01)
console.log(ccBgColor02)
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function setCardType(type) {
  const colors = {
    visa: ["#1F93FF", "#6CB8FF"],
    mastercard: ["#F79E1B", "#EB001B"],
    americanExpress: ["#0077a6", "#c6c6c6"],
    elo: ["#ef4123", "#00a4e0"],
    default: ["#9C9C9C", "#202024"],
  }

  ccBgColor01.setAttribute("stop-color", colors[type][0])
  ccBgColor02.setAttribute("stop-color", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
  ccLogo.setAttribute("style", `opacity: 0;`)
  if (type !== "default") {
    for (let opacity = 0; opacity <= 50; opacity++) {
      await sleep(20)
      ccLogo.setAttribute("style", `opacity: ${opacity / 50};`)
    }
  }
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000.0000.0000.0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000.0000.0000.0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000.0000.0000.0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "americanExpress",
    },
    {
      mask: "0000.0000.0000.0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "elo",
    },
    {
      mask: "0000.0000.0000.0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    return dynamicMasked.compiledMasks.find(({ regex }) => {
      return number.match(regex)
    })
  },
}

IMask(cardNumber, cardNumberPattern)
