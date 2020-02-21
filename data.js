//각각의 방문한 장소에 대한 정보를 가지는 객체
function path(date, time, name, method,lat, lng){
    this.date = date;
    this.time = time;
    this.name = name;
    this.method = method;
    this.lat = lat;
    this.lng = lng;
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

//확진자가 격리될때 까지의 전체 이동경로 만들기
var paths = new Array()
paths.push(
    new path("0206", "0930", "대구 동구 소재 회사", "자차", 33.452344169439975, 126.56878163224233),
    new path("0207", "1700", "새로난 한방병원", "자차", 33.45178067090639, 126.5726886938753),
    new path("0207", "1701", "자택", "자차", 33.452739313807456, 126.5709308145358),
    new path("0207", "2100", "새로난 한방병원", "자차", 33.45178067090639, 126.5726886938753),
    new path("0208", "ALL_DAY", "새로난 한방병원", "", 33.45178067090639, 126.5726886938753),
    new path("0209", "0730", "신천지예수교증거장막성전 다대오지파대구교회", "자차", 33.412739313807456, 126.1009308145358),
    new path("0209", "0930", "새로난 한방병원", "자차", 33.45178067090639, 126.5726886938753),
    )

var number25 = new person(25, "2.9", "분당서울대병원", paths);


