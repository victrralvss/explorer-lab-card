import "./css/index.css"
import IMask from "imask"


const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")


function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"]
    }

    ccBgColor01.setAttribute("fill", colors[type][1])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//securityCode
const cvcInput = document.getElementById("security-code")
const cvcInputPattern = {
    mask: "0000"
}
const cvcInputMasked = IMask(cvcInput, cvcInputPattern)

//expirationCard
const expirationInput =  document.getElementById("expiration-date")
const expirationInputPattern = {
    mask: "MM{/}YY",

    blocks: {

        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        }, 

        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        }
        
    }
}

const expirationInputMasked = IMask(expirationInput, expirationInputPattern)

//cardNumber
const cardNumberInput = document.getElementById("card-number")
const cardNumberInputPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        }
    ],

    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))
        console.log(foundMask)
        return(foundMask)
    }
}


const cardNumberInputMasked = IMask(cardNumberInput, cardNumberInputPattern)

//cardInformations
const cardOnwerInput = document.querySelector("#card-holder")

cardOnwerInput.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")
    ccHolder.innerText = cardOnwerInput.value.length === 0 ? "NOME SOBRENOME" : cardOnwerInput.value
})


cvcInputMasked.on("accept", () => {
    uptadeSecurityCode(cvcInputMasked.value)
})

function uptadeSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value");
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberInputMasked.on("accept", () => {
    const cardType = cardNumberInputMasked.masked.currentMask.cardtype
    setCardType(cardType)
    uptadeCardNumber(cardNumberInputMasked.value)
})

function uptadeCardNumber(cardNumber){
    const ccNumber = document.querySelector(".cc-number")
    ccNumber.innerText = cardNumber.length === 0 ? "1234 5678 9012 3456" : cardNumber
}

//

expirationInputMasked.on("accept", () => {
    uptadeExpirationDate(expirationInputMasked.value)
})

function uptadeExpirationDate(expDateLimit){
    const expDate = document.querySelector(".cc-expiration .value")
    expDate.innerText = expDateLimit.length === 0 ? "12/32" : expDateLimit
}

const submitButton =  document.querySelector("form")
submitButton.addEventListener("submit", () => {
    alert("Cartão cadastrado com sucesso!")
})