var userLat,
    userLng;
var User;
var searchTarget;
var matchedPatient = [];
var displayed = new Array();

const DESCRIPTION = ['6시간 이내에 이 장소를 방문했습니다.',
                     '하루 이내에 이 장소를 방문했습니다.',
                     '1주일 이내에 이 장소를 방문했습니다.' ,
                     '이 장소를 방문한지 1주일이 지났습니다.',
                     '시간정보가 없는 동선입니다'];

//새로운 유저 경로가 추가될 때
//기존 확진자의 동선과 겹치는 부분이 있는지 검사하는 함수입니다.
function checkMatched(userPath){
    //위험지역 : 반경 3km
    const DANGER_ZONE = 3.0;
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
            let distance = calcDistance(userPath.lat, userPath.lng, path.lat, path.lng);
            // console.log(distance);
            if(distance <= DANGER_ZONE){
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

                path.distance = distance;
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
    console.log("newVisitedArea call");
    let picker = $("#picker").val();
    
    datetime = picker.split(' ');
    let date = datetime[0];
    date = date.substring(0,4) + '-' + date.substring(5,7) + '-' + date.substring(8,10);
    let time = datetime[1];
    time = time.substring(0,2) + time.substring(3,5);
    console.log(date, time);

    let placeName = $("#placeName").val();
    
    searchTarget = new path(null, date, placeName, userLat, userLng, User.color, time);
    console.log(searchTarget);
    //인포윈도우 설정
    searchTarget.infowindow.setContent(
        '<div style="padding:5px;">'
        + '내가 방문한 장소<br>' 
        + searchTarget.name + '<br>' 
        + searchTarget.date + '일 ' + searchTarget.time.substring(0, 2) + '시 ' + searchTarget.time.substring(2, 4) + '분<br><br>'
        + '</div>'
    );
    console.log(searchTarget.infowindow);

    //클릭리스너 등록
    kakao.maps.event.addListener(searchTarget.marker, 'click', function(mouseEvent){
        searchTarget.infowindow.open(map);
    });

    removeAll();

    $(".path_name").html(searchTarget.date + ' 기준 ' + searchTarget.name + '에 대한 검색 결과입니다.');

    let targetDiv = $("#result_for_place");
    let result = checkMatched(searchTarget);
    showResult(result, targetDiv);
    
    searchTarget.marker.setMap(map);
    searchTarget.infowindow.setMap(map);
    displayed.push(searchTarget);
    console.log(displayed);
    //지도 중심점 이동
    setMapBounds();
    console.log(map.getBounds());

    
}

//두 위치 사이의 거리를 반환하는 함수.

function calcDistance(lat1, lon1, lat2, lon2){
    function deg2rad(deg) {return (deg * Math.PI / 180);}
    function rad2deg(rad) {return (rad * 180 / Math.PI);}
    let theta = lon1 - lon2;
    dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1))
        * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return Number(dist).toFixed(2);
}


//유저 경로를 로컬스토리지에 저장하는 함수입니다.
function save(item) {    
    //경로들을 시간순으로 정렬해서 저장한다.
    let dataArray = getStoredArray();
    
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
        //결과 보기 버튼 활성화
        $("#show_review_page").css("display","block");

        //중복안되면 저장

        //지도에 있는것 모두 지우기
        removeAll();

        //데이터 저장
        console.log(item);
        dataArray.splice(i, 0, item);
        console.log(dataArray);
        localStorage.setItem("visitedList", JSON.stringify(dataArray));

        loadUserPaths();
    }
}

//모든 동선그려주기
//review page div에서 보여줄 결과입니다.
function showAllUserPaths(){
    //초기화
    removeAll();
    $("#result_for_userpaths").children().remove();

    //확진자 그려주기
    for(let thisPath of User.paths){
        let targetDiv = $("#result_for_userpaths")
        let result = checkMatched(thisPath);
        showResult(result, targetDiv, true);
    }

    //유저 그려주기
    User.drawMarkerAndLine(map);
    displayed.push(User);

    for(let p of User.paths){
        p.infowindow.setMap(map);
        displayed.push(p);
    }
    //지도 영역 설정
    setMapBounds();
}

function setMapBounds(){
    let bounds = new kakao.maps.LatLngBounds();
    for(let obj of displayed){
        if(obj instanceof path){
            bounds.extend(obj.LatLng);
        }
    }
    map.setBounds(bounds);
}

