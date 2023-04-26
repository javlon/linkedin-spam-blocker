function applySpammers(spamCompanies, actiontype) {
  console.log("In color spammers")
  var search_results = document.getElementsByClassName("scaffold-layout__list-container")[0];
  
  console.log(spamCompanies.length);
  spamCompanies = new Set(spamCompanies);

  var nodes = search_results.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeName.toLowerCase() == 'li') {
      var imgs = nodes[i].getElementsByTagName("img");
      if(imgs.length == 0){
        continue;
      }
      var imgtag = imgs[0];
      if(!imgtag.hasAttribute("alt")){
        console.log(nodes[i]);
      }
      imgtag = imgtag.alt.trim();
      if (spamCompanies.has(imgtag.substring(0, imgtag.length - 5).trim())) {
        if(actiontype == "color"){
          nodes[i].style.background = '#333333';
        }else if(actiontype == "hide"){
          nodes[i].hidden = true;
        }
      }
    }
  }
}


function addCompanyToStorage(companyName){
  chrome.storage.local.get(['spamCompanies'], async function (result) {
    let spamCompanies = result.spamCompanies
    if (spamCompanies === undefined) {
      spamCompanies = []
    }
    console.log(spamCompanies)
    if(!spamCompanies.includes(companyName)){
      spamCompanies.push(companyName)
      chrome.storage.local.set({ spamCompanies: spamCompanies }, function () { });
    }
  })
}


function addCurrentCompany(){
  var companyName = document.getElementsByClassName("jobs-unified-top-card__company-name")[0].getElementsByTagName("a")[0].innerText
  // addCompanyToStorage(companyName)
  chrome.storage.local.get(['spamCompanies'], async function (result) {
    let spamCompanies = result.spamCompanies
    if (spamCompanies === undefined) {
      spamCompanies = []
    }
    console.log(spamCompanies)
    if(!spamCompanies.includes(companyName)){
      spamCompanies.push(companyName)
      chrome.storage.local.set({ spamCompanies: spamCompanies }, function () { });
    }
  })
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (sender.tab) {
      null
    } else if (request.action === "apply") {
      console.log("I'm in apply")
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.get(['spamCompanies'], async function (result) {

          let spamCompanies = result.spamCompanies
          if (spamCompanies === undefined) {
            spamCompanies = []
          }
          console.log(spamCompanies)
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            args: [spamCompanies, request.actiontype],
            function: applySpammers
          });

        })
      });
      sendResponse({ status: "Done!" });
    } else if (request.action === "add") {
      console.log("I'm in add")
      console.log(request.companyLogoId)
      addCompanyToStorage(request.companyLogoId)
      sendResponse({status: true, text: "Company added to block list!"});
    } else if(request.action === "addCurrent"){
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: addCurrentCompany
        });
      })
    }
  }
);


// var black_list_companies = new Set([
  //   "Belmont Lavan", 
  //   "PASQAL", 
  //   "Jobs for Humanity", 
  //   "Magno IT Recruitment", 
  //   "SpenglerFox", 
  //   "TST Poland Sp Z o o",
  //   "Opus Recruitment Solutions",
  //   "Harnham",
  //   "Tribe28",
  //   "Cititec",
  //   "Amicus",
  //   "Hamlyn Williams",
  //   "Spectrum Search",
  //   "Signify Technology",
  //   "JBAndrews",
  //   "European Recruitment",
  //   "g2 Recruitment",
  //   "Luke Recruitment",
  //   "HUMANCAPiTAL BV",
  //   "That Recruitment Company",
  //   "LT Harper - Cyber Security Recruitment",
  //   "Parallel Consulting",
  //   "TradingHub",
  //   "GCS Financial Services"
  // ])