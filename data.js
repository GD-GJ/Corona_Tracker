//각각의 방문한 장소에 대한 정보를 가지는 객체
function path(time, name, lat, lng){
    this.time = time;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.setLatLng = function(lat, lng){
        this.lat = lat;
        this.lng = lng;
    }
}

//하루치에 해당하는 이동경로 정보를 가지는 객체
function DayPath(date){
    this.date = date;
    this.paths = new Array();
    this.addPath = function(path){
        this.paths.push(path)
    }
    this.getPaths = function(){
        return this.paths
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
var Day1 = new DayPath("2.6")
Day1.addPath(new path("0930", "대구 동구 소재 회사", "127.323123", "37.323123"))

var Day2 = new DayPath("2.7")
Day2.addPath(new path("1700", "새로난 한방병원", "127.123123", "37.123123"))
Day2.addPath(new path("1701", "자택", "127.223123", "37.223123"))
Day2.addPath(new path("2100", "새로난 한방병원", "127.123123", "37.123123"))

var Day3 = new DayPath("2.8")
Day3.addPath(new path("ALL_DAY", "새로난 한방병원", "127.123123", "37.123123"))

var Day4 = new DayPath("2.9")
Day4.addPath(new path("0730", "신천지예수교증거장막성전 다대오지파대구교회", "127.423123", "37.023123"))
Day4.addPath(new path("0930", "새로난 한방병원", "127.123123", "37.123123"))

//Day1, 2, 3, 4를 합쳐서
//확진자가 격리될때 까지의 전체 이동경로 만들기
var paths = new Array()
paths.push(Day1, Day2, Day3, Day4)

var number25 = new person(25, "2.9", "분당서울대병원", paths);


