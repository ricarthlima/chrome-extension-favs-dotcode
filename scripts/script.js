var btnPageAdd = document.getElementById("btnPageAdd");
var btnPageSearch = document.getElementById("btnPageSearch");

var pageAdd = document.getElementById("add-page");
var pageSearch = document.getElementById("search-page");

btnPageAdd.addEventListener("click", showAddPage);
btnPageSearch.addEventListener("click", showSearchPage);

var formTitle = document.getElementById("form-title");
var formCategory = document.getElementById("form-category");
var formAnnotations = document.getElementById("form-annotations");
var formButton = document.getElementById("form-sub-button");

formButton.addEventListener("click", saveFav);

var urlCurrent = "";
var urlIconCurrent = "";

var formTitle = document.getElementById("form-title");

window.onload = function () {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let title = tabs[0].title;
        formTitle.setAttribute("value", title);

        urlCurrent = tabs[0].url;
        urlIconCurrent = tabs[0].favIconUrl;
    });

    getFavs();
}

function showAddPage() {
    pageAdd.style.display = "block";
    pageSearch.style.display = "none";
}

function showSearchPage() {
    getFavs();
    pageAdd.style.display = "none";
    pageSearch.style.display = "block";
}

function saveFav() {
    var dict = {};
    dict = {
        "title": formTitle.value,
        "category": formCategory.value,
        "annotations": formAnnotations.value,
        "url": urlCurrent,
        "iconUrl": urlIconCurrent
    }

    var newJson = JSON.stringify(dict);

    chrome.storage.sync.get("STORAGE_KEY", function (result) {
        if (result["STORAGE_KEY"] != undefined) {
            newJson = result["STORAGE_KEY"] + "\n" + newJson;
        }

        chrome.storage.sync.set({ "STORAGE_KEY": newJson }, function () {
            console.log("Salvo com sucesso!");
            getFavs();
            showSearchPage();
        });
    });


}

function getFavs() {
    var divCategoryContainer = document.getElementById("category-container");
    chrome.storage.sync.get("STORAGE_KEY", function (result) {
        divCategoryContainer.innerHTML = result["STORAGE_KEY"];
    });
}