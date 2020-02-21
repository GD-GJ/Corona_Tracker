
function newVisitedArea(){
    var lat = $("#visitLat").val();
    var lng = $("#visitLng").val();
    var date = $("#visitDate").val();
    var time = $("#visitTime").val();
    
    var userPath = new path(date, time, "", "", lat, lng);
    save(userPath);
    console.log(userPath);
}


function save(item) {
	var visitedAreaArray = getStoreArray("visitedList");
	visitedAreaArray.push(item);
	localStorage.setItem("visitedList", JSON.stringify(visitedAreaArray));
}

function loadPaths() {
    var userPaths = getSavedItems();

	if (userPaths != null) {

        //test
        for(var path of userPaths){
            console.log(path)
        }
		//setMarker(userPaths);
	}
}
function getSavedItems() {
	return getStoreArray("visitedList");
}

function getStoreArray(key) {
    var visitedAreaArray = localStorage.getItem(key);
    
	if (visitedAreaArray == null || visitedAreaArray == "") {
		visitedAreaArray = new Array();
	}
	else {
		visitedAreaArray = JSON.parse(visitedAreaArray);
	}
	return visitedAreaArray;
}

function clearAll()
{
  //마커들을 모두 지우는 로직 추가해야함.

  var emptyList = new Array();
  localStorage.setItem("visitedList", JSON.stringify(emptyList));
}