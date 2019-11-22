feather.replace();
//clearing storage 
//var clearing = browser.storage.sync.clear();

//function to search for folders or bookmarks id's - that is needed to make, delete, edit or search for bookmark/folder.
function idSearch(bookmarkItems) {
	for (item of bookmarkItems) {
		//making sure that we will get folder.
		if (!item.url) {
			return item.id;
		} else {
			//console.log(item.title);
		}
	}
}

//searching for default extension folder, if not found - create it.
var defaultStorage = browser.bookmarks.search("simplestart");
defaultStorage.then(idSearch).then(function (res) {
	//getting all folders and bookmarks inside default folder.
	if (res) {
		gettingChildren(res);
	}
	//creating default folder if wasn't found; making default styles in storage space ;refreshing page so script can get id of it.
	else {
		browser.bookmarks.create({
			title: "simplestart"
		});

		browser.storage.sync.set({
			firstBgColor: "#fafafa",
			firstTextColor: "#333333",
			secondTextColor: "#8a8a8a",
			activeColor: "#3f3f3f",
			shadowColor: "#e9e9e9",
			borderColor: "#e9e9e9",
			btnBgBorderColor: "#333333",
			btnTextColor: "#fafafa",
			btnShadowColor: "#8a8a8a",
			activeGroup: "Default group"
		});

		window.location.reload(false);
	}
});

//getting an array of items inside folder with specified id.
function childrenLog(children) {
	for (child of children) {
		return children;
	}
}

//
function gettingChildren(ROOT_ID) {
	var gettingChildren = browser.bookmarks.getChildren(ROOT_ID);
	gettingChildren.then(childrenLog).then(function (res) {
		groupMaker(res);
		bookmarksForActive(res);
	});
}

//creating groups which names are showed on navbar.
function groupMaker(children) {
	if(!children) {
		//making default group after first extension launch
		var defaultStorage = browser.bookmarks.search("simplestart");
		//getting id of defaultStorage
		defaultStorage.then(idSearch).then(function (res) {
			function onCreated(node) {
				//setting just created group as active one
				browser.storage.sync.set({
					activeGroup: node.id
				})
			}
			
			//creating folder for default group
			var createFirstgroup = browser.bookmarks.create({
				title: "Default group",
				parentId: res
			});

			createFirstgroup.then(onCreated);

			window.location.reload(false);
		})
	} else {

		for (i = 0; i < children.length; i++) {
			if (children[i].type == 'folder') {
				//console.log(children[i].title);
				//getting all elements on left and right of header on navbar.
				var groupsLeft = document.getElementById("nav-groups-list-left");
				var groupsRight = document.getElementById("nav-groups-list-right");
	
				leftCount = groupsLeft.childElementCount; //getting number of groups on left side of header.
				rightCount = groupsRight.childElementCount; //getting number of groups on right side of header.
	
				//first group is always created on left side.
				if (leftCount == 0) {
					new_group = document.createElement('li');
					groupsLeft.appendChild(new_group);
				} else if (leftCount > rightCount) {
					new_group = document.createElement('li');
					groupsRight.appendChild(new_group);
				} else {
					new_group = document.createElement('li');
					groupsLeft.appendChild(new_group);
				}
				new_group.setAttribute("class", "nav-group-li");
				//making element id is as same as name of folder is created for. Easier to get id of it for Firefox Api by this way.
				new_group.setAttribute("id", children[i].title);
				new_group.innerHTML = children[i].title;
			}
		}
	
		var navList = document.getElementsByClassName("nav-group-li");
		for (var i = 0; i < navList.length; i++) {
			//listening for click on one of the groups that're shown on navbar.
			navList[i].addEventListener('click', groupSwitch, false);
		}
	
		function groupSwitch() {
			//saving name of group that is set as active. Using it to remember which group is selected as active every time that page is reloaded.
			browser.storage.sync.set({
				activeGroup: this.id
			})
	
			//realoding page to show bookmarks-cards for active group + to show which group is active on navbar  .
			window.location.reload(false);
		}
	}
}

