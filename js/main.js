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
    card_image.style.backgroundImage = 'url(' + ICON_URL +')';
}