/*function onFulfilled(children) {
    for (child of children) {
      console.log(child.title);
      console.log(child.url);
    }
  }
  
  function onRejected(error) {
    console.log(`An error: ${error}`);
  }
  
  var gettingChildren = browser.bookmarks.getChildren("0IPq1lPQNUK7");
  gettingChildren.then(onFulfilled, onRejected);

  */
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
        console.log(child.title);
        console.log(child.url);

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

    clickable.href = url;
    card_title.innerHTML = title;
}
 
  


  
  /*
  function logItems(bookmarkItem, indent) {
    if (bookmarkItem.url) {
      console.log(bookmarkItem.url);
    } else {
      console.log("Folder: " + bookmarkItem.title);
      indent++;
    }
    if (bookmarkItem.children) {
      for (var child of bookmarkItem.children) {
        logItems(child, indent);
      }
    }
  }
  
  function logSubTree(bookmarkItems) {
    logItems(bookmarkItems[0], 0);
  }
  
  function onRejected(error) {
    console.log(`An error: ${error}`);
  }
   
  var subTreeID = "0IPq1lPQNUK7";
  
  var gettingSubTree = browser.bookmarks.getSubTree(subTreeID);
  gettingSubTree.then(logSubTree, onRejected);
  */