//getting name of selected group and assigning active class to it + getting id of it.
function bookmarksForActive(children) {
	var activeGroup = browser.storage.sync.get("activeGroup");
	//function addActiveClass is used to assign active class to selected group + returns name of it.
	activeGroup.then(addActiveClass).then(function (res) {
		var activeGroupName = res;
		for (i = 0; i < children.length; i++) {
			//loop for all elements inside folder, checking if names is same as name of active group.
			if (activeGroupName == children[i].title) {
				//if yes - sending id of it to cardMaker function.
				cardMaker(children[i].id);
			}
		}
	});
}

//assign active class to selected group by user. Return name of it.
function addActiveClass(name) {
	if (name.activeGroup != "simplestart") {
		document.getElementById(name.activeGroup).classList.add('active');
		return name.activeGroup;
	}
}

//logging items inside currently active group, creating bookmark-cards.
function cardMaker(activeID) {
	//logging items inside currently active group.
	var gettingChildren = browser.bookmarks.getChildren(activeID);
	gettingChildren.then(childrenLog).then(function (res) {
		createCard(res);
	});

	function createCard(children) {
		//checking if there're any bookmarks inside currently selected group (folder).
		if (!children) {
			console.log("no bookmarks were find");
			const NO_CHILD = document.createElement('p');
			
			document.getElementById('bookmarks').appendChild(NO_CHILD)
			.innerHTML = "Click '+' on navigation (top-right corner) to create new bookmark or save bookmark into 'simplestart' folder by any other method!";
		
			NO_CHILD.setAttribute('id', 'new');
			document.getElementById('bookmarks').style.display = "flex";
		} else {
			//loop for every item and making bookmark-card for it.
			for (i = 0; i < children.length; i++) {
				//making sure is a bookmark, not folder or something else.
				if (children[i].type == 'bookmark') {
					let title = children[i].title; //item title.
					let url = children[i].url; //item url.
					//console.log(url, title);

					var card_title = document.createElement('div'); //here name of bookmark is stored.
					var card_image = document.createElement('div'); //here goes favicon of site.
					var clickable = document.createElement('a'); //making whole card clickable which sends back to site which we have bookmarked.

					//assigning appropriate classes to elements.
					clickable.setAttribute("class", "card-container");
					card_image.setAttribute("class", "card-image");
					card_title.setAttribute("class", "card-title")

					clickable.appendChild(card_image);
					clickable.appendChild(card_title);
					document.getElementById("bookmarks").appendChild(clickable);

					//getting favicons
					var new_url = url.split('/');
					var CLEAN_ICON_URL = new_url[1] + new_url[2];
					//api + page url without https and other shit
					var ICON_URL = 'https://simplestart-favicon-service.herokuapp.com/icon?url=' + CLEAN_ICON_URL + '&size=32..120..250';

					clickable.href = url;
					card_title.innerHTML = title;
					card_image.style.backgroundImage = 'url(' + ICON_URL +')';
				}
			}
		}
	}
}

//displaying basic settings menu.
document.getElementById('user-button-settings').onclick = function () {
	var box = document.getElementById("user-settings");

	if (box.style.display == "flex") {
		box.style.display = "none";
	} else {
		box.style.display = "flex";
	}
}

