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

function DayPath(date){
    this.date = date;
    this.paths = new Array();
    this.addPath = function(path){
        this.paths.push(path)
    }
}

function person(id, date, hospital, paths){
    this.id = id;
    this.date = date;
    this.hospital = hospital;
    this.paths = paths;
}

var Day1 = new DayPath("2.6")
Day1.addPath(new path("0930", "대구 동구 소재 회사", "127.123123", "37.123123"))

var Day2 = new DayPath("2.7")
Day2.addPath(new path("1700", "새로난 한방병원", "127.123123", "37.123123"))
Day2.addPath(new path("1701", "자택", "127.123123", "37.123123"))
Day2.addPath(new path("2100", "새로난 한방병원", "127.123123", "37.123123"))

var Day3 = new DayPath("2.8")
Day3.addPath(new path("ALL_DAY", "새로난 한방병원", "127.123123", "37.123123"))

var Day4 = new DayPath("2.9")
Day4.addPath(new path("0730", "신천지예수교증거장막성전 다대오지파대구교회", "127.123123", "37.123123"))
Day4.addPath(new path("0930", "새로난 한방병원", "127.123123", "37.123123"))

var paths = new Array()
paths.push(Day1, Day2, Day3, Day4)

var number25 = new person(25, "2.9", "분당서울대병원", paths);

                        
console.log(number25.paths);

