var settingUrl = browser.runtime.setUninstallURL('https://google.com')

function idNewTagSearch(bookmarkItems) {
    for (item of bookmarkItems) {
        var rootID = item.id;

        var gettingTagsName = browser.bookmarks.getChildren(rootID);
        gettingTagsName.then(tagMaker);
    }
}

//searching for default speeddial bookmarks folder
var gettingID = browser.bookmarks.search({
    title: "speeddial"
});
gettingID.then(idNewTagSearch);

function tagMaker(children) {
    for (child of children) {
        if (child.type == "folder") {
            //console.log(child.title);

            var tagsLeft = document.getElementById("nav-tags-list-left");
            var tagsRight = document.getElementById("nav-tags-list-right");

            leftCount = tagsLeft.childElementCount; //getting number of elements for left tag list
            rightCount = tagsRight.childElementCount; //getting number of elements for right tag list

            if (leftCount == 0) {
                new_tag = document.createElement('li');
                tagsLeft.appendChild(new_tag);
            } else if (leftCount > rightCount) {
                new_tag = document.createElement('li');
                tagsRight.appendChild(new_tag);
            } else {
                new_tag = document.createElement('li');
                tagsLeft.appendChild(new_tag);
            }
            new_tag.setAttribute("class", "nav-tag-li");
            new_tag.setAttribute("id", child.title);
            new_tag.innerHTML = child.title;
        }
    }
    //listener for 'click' on nav element
    var navList = document.getElementsByClassName("nav-tag-li");
    for (var i = 0; i < navList.length; i++) {
        navList[i].addEventListener('click', tagSwitch, false);
    }

    function tagSwitch() {
        //console.log(this.id);
        for (var i = 0; i < navList.length; i++) {
            navList[i].classList.remove('active');
        }
        document.getElementById(this.id).classList.add('active');

        browser.storage.sync.set({
            defaultStorage: this.id
        })

        window.location.reload(false);
    }
}

var defaultStorage = browser.storage.sync.get("defaultStorage");

function idSet(result) {
    var forSearch = result.defaultStorage;
    if (forSearch == null) {
        let defaultSet = browser.storage.sync.set({
            defaultStorage: "speeddial"
        })
        defaultSet.then(idSet);
    } else {
        var gettingID = browser.bookmarks.search(forSearch);
        gettingID.then(idSearch);
    }
}

defaultStorage.then(idSet);

//searching for default speeddial bookmarks folder
function idSearch(bookmarkItems) {
    for (item of bookmarkItems) {
        console.log(item.title);
        defaultStorage = item.id;
        gettingChildren = browser.bookmarks.getChildren(defaultStorage);
        gettingChildren.then(storageBookmarks);
    }
}

function storageBookmarks(children) {
    var activeTag = browser.storage.sync.get("defaultStorage");
    activeTag.then(activeTagSet);

    for (child of children) {
        //console.log(child.title);
        //console.log(child.url);
        if (child.url) {
            cardMaker(child.url, child.title);
        }
    }
}

function activeTagSet(name) {
    //console.log(name.defaultStorage);
    if (name.defaultStorage != "speeddial") {
        document.getElementById(name.defaultStorage).classList.add('active');
    }
}

//var i = 0;
function cardMaker(url, title) {
    function cardMaking(size) {
        var activeTag = browser.storage.sync.get("defaultStorage");

        activeTag.then(activeTagSet);

        var card_title = document.createElement('div');
        var card_image = document.createElement('div');
        var clickable = document.createElement('a');

        clickable.setAttribute("class", "card-container");
        card_image.setAttribute("class", "card-image");
        card_title.setAttribute("class", "card-title")

        clickable.appendChild(card_image);
        clickable.appendChild(card_title);
        document.getElementById("bookmarks").appendChild(clickable);

        //getting favicons
        //var new_url = url.split('/');
        //var CLEAN_ICON_URL = new_url[1] + new_url[2] + '/';
        //faviconkit api + page url + size
        //var ICON_URL = 'https://api.faviconkit.com/' + CLEAN_ICON_URL + size.iconSize;

        clickable.href = url;
        card_title.innerHTML = title;
        //card_image.style.backgroundImage = 'url(' + ICON_URL +')';
    }

    var getting = browser.storage.sync.get([
        "iconSize"
    ]);
    getting.then(cardMaking);
}

