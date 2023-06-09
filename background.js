function applySpammers(spamCompanies, actiontype) {
  var search_results = document.getElementsByClassName("scaffold-layout__list-container")[0];

  spamCompanies = new Set(spamCompanies);

  var nodes = search_results.childNodes;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeName.toLowerCase() == 'li') {
      var companyDescription = nodes[i].getElementsByClassName("job-card-container__company-name");
      if (companyDescription.length == 0) {
        companyDescription = nodes[i].getElementsByClassName("job-card-container__primary-description");
        if (companyDescription.length == 0) {
          continue;
        }
      }
      var companyName = companyDescription[0].innerText.trim();
      if (spamCompanies.has(companyName)) {
        if (actiontype == "color") {
          nodes[i].style.background = '#333333';
        } else if (actiontype == "hide") {
          nodes[i].hidden = true;
        }
      }
    }
  }
}


function addCompanyToStorage(companyName) {
  chrome.storage.local.get(['spamCompanies'], async function (result) {
    let spamCompanies = result.spamCompanies;
    if (spamCompanies === undefined) {
      spamCompanies = [];
    }
    if (!spamCompanies.includes(companyName)) {
      spamCompanies.push(companyName);
      chrome.storage.local.set({ spamCompanies: spamCompanies }, function () { });
    }
  })
}


function deleteCompanyFromStorage(companyName) {
  console.log("Removing company name: ", companyName)
  chrome.storage.local.get(['spamCompanies'], async function (result) {
    let spamCompanies = result.spamCompanies;
    if (spamCompanies === undefined) {
      spamCompanies = [];
    }
    if (spamCompanies.includes(companyName)) {
      spamCompanies = spamCompanies.filter(e => e !== companyName);
      // spamCompanies.splice(spamCompanies.indexof(companyName), 1)
      // spamCompanies.push(companyName);
      chrome.storage.local.set({ spamCompanies: spamCompanies }, function () { });
    }
  })
}


function addCurrentCompany() {
  var companyName = document.getElementsByClassName("jobs-unified-top-card__company-name")[0].getElementsByTagName("a")[0].innerText
  // addCompanyToStorage(companyName)
  chrome.storage.local.get(['spamCompanies'], async function (result) {
    let spamCompanies = result.spamCompanies;
    if (spamCompanies === undefined) {
      spamCompanies = [];
    }
    if (!spamCompanies.includes(companyName)) {
      spamCompanies.push(companyName);
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
      null;
    } else if (request.action === "apply") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.get(['spamCompanies'], async function (result) {

          let spamCompanies = result.spamCompanies;
          if (spamCompanies === undefined) {
            spamCompanies = [];
          }
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            args: [spamCompanies, request.actiontype],
            function: applySpammers
          });

        });
      });
      sendResponse({ status: "Done!" });
    } else if (request.action === "add") {
      addCompanyToStorage(request.companyName);
      sendResponse({ status: true, text: "Company added to block list!" });
    } else if (request.action === "delete") {
      deleteCompanyFromStorage(request.companyName);
      sendResponse({ status: true, text: "Company deleted from block list!" });
    } else if (request.action === "addCurrent") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: addCurrentCompany
        });
      });
    }
  }
);
