const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


for(let select of dropdown){
    for(let currCode of Object.keys(countryList)){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        select.append(newOption);
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = true;
        }

        if(select.name === "to" && currCode === "INR"){
            newOption.selected = true;
        }
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    })
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);
    if(!isFinite(amtVal) || amtVal<1){
        amtVal = 1;
        amount.value ="1";
    }
    //console.log(fromCurr.value, toCurr.value);
    if (fromCurr.value === toCurr.value) { msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal.toFixed(2)} ${toCurr.value}`; return; };
    const URL = `https://api.frankfurter.app/latest?from=${fromCurr.value}&to=${toCurr.value}`;
    let response = await fetch(URL);
    if(!response.ok) throw new Error(`Fetch failed: ${response.status}`); 
    let data = await response.json();
    let rate = data && data.rates && data.rates[toCurr.value];
    if (rate === undefined) throw new Error(`Rate not found: ${fromCurr.value} → ${toCurr.value}`);
    let finalAmount = Number.isFinite(amtVal * rate) ? (amtVal * rate).toFixed(2) : "N/A";
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    if(img) img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate().catch(err => msg.innerText = `Error: ${err.message}`);
    
});


window.addEventListener("load", () => {
    updateExchangeRate().catch(err => msg.innerText = `Error: ${err.message}`);
});