//displaying basic settings menu
document.getElementById('user-button-settings').onclick = function showSidebar() {

    var box = document.getElementById("user-settings");

    if (box.style.display == "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }
}


function restoreOptions() {
    function setCurrentChoice(result) {
        document.documentElement.style.setProperty('--shadowColor', result.shadowColor);

        if (result.documentBgColor != "#fcfcfc" && result.documentBgColor != "#3d3d3d") {
            document.documentElement.style.setProperty('--shadowColor', "none");
        }
        document.documentElement.style.setProperty('--firstBgColor', result.firstBgColor);
        document.documentElement.style.setProperty('--firstTextColor', result.firstTextColor);
        document.documentElement.style.setProperty('--secondTextColor', result.secondTextColor);
        document.documentElement.style.setProperty('--activeColor', result.activeColor);
        document.documentElement.style.setProperty('--borderColor', result.borderColor);
        document.documentElement.style.setProperty('--btnBgBorderColor', result.btnBgBorderColor);
        document.documentElement.style.setProperty('--btnTextColor', result.btnTextColor);
        document.documentElement.style.setProperty('--btnShadowColor', result.btnShadowColor);
        document.documentElement.style.setProperty('--documentBgColor', result.documentBgColor);

        document.getElementById('bookmarks').style.gridGap = result.gridGap + 'px';
        document.getElementById('gridgap-current').innerHTML = result.gridGap + ' px';

        document.getElementById('iconsize-current').innerHTML = result.iconSize + ' px';
    }

    var getting = browser.storage.sync.get([
        "firstBgColor",
        "firstTextColor",
        "secondTextColor",
        "activeColor",
        "shadowColor",
        "btnBgBorderColor",
        "btnTextColor",
        "btnShadowColor",
        "gridGap",
        "iconSize",
        "documentBgColor",
        "borderColor"
    ]);
    getting.then(setCurrentChoice);
}

//changing and saving settings:
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById('btn-save').onclick = function savingSettings() {
    window.location.reload(false); //reloading page when settings are saved

    var solid_color = document.getElementsByName('solid-color');
    for (var i = 0; i < solid_color.length; i++) {
        if (solid_color[i].checked) {
            solid_color[i].setAttribute('checked', 'checked');
            browser.storage.sync.set({
                documentBgColor: solid_color[i].value
            });
        }
    }

    var gridgap = document.getElementById('gridgap').value;
    browser.storage.sync.set({
        gridGap: gridgap
    });

    var iconsize = document.getElementById('iconsize').value;
    browser.storage.sync.set({
        iconSize: iconsize
    });

    var darkmode = document.getElementById("darkmode");

    if (darkmode.checked == true) {
        browser.storage.sync.set({
            firstBgColor: "#212121",
            firstTextColor: "#fafafa",
            secondTextColor: "#bcbcbc",
            activeColor: "#f0f0f0",
            shadowColor: "#494949",
            borderColor: "#494949",
            btnBgBorderColor: "#383838",
            btnTextColor: "#fafafa",
            btnShadowColor: "#444444"
        });
    } else {
        browser.storage.sync.set({
            firstBgColor: "#fafafa",
            firstTextColor: "#333333",
            secondTextColor: "#8a8a8a",
            activeColor: "#3f3f3f",
            shadowColor: "#e9e9e9",
            borderColor: "#e9e9e9",
            btnBgBorderColor: "#333333",
            btnTextColor: "#fafafa",
            btnShadowColor: "#8a8a8a"
        });
    }
}

document.getElementById('gridgap').oninput = function changeGap() {
    document.getElementById('bookmarks').style.gridGap = this.value + 'px';
    document.getElementById('gridgap-current').innerHTML = this.value + ' px';
    //document.getElementById('spacingResult').innerHTML = this.value + 'px';
}

document.getElementById('iconsize').oninput = function changeIconSize() {
    var card_image = document.getElementsByClassName("card-image");
    /*for (var i = 0; i < card_image.length; i++) {
        var url = card_image[i].parentElement.href;
        var new_url = url.split('/');
        var CLEAN_ICON_URL = new_url[1] + new_url[2] + '/';
        //faviconkit api + page url + size
        var ICON_URL = 'https://api.faviconkit.com/' + CLEAN_ICON_URL + this.value;
        card_image[i].style.backgroundImage = 'url(' + ICON_URL +')';
    }*/
    document.getElementById('iconsize-current').innerHTML = this.value + ' px';
}

document.getElementById('btn-cancel').onclick = function showSidebar() {
    var box = document.getElementById("user-settings");
    box.style.display = "none";
}

//displaying menu for adding new bookmark or tag.
document.getElementById('user-button-add').onclick = function selectBookmarknTag() {
    var box = document.getElementById("user-add-select");

    if (box.style.display == "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }

}

//creating new tag via nav menu
document.getElementById('select-tag').onclick = function newTag() {
    /* displaying menu to create new tag */
    var box = document.getElementById("new-tag-content");
    if (box.style.display == "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }

    /* creating and saving new tag */
    document.getElementById('new-tag-create').onclick = function tagMaker() {

        var userInput = document.getElementById("new-tag-input").value;
        if (userInput.length != 0) {
            function idNewSearch(bookmarkItems) {
                for (item of bookmarkItems) {
                    //console.log(item.id);

                    function onCreated(node) {
                        box.style.display = "none";
                        window.location.reload(false);
                        //browser.storage.sync.set({ })
                    }

                    var createBookmark = browser.bookmarks.create({
                        title: userInput,
                        parentId: item.id
                    });

                    createBookmark.then(onCreated);
                    document.getElementById("new-tag-input").value = "";
                }
            }

            var gettingID = browser.bookmarks.search({
                title: "speeddial"
            });
            gettingID.then(idNewSearch);

        } else {
            var error = document.getElementsByClassName("input-error");
            error[0].style.display = "block";
        }
    }

    document.getElementById('new-tag-cancel').onclick = function tagCancel() {
        box.style.display = "none";
    }
}

//creating new bookmark via nav menu
document.getElementById('select-bookmark').onclick = function newTag() {
    /* displaying menu to create new tag */
    var box = document.getElementById("new-bookmark-content");
    if (box.style.display == "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }

    /* creating and saving new tag */
    document.getElementById('new-bookmark-create').onclick = function bookmarkMaker() {
        console.log(defaultStorage);

        var userInputName = document.getElementById("new-bookmark-input").value;
        var userInputURL = document.getElementById("new-bookmark-url-input").value;

        if (userInputName.length != "" && userInputURL.length != "") {

            function idNewSearch(bookmarkItems) {
                for (item of bookmarkItems) {
                    //console.log(item.id);

                    function onCreated(node) {
                        box.style.display = "none";
                        window.location.reload(false);
                        //browser.storage.sync.set({ })
                    }

                    var createBookmark = browser.bookmarks.create({
                        title: userInputName,
                        url: userInputURL,
                        parentId: item.id
                    });

                    createBookmark.then(onCreated);
                    document.getElementById("new-bookmark-input").value = "";
                    document.getElementById("new-bookmark-url-input").value = "";
                }
            }

            var defaultStorage = browser.storage.sync.get("defaultStorage");

            function idSearch(result) {
                var forSearch = result.defaultStorage;
                var gettingID = browser.bookmarks.search(forSearch);
                gettingID.then(idNewSearch);
            }

            defaultStorage.then(idSearch);

        } else {
            var error = document.getElementsByClassName("input-error");
            error[1].style.display = "block";
            console.log("w errorze");
        }
    }

    document.getElementById('new-bookmark-cancel').onclick = function tagCancel() {
        box.style.display = "none";
    }
}

/*document.getElementById('full-settings').onclick = function openFullSettings() {
    browser.runtime.openOptionsPage();
}*/