//프로그램 초기 단계에서 유저 경로를 불러온는 함수입니다.
function loadUserPaths() {
    map.relayout();
    User = new person(0, '내가 방문한 장소', null, null);

    let pathArray = getRestoredPath();
    User.setPaths(pathArray, User.color, 5);

    //기존 데이터 있을때만
    if(pathArray.length > 0){
        //결과 보기 버튼 활성화
        $("#show_review_page").css("display","block");
        //결과 창 띄우기
        $(".page").css("display","none");
        $("#resultMenu").css("display","block");

        $(".inner").css("display","none");
        $(".review").css("display","block");

        //마커, 라인 그리기
        showAllUserPaths();

        //리스트 초기화
        $("#my_path_list").children().remove();

        //리스트에 전체보기 옵션추가
        $("#my_path_list").append(
            '<button type="button" class="btn btn-primary" id="show_all_path">전체</button>'
        );
        $("#show_all_path").click(showAllUserPaths);

        //리스트에 동선들 추가하기
        for(let i in User.paths){
            $("#my_path_list").append(
                '<button type="button" class="btn btn-primary user_path_listitem">' + (Number(i) + 1) + '</button>'
            );
            console.log(path);
        }

        //내 동선중 하나 클릭시
        $(".user_path_listitem").click(function(){
            let idx = Number($(this).text()) - 1; 
            let thisPath = User.paths[idx]

            $(".path_name").html(thisPath.date + ' 기준 ' + thisPath.name + '에 대한 검색 결과입니다.');

            //지도위 오브젝트 모두제거
            removeAll();

            let result = checkMatched(thisPath);
            let targetDiv = $("#result_for_userpaths");
            showResult(result, targetDiv);

            thisPath.infowindow.setMap(map);
            thisPath.marker.setMap(map);
            displayed.push(thisPath);
            //지도 중심점 이동
            setMapBounds();
        });
    }else{
        //결과 보기 버튼 비활성화
        $("#show_review_page").css("display","none");
        //기존 데이터 없으면 검색창으로
        // $(".page").css("display","none");
        // $(".main").css("display","block")
    }
}

function showResult(result, attachTo, append=false){
    //초기화
    if(!append){
        attachTo.children().remove();
    }
    map.relayout();
    //출력
    let idx = 0;
    for(let level in result){
        for(let path of result[level]){
            attachTo.append(
                '<div class="list-group-item list-group-item-action result_item" id="list_' + (idx++) + '"><a class="itemTitle">' 
                + path.name + '</a><br><a class="itemDesc">'
                + path.person.description + '가 '+ DESCRIPTION[level] + '</a><br><a class="itemDist">'
                + path.distance + 'km </a></div>'
            );
            
            path.marker.setMap(map);
            displayed.push(path);
        }
    }
    
    //만든 아이템 클릭리스너
    $(".result_item").click(function(){
        let idx = Number($(this).attr('id').split("_")[1])
        if(displayed[idx] instanceof path){
            displayed[idx].infowindow.open(map)
        }else{
            console.log(displayed)
            console.log(idx)
            console.log("확진자 목록 클릭. path객체가 아님")
        }
       
    })
}

function removeAll(){
    for(let item of displayed){
        if(item instanceof person){
            item.drawMarkerAndLine(null);
        }else if (item instanceof path){
            item.marker.setMap(null);
            item.infowindow.open(null);
        }    
    }
    //dispalyed 초기화
    displayed = new Array();
}

//path 배열로 반환하는 함수
function getRestoredPath() {
    let dataArray = getStoredArray();
    let restoredData = new Array();

    let myColor = getRandomColor();
    User.color = myColor;

    if (dataArray != null && dataArray != ""){
        for(let item of dataArray){
            let newItem = new path(null, item.date, item.name, item.lat, item.lng, myColor, item.time, item.method);
            newItem.infowindow.setContent(
                '<div style="padding:5px;">'
                + '내가 방문한 장소<br>' 
                + newItem.name + '<br>' 
                + newItem.date + '일 ' + newItem.time.substring(0, 2) + '시 ' + newItem.time.substring(2, 4) + '분<br><br>'
                + '</div>',
            );
            //클릭리스너 등록
            kakao.maps.event.addListener(newItem.marker, 'click', function(mouseEvent){
                newItem.infowindow.open(map);
            });
            
            restoredData.push(newItem);
        }
    }
	return restoredData;
}

//
function getStoredArray() {
    let dataArray = localStorage.getItem("visitedList");

    if (dataArray == null || dataArray == ""){
        dataArray = new Array();
    }else{
        dataArray = JSON.parse(dataArray);
    }

    return dataArray;
}

//로컬스토리지내 데이터를 지우는 함수입니다.
function clearAll(){
    removeAll();
    //검색결과들 지우기
    $("#result_for_userpaths").children().remove();
    $("#result_for_place").children().remove();
    //경로 목록 지우기
    $("#my_path_list").children().remove();

    let emptyList = new Array();
    User.setPaths(emptyList);
    localStorage.setItem("visitedList", JSON.stringify(emptyList));
    
    //결과 보기 버튼 비활성화
    $("#show_review_page").css("display","none");
}

//toStore에 person객체들을 만들어 저장합니다.
function json2persons(toStore, dataArray){
    for(let patient of dataArray){
        let newPatient = new person(patient.id, patient.description, patient.date, patient.hospital);

        let newPaths = new Array();
        let color = getRandomColor();

        for(let p of patient.paths){
            let newPath = new path(newPatient, p.date, p.name, p.lat, p.lng, color);
            //인포윈도우 세팅
            newPath.infowindow.setContent(
                '<div style="padding:5px;">'
                + newPath.person.description + '<br>' 
                + newPath.name + '<br>' 
                + newPath.date + '일 ' + newPath.time.substring(0, 2) + '시 ' + newPath.time.substring(2, 4) + '분<br><br>'
                + '</div>'
            );
            
            //클릭리스너 등록
            kakao.maps.event.addListener(newPath.marker, 'click', function(mouseEvent){
                newPath.infowindow.open(map);
            });
            
            //시간 있으면 추가
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