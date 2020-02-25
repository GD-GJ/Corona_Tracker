var userLat,
    userLng;
var User;
var searchTarget;
var matchedPatient = new Array();
var displayed = new Array();

const DESCRIPTION = ['6시간 이내', '하루 이내', '1주일 이내' ,'1주일 이상', '시간정보가 없는 동선입니다'];

//새로운 유저 경로가 추가될 때
//기존 확진자의 동선과 겹치는 부분이 있는지 검사하는 함수입니다.
function checkMatched(userPath){
    //위험지역 : 반경 3000m
    const DANGER_ZONE = 3000;
    const TIME_DANGER_LEVEL_1 = 6*60;       //6시간
    const TIME_DANGER_LEVEL_2 = 24*60;      //하루
    const TIME_DANGER_LEVEL_3 = 7*24*60;    //1주일
    
    var group_by_level = new Array();
    let level1 = new Array();
    let level2 = new Array();
    let level3 = new Array();
    let level4 = new Array();
    let level5 = new Array();
    group_by_level.push(level1, level2, level3, level4, level5);

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
                let DangerLevel;

                let timeDiff;
                if(path.time == null){
                    //시간데이터 없을경우에는 일수만 계산한다
                    let uDateArray = userPath.date.split("-");
                    let userDate = new Date(uDateArray[0], Number(uDateArray[1]) -1, uDateArray[2]);

                    let tDateArray = path.date.split("-");
                    let targetDate = new Date(tDateArray[0], Number(tDateArray[1]) -1, tDateArray[2]);

                    timeDiff = (userDate.getTime() - targetDate.getTime())/1000/60;
                }else{
                    timeDiff = timeDiff2Min(userPath, path);
                }

                if(timeDiff < 0){
                    //음수일경우 고려x
                    break;
                }
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
                matchedPatient.push(person);

            }
        }
    }

    return group_by_level;
}

//유저 시간 - 대상 시간을 분단위로 리턴하는 함수.
//음수일경우 확진자가 다녀가기 전에 유저가 방문한 경우이므로 고려하지않음
function timeDiff2Min(user, target){
    //유저 시간 -> 분
    let uDateArray = user.date.split("/");
    let userHour = Number(user.time.substring(0, 2));
    let userMin = Number(user.time.substring(2, 4));
    let userDate = new Date(uDateArray[0], Number(uDateArray[1]) -1, uDateArray[2], userHour, userMin);

    //대상 시간 -> 분
    var tDateArray = target.date.split("/");
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
    let picker = $("#picker").val();
    
    
    datetime = picker.split(' ');
    let date = datetime[0];
    let time = datetime[1];
    time = time.substring(0,2) + time.substring(3,5);
    // console.log(date, time);


    let placeName = $("#placeName").val();

    searchTarget = new path(date, placeName, userLat, userLng, User.color, time);

    removeAll();

    $("#result_for_place").children().remove();
    let result = checkMatched(searchTarget);
    for(let level in result){
        for(let path of result[level]){
            $("#result_for_place").append(
                '<div class="list-group-item list-group-item-action "><a class="itemTitle">' 
                + path.name + '</a><br><a class="itemDesc">'
                + '확진자가 이 지역을 다녀간 지'+ DESCRIPTION[level]  + '</a></div>'
            );

            path.marker.setMap(map);
            displayed.push(path);
        }
    }

    map.panTo(searchTarget.LatLng);
    searchTarget.marker.setMap(map);
    displayed.push(searchTarget);
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
    //경로들을 시간순으로 정렬해서 저장한다.
    let dataArray = getStoredArray();
    // console.log(dataArray);
    if (dataArray == null){
        dataArray = new Array();
    }
    let isOverlap = false;
    for(var i = 0; i < dataArray.length; i++){
        let timeDiff = timeDiff2Min(item, dataArray[i]);

        if(timeDiff < 0 ){
            break;
        }else if(timeDiff == 0){
            isOverlap = true;
            alert("이미 동일한 시간대에 경로가 존재합니다.");
        }
    }
    if(isOverlap){
        //초기화면으로
    }else{
        //중복안되면 저장

        //지도에 있는것 모두 지우기
        removeAll();

        //데이터 저장
        dataArray.splice(i, 0, item);
        localStorage.setItem("visitedList", JSON.stringify(dataArray));
        User.setPaths(getRestoredPath(), User.color, 4);

        //내 동선 창 띄우기
        $(".container").css("display","none");
        $(".review").css("display","block");

        loadUserPaths();
    }
}

