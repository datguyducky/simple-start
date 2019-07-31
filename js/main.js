//var defaultStorage = " ";

function idSearch(bookmarkItems) {
    for (item of bookmarkItems) {
        console.log(item.id);
        defaultStorage = item.id;
        gettingChildren = browser.bookmarks.getChildren(defaultStorage);
        gettingChildren.then(storageBookmarks);
    }
  }
  
  var gettingID = browser.bookmarks.search({title : "speeddial"}); //searching for default speeddial bookmarks folder
  gettingID.then(idSearch);

  
function storageBookmarks(children) {
    for (child of children) {
        //console.log(child.title);
        //console.log(child.url);
        cardMaker(child.url, child.title);
    }
}

//var i = 0;
function cardMaker(url, title) {
    /*i++;
    if(i==1){
        var clickable = document.createElement('a');
        var headerAdd = document.createElement('h1');
    
        clickable.setAttribute("class", "card-container");
        clickable.setAttribute("id", "bookmarks-add-content");
        headerAdd.setAttribute("id", "bookmarks-add");
        
        clickable.appendChild(headerAdd);
        document.getElementById("bookmarks").appendChild(clickable);
    }*/

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
    //var ICON_URL = 'https://api.faviconkit.com/' + CLEAN_ICON_URL + '64';

    clickable.href = url;
    card_title.innerHTML = title;
    //card_image.style.backgroundImage = 'url(' + ICON_URL +')';
}

//displaying basic settings menu
document.getElementById('user-button-settings').onclick = function changeContent() {

    var box = document.getElementById("user-settings");

    if(box.style.display == "flex") {
        box.style.display = "none";
    }
    else{box.style.display = "flex";}
}

  
function restoreOptions() { 
    function setCurrentChoice(result) {
        document.documentElement.style.setProperty('--darkColor', result.navColor);
        document.documentElement.style.setProperty('--headerColor', result.textColor);
        document.documentElement.style.setProperty('--secondaryTextColor', result.secondaryTextColor);
        document.documentElement.style.setProperty('--activeColor', result.activeColor);
        document.documentElement.style.setProperty('--shadowColor', result.shadowColor);
        document.documentElement.style.setProperty('--lighterColor', result.bgColor);
    }

    var getting = browser.storage.sync.get(["bgColor", "navColor", "textColor", "secondaryTextColor", "activeColor", "shadowColor"]);
    getting.then(setCurrentChoice);
  }

//changing and saving settings:
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById('btn-save').onclick = function savingSettings() {
    var thumb = document.getElementById("thumb-chk");
    var compact = document.getElementById("compact-chk");
    var list = document.getElementById("list-chk");
    
    var dark = document.getElementById("dark-chk");

    browser.storage.sync.set({
        //viewStyle: "chuj"
    })

    window.location.reload(false); //reloading page when settings are saved
    
    if(dark.checked == true) {
        browser.storage.sync.set({
            bgColor: "#3d3d3d",
            navColor: "#212121",
            textColor: "#fafafa",
            secondaryTextColor: "#bcbcbc",
            activeColor: "#f0f0f0",
            shadowColor: "#494949"
          });
    }
    else {
        browser.storage.sync.set({
            bgColor: "#fcfcfc",
            navColor: "#fafafa",
            textColor: "#333333",
            secondaryTextColor: "#8a8a8a",
            activeColor: "#3f3f3f",
            shadowColor: "#e9e9e9"
          });
    }

    if(thumb.checked == true) {
        console.log("thumb");
    }
    else if(compact.checked == true) {
        console.log("compact");
    }
    else if(list.checked == true) {
        console.log("list");
    }
}

//displaying menu for adding new bookmark or tag.
document.getElementById('user-button-add').onclick = function selectBookmarknTag() {
    var box = document.getElementById("user-add-select");

    if(box.style.display == "flex") {
        box.style.display = "none";
    }
    else{box.style.display = "flex";}

}

//creating new tag
document.getElementById('select-tag').onclick = function newTag() {
    /* displaying menu to create new tag */
    var box = document.getElementById("new-tag-content");
    if(box.style.display == "flex") {box.style.display = "none";}
    else{box.style.display = "flex";}

    /* creating and saving new tag */
    document.getElementById('new-tag-create').onclick = function tagMaker() {

        var userInput = document.getElementById("new-tag-input").value;

        function idNewSearch(bookmarkItems) {
            for (item of bookmarkItems) {
                //console.log(item.id);

                function onCreated(node) {
                    console.log(node);
                    box.style.display = "none";
                    //browser.storage.sync.set({ })
                }

                var createBookmark = browser.bookmarks.create({
                    title: userInput,
                    parentId: item.id
                });

                createBookmark.then(onCreated);
            }
        }
        
        var gettingID = browser.bookmarks.search({title : "speeddial"});
        gettingID.then(idNewSearch);


        /*function onCreated(node) {
            console.log(node);
        }
        
        var createBookmark = browser.bookmarks.create({
            title: userInput,
            parentId: ""
        });
        
        createBookmark.then(onCreated);
        */
    }
}
  
/*
  
  var gettingChildren = browser.bookmarks.getChildren("0IPq1lPQNUK7");
  gettingChildren.then(onFulfilled, onRejected);*/

function idNewTagSearch(bookmarkItems) {
    for (item of bookmarkItems) {
        var rootID = item.id;

        var gettingTagsName = browser.bookmarks.getChildren(rootID);
        gettingTagsName.then(tagMaker);
    }
}

var gettingID = browser.bookmarks.search({title : "speeddial"}); //searching for default speeddial bookmarks folder
gettingID.then(idNewTagSearch);

function tagMaker(children) {
    for (child of children) {
      if(child.type == "folder"){
        console.log(child.title);

        var tagsLeft = document.getElementById("nav-tags-list-left");
        var tagsRight = document.getElementById("nav-tags-list-right");
        
        leftCount = tagsLeft.childElementCount; //getting number of elements for left tag list
        rightCount = tagsRight.childElementCount; //getting number of elements for right tag list

        if(leftCount == 0){
            new_tag = document.createElement('li');
            tagsLeft.appendChild(new_tag);

            new_tag.innerHTML = child.title;
        }
        else if(leftCount>rightCount){
            new_tag = document.createElement('li');
            tagsRight.appendChild(new_tag);

            new_tag.innerHTML = child.title;
        }
        else{
            new_tag = document.createElement('li');
            tagsLeft.appendChild(new_tag);

            new_tag.innerHTML = child.title;
        }

        /*var card_title = document.createElement('div');
        var card_image = document.createElement('div');
        var clickable = document.createElement('a');
    
        clickable.setAttribute("class", "card-container");
        card_image.setAttribute("class", "card-image");
        card_title.setAttribute("class", "card-title")
        
        clickable.appendChild(card_image);
        clickable.appendChild(card_title);
        document.getElementById("bookmarks").appendChild(clickable);*/

      }
    }
}



//testing area
//I. make this shit fully working - so i can get folder id by calling this function from anywhere in code;
//var x = searchBox("speeddial");
//console.log(x);
//searchBox("Home") //02O1xwmFROj9;

/*function searchBox(name) {
    var thisID = "ala";
    function newID(bookmarkItems) {
        for (item of bookmarkItems) {
            thisID = item.id;
            console.log(item.title);
            //return thisID;
        }
    }
    var searching = browser.bookmarks.search({title : name});
    searching.then(newID);
}*/