var userLat,
    userLng;

//새로운 유저 경로가 추가될 때
//기존 확진자의 동선과 겹치는 부분이 있는지 검사하는 함수입니다.
function checkMatched(userPath){
    //위험지역 : 반경 500m
    const DANGER_ZONE = 500;
    const TIME_DANGER_LEVEL_1 = 6*60;       //6시간
    const TIME_DANGER_LEVEL_2 = 24*60;      //하루
    const TIME_DANGER_LEVEL_3 = 7*24*60;    //1주일

    let group_by_level = new Array();
    let level1 = new Array();
    let level2 = new Array();
    let level3 = new Array();
    let level4 = new Array();
    group_by_level.push(level1, level2, level3, level4);


    for(let person of Datas){
        for(let path of person.paths){

            let inNearBy = false;
            let inSamePlace = false;

            // 장소 검증
            if(calcDistance(userPath.lat, userPath.lng, path.lat, path.lng) <= DANGER_ZONE){
                //사용자의 방문지와 확진자의 방문지 거리가 DANGER_ZONE 이하일경우
                inNearBy = true;

            }else if(userPath.name == path.name){
                //동일한 장소에 간 경우.
                inSamePlace = true;
            }

            //시간 검증
            if(inNearBy || inSamePlace){
                let timeDiff = timeDiff2Min(userPath, path);
                if(timeDiff < 0){
                    //음수일경우 고려x
                    break;
                }

                let DangerLevel;
                if(timeDiff < TIME_DANGER_LEVEL_1){
                    // 6시간 이내로 동선이 겹칠경우
                    DangerLevel = 0;
                }else if(timeDiff < TIME_DANGER_LEVEL_2){
                    // 6시간 ~ 하루 이내로 동선이 겹칠경우
                    DangerLevel = 1;
                }else if(timeDiff < TIME_DANGER_LEVEL_3){
                    // 하루 ~ 일주일 이내로 동선이 겹칠경우
                    DangerLevel = 2;
                }else{
                    // 일주일 ~ 이상으로 동선이 겹칠경우
                    DangerLevel = 3;
                }
                group_by_level[DangerLevel].push(path);
            }
        }
    }

    for(let level in group_by_level){
        console.log(level);
        for(let path of group_by_level[level]){
            console.log(path);
        }
    }
}

//유저 시간 - 대상 시간을 분단위로 리턴하는 함수.
//음수일경우 확진자가 다녀가기 전에 유저가 방문한 경우이므로 고려하지않음
function timeDiff2Min(user, target){
    //유저 시간 -> 분
    let uDateArray = user.date.split("-");
    let userHour = Number(user.time.substring(0, 2));
    let userMin = Number(user.time.substring(2, 4));
    let userDate = new Date(uDateArray[0], Number(uDateArray[1]) -1, uDateArray[2], userHour, userMin);

    //대상 시간 -> 분
    var tDateArray = target.date.split("-");
    var targetHour = Number(target.time.substring(0, 2));
    var targetMin = Number(target.time.substring(2, 4));
    var targetDate = new Date(tDateArray[0], Number(tDateArray[1]) -1, tDateArray[2], targetHour, targetMin);

    //유저 시간 - 대상 시간
    let timeDiff2Min = (userDate.getTime() - targetDate.getTime())/1000/60;
    return timeDiff2Min;
}

function setUserLatLng(lat, lng){
    userLat = Number(lat);
    userLng = Number(lng);
}

//새로운 사용자 경로를 추가하는 함수.
function newVisitedArea(){
    let placeName = $("#placeName").val();
    let date = $("#visitDate").val();
    let time = $("#visitTime").val();
    let method = $("#visitMethod").val();

    let userPath = new path(date, time, placeName, method, userLat, userLng);
    checkMatched(userPath);
    save(userPath);

    //테스트코드. 로직 최적화할것
    //drawPaths(userPaths);
}

//두 위치 사이의 거리를 반환하는 함수.
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


//유저 경로를 로컬스토리지에 저장하는 함수입니다.
function save(item) {
    var visitedAreaArray = getStoreArray("visitedList");
    
    //경로들을 시간순으로 정렬해서 저장한다.
    let i;
    for(i = 0; i < visitedAreaArray.length; i++){
        let timeDiff = timeDiff2Min(item, visitedAreaArray[i]);
        if(timeDiff < 0 ){
            break;
        }else if(timeDiff == 0){
            alert("이미 동일한 시간대에 경로가 존재합니다.");
        }
    }
    visitedAreaArray.splice(i, 0, item);

	localStorage.setItem("visitedList", JSON.stringify(visitedAreaArray));
}

//프로그램 초기 단계에서 유저 경로를 불러온는 함수입니다.
function loadUserPaths() {
    let userPaths = getSavedItems();

	if (userPaths != null) {
        drawPaths(userPaths);
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
	} else {
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