//프로그램 초기 단계에서 유저 경로를 불러온는 함수입니다.
//리턴 : 불러온 경로수 ( 0 == 기존테이터없음 )
function loadUserPaths() {
    User = new person(0, null, null);

    let pathArray = getRestoredPath();
    User.setPaths(pathArray, User.color, 4);

    //마커, 라인 그리기
    User.drawMarkerAndLine(map);
    displayed.push(User);

    //리스트에 동선들 추가하기
    $("#my_path_list").children().remove();
    for(let i in User.paths){
        $("#my_path_list").append(
            '<button class="btn btn-outline-secondary" type="button">' + (i+1) + '</button>'
        );
        console.log(path);
    }

    //내 동선중 하나 클릭시
    $(".btn-outline-secondary").click(function(){
        let idx = $(this).text()
        let thisPath = User.paths[idx]

        $("#path_name").html(thisPath.name + '에 대한 검색결과입니다.');

        //지도위 오브젝트 모두제거
        removeAll();

        $("#result_for_userpaths").children().remove();
        let result = checkMatched(thisPath);
        for(let level in result){
            for(let path of result[level]){
                $("#result_for_userpaths").append(
                    '<div class="list-group-item list-group-item-action "><a class="itemTitle">' 
                    + path.name + '</a><br><a class="itemDesc">'
                    + '확진자가 '+ DESCRIPTION[level] + ' 다녀간 지역입니다.' + '</a></div>'
                );
                path.marker.setMap(map);
                displayed.push(path);
            }
        }

        map.panTo(thisPath.LatLng);
        thisPath.marker.setMap(map);
        displayed.push(thisPath);
    });

    return pathArray.length;
}

function removeAll(){
    for(let item of displayed){
        if(item instanceof person){
            item.drawMarkerAndLine(null);
        }else if (item instanceof path){
            item.marker.setMap(null)
        }    
    }
}

//path 배열로 반환하는 함수
function getRestoredPath() {
    let dataArray = getStoredArray();
    let restoredData = new Array();

    let myColor = getRandomColor();
    User.color = myColor;

    if (dataArray != null && dataArray != ""){
        for(let item of dataArray){
            restoredData.push(new path(item.date, item.name, item.lat, item.lng, myColor, item.time, item.method));
        }
    }
	return restoredData;
}

//
function getStoredArray() {
    let dataArray = localStorage.getItem("visitedList");

    if (dataArray == null && dataArray == ""){
        dataArray = new Array();
    }else{
        dataArray = JSON.parse(dataArray);
    }

    return dataArray;
}

//로컬스토리지내 데이터를 지우는 함수입니다.
function clearAll(){
    User.drawMarkerAndLine(null);

    let emptyList = new Array();
    User.setPaths(emptyList);
    localStorage.setItem("visitedList", JSON.stringify(emptyList));
}

//toStore에 person객체들을 만들어 저장합니다.
function json2persons(toStore, dataArray){
    for(let patient of dataArray){
        let newPatient = new person(patient.id, patient.description, patient.date, patient.hospital);

        let newPaths = new Array();
        let color = getRandomColor();

        for(let p of patient.paths){
            let newPath = new path(p.date, p.name, p.lat, p.lng, color);
            
            if(path.time != ""){
                newPath.time = path.time;
            }
            newPaths.push(newPath);
        }
        newPatient.setPaths(newPaths, color);
        toStore.push(newPatient);
    }
}

//랜덤 컬러 제너레이터
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }