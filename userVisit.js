//새로운 유저 경로가 추가될 때
//기존 확진자의 동선과 겹치는 부분이 있는지 검사하는 함수입니다.
function checkMatched(userPath){
    const DANGER_ZONE = 100;

    for(let person of Datas){
        for(let path of person.paths){
            if(calcDistance(userPath.lat, userPath.lng, path.lat, path.lng) < DANGER_ZONE){
                //확진자의 방문지와 사용자의 방문지의 거리가 DANGER_ZONE 이하일경우
                console.log(userPath, path)
                console.log("유저가 다녀간 곳이 확진자의 이동 경로와 겹칩니다.")
                if(path.date == userPath.date){
                    //이동 동선이 겹치고 방문일도 겹칠경우
                    console.log("확진자가 이곳을 다녀간 시점에 유저도 거기에 있었습니다.")
                }
            }
        }
    }
}

function newVisitedArea(){
    let placeName = $("#placeName").val();
    let lat = $("#visitLat").val();
    let lng = $("#visitLng").val();
    let date = $("#visitDate").val();
    let time = $("#visitTime").val();

    console.log(placeName)
    //방문장소 지오코딩
    geocoder.addressSearch(placeName, function(result, status) {
        console.log(result);
        if (status === kakao.maps.services.Status.OK) {
            console.log("성공");
        }
    });

    let userPath = new path(date, time, placeName, "", lat, lng);
    checkMatched(userPath);
    save(userPath);
    console.log(userPath);
}

function calcDistance(lat1, lon1, lat2, lon2){
    let theta = lon1 - lon2;
    dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1))
        * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return Number(dist*1000).toFixed(2);
}

function deg2rad(deg) {
    return (deg * Math.PI / 180);
}
function rad2deg(rad) {
    return (rad * 180 / Math.PI);
}

//새로운 유저 경로를 추가하는 함수입니다.


//유저 경로를 로컬스토리지에 저장하는 함수입니다.
function save(item) {
	var visitedAreaArray = getStoreArray("visitedList");
	visitedAreaArray.push(item);
	localStorage.setItem("visitedList", JSON.stringify(visitedAreaArray));
}

//프로그램 초기 단계에서 유저 경로를 불러온는 함수입니다.
function loadPaths() {
    let userPaths = getSavedItems();

	if (userPaths != null) {

        //test
        for(var path of userPaths){
            console.log(path)
        }
		//setMarker(userPaths);
    }
}

//로컬스토리지에 있는 유저 경로를 반환하는 함수입니다.
function getSavedItems() {
	return getStoreArray("visitedList");
}


function getStoreArray(key) {
    let visitedAreaArray = localStorage.getItem(key);
    
	if (visitedAreaArray == null || visitedAreaArray == "") {
		visitedAreaArray = new Array();
	}
	else {
		visitedAreaArray = JSON.parse(visitedAreaArray);
	}
	return visitedAreaArray;
}

//로컬스토리지내 데이터를 지우는 함수입니다.
function clearAll()
{
  //마커들을 모두 지우는 로직 추가해야함.

  let emptyList = new Array();
  localStorage.setItem("visitedList", JSON.stringify(emptyList));
}

loadPaths();