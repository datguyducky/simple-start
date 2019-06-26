function settings() {
    var settingsBox = document.getElementById('headerSettings');

    if(settingsBox.style.display == "none"){
        settingsBox.style.display = "flex";
    }
    else{settingsBox.style.display = "none";}


    // option to change grid gap between thumbnails cards: 1-56px:
    var gridGap = document.getElementById('gridGap'); 
    gridGap.oninput = function() {
        document.getElementById('viewContent').style.gridGap = this.value +'px';
        document.getElementById('spacingResult').innerHTML = this.value + 'px';
    }

    // option to change header height (small - medium - big)
    var headerSize = document.getElementById('headerSize');
    var simperStartView = document.getElementById('simpleStartView');
    var headerResult = document.getElementById('headerResult');
    

    headerSize.oninput = function() {
        if(this.value == 1){
            settingsBox.style.top = "3vh";
            settingsBox.style.height = "97vh";
            simperStartView.style.gridTemplateRows = '3vh 1fr'; //setting small size
            headerResult.innerHTML =  "small";
        }

        else if(this.value == 2){ 
            settingsBox.style.top = "5vh";
            settingsBox.style.height = "95vh";
            simperStartView.style.gridTemplateRows = '5vh 1fr'; //setting medium size
            headerResult.innerHTML =  "medium";
        }

        else {
            settingsBox.style.top = "7vh";
            settingsBox.style.height = "93vh";
            simperStartView.style.gridTemplateRows = '7vh 1fr';//seting big size
            headerResult.innerHTML =  "big";
        }
    }

    // option to change number of columns: 2-7
    var columns = document.getElementById('contentColumns');
    var columnsResult = document.getElementById('columnsResult');
    
    columns.oninput = function() {
        document.getElementById('viewContent').style.gridTemplateColumns = "repeat(" + this.value + ", 1fr)";
        columnsResult.innerHTML = this.value;
        console.log(this.value);
    }
}