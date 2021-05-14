var btnPageAdd = document.getElementById("btnPageAdd");
var btnPageSearch = document.getElementById("btnPageSearch");

var pageAdd = document.getElementById("add-page");
var pageSearch = document.getElementById("search-page");
var pageLinks = document.getElementById("links-page");

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

var listFavs = [];
var listCategory = [];

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

    pageLinks.style.display = "nome";
}

function showSearchPage() {
    getFavs();
    pageAdd.style.display = "none";
    pageSearch.style.display = "block";

    pageLinks.style.display = "none";
}

function showLinksPage(categoryName) {
    pageAdd.style.display = "none";
    pageSearch.style.display = "none";

    document.getElementById("link-catg-name").innerHTML = categoryName;
    pageLinks.style.display = "block";
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
        var tempListFavs = result["STORAGE_KEY"].split("\n");

        listFavs = [];
        listCategory = [];
        for (var i = 0; i < tempListFavs.length; i++) {
            let element = JSON.parse(tempListFavs[i]);
            let category = element["category"];

            listFavs.push(element);
            if (!listCategory.includes(category)) {
                listCategory.push(category);
            }
        }


        populateSearchPage();
        //divCategoryContainer.innerHTML = listCategory;
    });
}

function populateSearchPage() {
    var divCategoryContainer = document.getElementById("category-container");
    divCategoryContainer.innerHTML = "";

    for (var i = 0; i < listCategory.length; i++) {
        let categoryName = listCategory[i];

        var categoryDiv = document.createElement("DIV");
        categoryDiv.id = "category" + i.toString();
        categoryDiv.classList.add("col-4");

        categoryDiv.innerHTML =
            '<div class="category-header">' +
            '<img src="assets/folder.png" height="30">' +
            '</div>' +
            '<div class="category-body">' +
            categoryName +
            '</div>';

        divCategoryContainer.appendChild(categoryDiv);

        document.getElementById("category" + i.toString()).addEventListener("click", function () {
            showListByCategory(categoryName);
        });
    }
}

function showListByCategory(categoryName) {
    populateLinkPage(categoryName);
    showLinksPage(categoryName);
}

function populateLinkPage(categoryName) {
    var divLinksContainer = document.getElementById("links-container");
    divLinksContainer.innerHTML = "";

    for (var i = 0; i < listFavs.length; i++) {
        var fav = listFavs[i];
        if (fav["category"] == categoryName) {
            //divLinksContainer.innerHTML += fav["url"];
            var linkDiv = document.createElement("DIV");
            linkDiv.id = "fav" + i.toString();

            linkDiv.classList.add("row");
            linkDiv.classList.add("justify-content-center");

            linkDiv.innerHTML =
                '<div class="row justify-content-center">' +
                '<div class="link-header col-2">' +
                '\'<img src="' + fav["iconUrl"] + '" class="sm-img">' +
                '</div>' +
                '<div class="link-body col-10">' +
                '<div class="row align-items-center">' +
                '<div class="col-9">' +
                '<div class="row link-title">' +
                fav["title"] +
                '</div>' +
                '<div class="row">' +
                fav["annotations"] +
                '</div>' +
                '</div>' +
                '<div class="col-3">' +
                '<div class="row align-items-center">' +
                '<div class="col-auto">' +
                '<a href="' + fav["url"] + '" target="_blank">' +
                '<img src="assets/link.png" width="20">' +
                '</a>' +
                '</div>' +
                '<div class="col-auto">' +
                '<button class="btn btn-nopadding">' +
                '<img src="assets/delete.png" width="20">' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            divLinksContainer.appendChild(linkDiv);

        }
    }
}