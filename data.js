//각각의 방문한 장소에 대한 정보를 가지는 객체
function path(date, time, name, method, lat, lng){
    this.date = date;
    this.time = time;
    this.name = name;
    this.method = method;
    this.lat = lat;
    this.lng = lng;
    this.LatLng = new kakao.maps.LatLng(lat, lng);
    this.marker = new kakao.maps.Marker({
        position: this.LatLng
    });
    this.infowindow = new kakao.maps.InfoWindow({
        //컨텐츠 ui 수정할것.
        content : '<div style="padding:5px;">'
                + this.name + '<br>' 
                + this.date + this.time + '<br>'
                + this.method 
                + '</div>',
        removable : true
      });
    
    this.setLatLng = function(lat, lng){
        this.lat = lat;
        this.lng = lng;
    }
    this.line = null;
}

//한명의 감염자에 대한 정보를 가지는 객체
function person(id, date, hospital, isItOfficial = false){
    this.id = id;
    this.date = date;
    this.hospital = hospital;
    this.paths = null;
    this.isItOfficial = isItOfficial
    this.drawMarkerAndLine = function(map){
        for(let path of this.paths){
            path.marker.setMap(map);
            kakao.maps.event.addListener(path.marker, 'click', function() {
                // 마커 클릭시 인포윈도우 오픈
                path.infowindow.open(map, path.marker);
            });
        }
        if(this.lines != null){
            this.lines.setMap(map);
        }
    }
    this.setPaths = function(paths, lineColor='#db4040'){
        this.paths = paths;

        if(paths.length < 2){
            this.lines = null;
            return;
        }

        let r = new Array();
        for(let path of paths){
            r.push(path.LatLng);
        }

        this.lines = new kakao.maps.Polyline({
            endArrow : true,
            path: r,
            strokeWeight : 3,
            strokeColor : lineColor, //'#db4040'
            strokeOpacity : 1,
            strokeStyle : 'solid'
        });
    }
}

//테스트 데이터
//모든 확진자의 데이터를 담고있는 배열
var Datas = new Array();
//확진자가 격리될때 까지의 전체 이동경로 만들기

var paths = new Array()
paths.push(
    new path("2020-02-06", "0930", "대구 동구 소재 회사", "자차", 33.452344169439975, 126.56878163224233),
    new path("2020-02-07", "1700", "새로난 한방병원", "자차", 33.45178067090639, 126.5726886938753),
    new path("2020-02-07", "1701", "자택", "자차", 33.452739313807456, 126.5709308145358),
    new path("2020-02-07", "2100", "새로난 한방병원", "자차", 33.45178067090639, 126.5726886938753),
    new path("2020-02-08", "ALL_DAY", "새로난 한방병원", "", 33.45178067090639, 126.5726886938753),
    new path("2020-02-09", "0730", "신천지예수교증거장막성전 다대오지파대구교회", "자차", 33.412739313807456, 126.1009308145358),
    new path("2020-02-09", "0930", "새로난 한방병원", "자차", 33.45178067090639, 126.5726886938753),
);
var number31 = new person(31, "2020-02-18", "대구의료원");
number31.setPaths(paths);

paths = new Array();
paths.push(
    new path("2020-02-05", "0800", "중구 소재 회사", "도보", 37.5600030088843, 126.975313124237),
    new path("2020-02-05", "UKNOWN", "자택", "도보", 37.7600030088843, 126.475313124237),
    new path("2020-02-06", "0800", "중구 소재 회사", "도보", 37.5600030088843, 126.975313124237),
    new path("2020-02-06", "UKNOWN", "자택", "도보", 37.7600030088843, 126.475313124237),
);
var number30 = new person(30, "2020-02-16", "서울대학교병원")
number30.setPaths(paths);

Datas.push(number30, number31);



// var person = {
//     id : 25,
//     date : "0209",
//     hospital : "분당서울대병원",
//     paths : [
//         path = {
//             date : "0206",
//             time : "0930",
//             name : "대구 동구 소재 회사",
//             method : "자차",
//             lat : 33.452344169439975,
//             lng : 126.56878163224233
//         },
//         path = {
//             date : "0206",
//             time : "0930",
//             name : "대구 동구 소재 회사",
//             method : "자차",
//             lat : 33.452344169439975,
//             lng : 126.56878163224233
//         }
//     ]
// }