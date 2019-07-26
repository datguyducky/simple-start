var defaultStorage = " ";

function idSearch(bookmarkItems) {
    for (item of bookmarkItems) {
        console.log(item.id);
        defaultStorage = item.id;
        gettingChildren = browser.bookmarks.getChildren(defaultStorage);
        gettingChildren.then(storageBookmarks, onRejected);
    }
  }
  
  function onRejected(error) {
    console.log(`An error: ${error}`);
  }
  
  var gettingID = browser.bookmarks.search({title : "speeddial"});
  gettingID.then(idSearch, onRejected);

  
function storageBookmarks(children) {
    for (child of children) {
        //console.log(child.title);
        //console.log(child.url);

        cardMaker(child.url, child.title);
    }
}

function cardMaker(url, title) {
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
    //var CLEAN_ICON_URL = new_url[0] + '//' + new_url[1] + new_url[2] + '/';
    //var ICON_URL = 'https://besticon-demo.herokuapp.com/icon?url=' + CLEAN_ICON_URL + '&size=80';

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
        document.getElementsByTagName("body")[0].style.backgroundColor = result.bgColor;
        document.getElementById("nav").style.backgroundColor = result.navColor;
        document.getElementById("nav").style.color = result.textColor;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get(["bgColor", "navColor", "textColor"]);
    getting.then(setCurrentChoice, onError);
  }

//changing and saving settings:
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById('btn-save').onclick = function savingSettings() {
    var dark = document.getElementById("dark-chk");

    window.location.reload(false); //reloading page when settings are saved
    
    if(dark.checked == true) {
        console.log("weszlo?");
        browser.storage.sync.set({
            bgColor: "#363333",
            navColor: "#272121",
            textColor: "#fafafa"
          });
    }
    else{
        browser.storage.sync.set({
            bgColor: "#fcfcfc",
            navColor: "#fafafa",
            textColor: "#333333"
          });
    }
}