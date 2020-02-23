//각각의 방문한 장소에 대한 정보를 가지는 객체
function path(date, time, name, method, lat, lng){
    this.date = date;
    this.time = time;
    this.name = name;
    this.method = method;
    this.lat = lat;
    this.lng = lng;
    this.latLng = new kakao.maps.LatLng(lat, lng);
    this.marker = new kakao.maps.Marker({
        position: this.latLng
    });
    this.setLatLng = function(lat, lng){
        this.lat = lat;
        this.lng = lng;
    }
}

//한명의 감염자에 대한 정보를 가지는 객체
function person(id, date, hospital, paths){
    this.id = id;
    this.date = date;
    this.hospital = hospital;
    this.paths = paths;
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
var number31 = new person(31, "2020-02-18", "대구의료원", paths);
Datas.push(number31);

paths = new Array();
paths.push(
    new path("2020-02-05", "0800", "중구 소재 회사", "도보", 37.5600030088843, 126.975313124237),
    new path("2020-02-05", "UKNOWN", "자택", "도보", 37.7600030088843, 126.475313124237),
    new path("2020-02-06", "0800", "중구 소재 회사", "도보", 37.5600030088843, 126.975313124237),
    new path("2020-02-06", "UKNOWN", "자택", "도보", 37.7600030088843, 126.475313124237),
);
var number30 = new person(30, "2020-02-16", "서울대학교병원", paths);
Datas.push(number30);



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