//hiding basic settings menu when 'cancel' inside of it is clicked.
document.getElementById('btn-cancel').onclick = function () {
	var box = document.getElementById("user-settings");
	box.style.display = "none";
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

//real-time preview of changing gap size.
document.getElementById('gridgap').oninput = function () {
	document.getElementById('bookmarks').style.gridGap = this.value + 'px';
	document.getElementById('gridgap-current').innerHTML = this.value + ' px';
}

//displaying menu with button to create new bookmark or group.
document.getElementById('user-button-add').onclick = function selectBookmarkngroup() {
	var box = document.getElementById("user-add-select");

	if (box.style.display == "flex") {
		box.style.display = "none";
	} else {
		box.style.display = "flex";
	}
}

//creating new group via nav menu.
document.getElementById('select-group').onclick = function newgroup() {
	//displaying/hiding new group creator.
	var box = document.getElementById("new-group-content");
	if (box.style.display == "flex") {
		box.style.display = "none";
	} else {
		box.style.display = "flex";
	}

	//creating and saving new group 
	document.getElementById('new-group-create').onclick = function () {
		//getting what user typed.
		var userInput = document.getElementById("new-group-input").value;
		//checking if name user type is at least 1 long.
		if (userInput.length != 0) {
			function groupCreator(bookmarkItems) {
				for (item of bookmarkItems) {
					function onCreated() {
						window.location.reload(false); //refreshing page. Menus are hidden again because of it + group can be seen on navbar.
						browser.storage.sync.set({
							activeGroup: userInput
						}) //setting freshly created bookmark as active group.
					}

					var createBookmark = browser.bookmarks.create({
						//name of new group.
						title: userInput,
						//making sure that this group (folder) is created inside default extension folder.
						parentId: item.id
					});

					createBookmark.then(onCreated);
					document.getElementById("new-group-input").value = ""; //resetting value of group creator input.
				}
			}

			//trying to get id of default extension folder, so the new group (folder) is created inside of it.
			var gettingID = browser.bookmarks.search({
				title: "simplestart"
			});
			gettingID.then(groupCreator);

		} else {
			//displaying error when group name is not at least 1 character long
			var error = document.getElementsByClassName("input-error");
			error[0].style.display = "block";
		}
	}

	//hidding group creator when 'x' is clicked
	document.getElementById('new-group-cancel').onclick = function () {
		box.style.display = "none";
	}
}

//creating new bookmark via nav menu.
document.getElementById('select-bookmark').onclick = function newgroup() {
	//displaying/hiding new bookmark creator.
	var box = document.getElementById("new-bookmark-content");
	if (box.style.display == "flex") {
		box.style.display = "none";
	} else {
		box.style.display = "flex";
	}

	//creating and saving new bookmark
	document.getElementById('new-bookmark-create').onclick = function () {
		//getting name of bookmark that user typed.
		var userInputName = document.getElementById("new-bookmark-input").value;
		//getting url of site that user typed.
		var userInputURL = document.getElementById("new-bookmark-url-input").value;

		//checking if name and url are not empty.
		if (userInputName.length != "" && userInputURL.length != "") {
			//using regex to be sure that website url starts with 'http://' or 'https://'. Firefox API won't let create new bookmark without it.
			let re = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
			//if user didn't typed 'http' or 'https' when creating new bookmark, then we will do that for him.
			if(re.exec(userInputURL) == null){userInputURL = 'http://' + userInputURL} //using 'http' here to be sure that every website works.
			
			function bookmarkCreator(bookmarkItems) {
				for (item of bookmarkItems) {
					function onCreated() {
						window.location.reload(false); //refreshing page. Menus are hidden again because of it + freshly created bookmark have her own card.
					}

					var createBookmark = browser.bookmarks.create({
						title: userInputName,
						url: userInputURL,
						//making sure that bookmark is created inside currently active group.
						parentId: item.id
					});

					//resetting values for bookmark creator inputs.
					createBookmark.then(onCreated);
					document.getElementById("new-bookmark-input").value = "";
					document.getElementById("new-bookmark-url-input").value = "";
				}
			}

			//getting id for currently selected group.
			function idSearch(result) {
				var forSearch = result.activeGroup;
				var gettingID = browser.bookmarks.search(forSearch);
				gettingID.then(bookmarkCreator);
			}

			//getting name of currently active group from storage.
			var defaultStorage = browser.storage.sync.get("activeGroup");
			defaultStorage.then(idSearch);

		} else {
			//displaying error if name or url of bookmark is empty.
			var error = document.getElementsByClassName("input-error");
			error[1].style.display = "block";
			console.log("empty name or url!");
		}
	}

	//hidding bookmark creator when 'x' is clicked
	document.getElementById('new-bookmark-cancel').onclick = function () {
		box.style.display = "none";
	}
}

//forwarding user to this url when extenstion was uninstalled.
