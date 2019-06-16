function settings() {
    var settingsBox = document.getElementById('headerSettings');

    if(settingsBox.style.display == "none"){
        settingsBox.style.display = "flex";
    }
    else{settingsBox.style.display = "none";}
}