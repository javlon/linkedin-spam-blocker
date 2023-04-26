buttonApplyClr = document.getElementById("applybtnclr")
buttonApplyClr.addEventListener("click", (async () => {
    const response = await chrome.runtime.sendMessage({action: "apply", actiontype: "color"});
  }));

buttonApplyHd = document.getElementById("applybtnhd")
buttonApplyHd.addEventListener("click", (async () => {
    const response = await chrome.runtime.sendMessage({action: "apply", actiontype: "hide"});
  }));


buttonAdd = document.getElementById("addbtn")
buttonAdd.addEventListener("click", (async () => {
    var companyLogoId = document.getElementById("textfld");
    if(companyLogoId.value != ""){
        const response = await chrome.runtime.sendMessage({action: "add", companyLogoId: companyLogoId.value.trim()});
        console.log(response)
        if(response.status){
            companyLogoId.value = "";
        }
    }
  }));

buttonAddCrnt = document.getElementById("addbtncrnt")
buttonAddCrnt.addEventListener("click", (async () => {
    const response = await chrome.runtime.sendMessage({action: "addCurrent"});
    console.log(response)
}));
  


function addElement(companyLogoId) {
    var ul = document.getElementById("SClist");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(companyLogoId));
    ul.appendChild(li);
}


function displayCompaniesList(complaniesList){
    var myNode = document.getElementById("spamCompaniesId");
    myNode.innerHTML = "";
    var ul = document.createElement("ul");
    for(const companyLogoId of complaniesList){
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(companyLogoId));
        ul.appendChild(li);
    }
    myNode.appendChild(ul)
}


chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if(key == "spamCompanies"){
        displayCompaniesList(newValue)
      }
    }
  });

function initDsiplayCompanies(){
    chrome.storage.local.get(['spamCompanies'], async function (result) {
        let spamCompanies = result.spamCompanies
        if (spamCompanies === undefined) {
          spamCompanies = []
        }
        displayCompaniesList(spamCompanies)
      })
}

  document.addEventListener('DOMContentLoaded', function () {
    initDsiplayCompanies()
  });



  
