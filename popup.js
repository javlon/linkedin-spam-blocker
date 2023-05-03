buttonApplyClr = document.getElementById("applybtnclr")
buttonApplyClr.addEventListener("click", (async () => {
  const response = await chrome.runtime.sendMessage({ action: "apply", actiontype: "color" });
}));

buttonApplyHd = document.getElementById("applybtnhd")
buttonApplyHd.addEventListener("click", (async () => {
  const response = await chrome.runtime.sendMessage({ action: "apply", actiontype: "hide" });
}));


buttonAdd = document.getElementById("addbtn")
buttonAdd.addEventListener("click", (async () => {
  var companyName = document.getElementById("textfld");
  if (companyName.value != "") {
    const response = await chrome.runtime.sendMessage({ action: "add", companyName: companyName.value.trim() });
    console.log(response)
    if (response.status) {
      companyName.value = "";
    }
  }
}));

buttonDelete = document.getElementById("deletebtn")
buttonDelete.addEventListener("click", (async () => {
  var companyName = document.getElementById("textfld");
  if (companyName.value != "") {
    const response = await chrome.runtime.sendMessage({ action: "delete", companyName: companyName.value.trim() });
    console.log(response)
    if (response.status) {
      companyName.value = "";
    }
  }
}));


buttonAddCrnt = document.getElementById("addbtncrnt")
buttonAddCrnt.addEventListener("click", (async () => {
  const response = await chrome.runtime.sendMessage({ action: "addCurrent" });
  console.log(response);
}));



function addElement(companyName) {
  var ul = document.getElementById("SClist");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(companyName));
  ul.appendChild(li);
}


function displayCompaniesList(complaniesList) {
  var myNode = document.getElementById("spamCompaniesId");
  myNode.innerHTML = "";
  var ul = document.createElement("ul");
  for (const companyName of complaniesList) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(companyName));
    ul.appendChild(li);
  }
  myNode.appendChild(ul)
}


chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key == "spamCompanies") {
      displayCompaniesList(newValue);
    }
  }
});

function initDsiplayCompanies() {
  chrome.storage.local.get(['spamCompanies'], async function (result) {
    let spamCompanies = result.spamCompanies;
    if (spamCompanies === undefined) {
      spamCompanies = [];
    }
    displayCompaniesList(spamCompanies);
  })
}

document.addEventListener('DOMContentLoaded', function () {
  initDsiplayCompanies();
});




