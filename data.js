//각각의 방문한 장소에 대한 정보를 가지는 객체
function path(date, name, lat, lng, time='', method=''){
    this.date = date;
    this.time = time;
    this.name = name;
    this.method = method;
    this.lat = lat;
    this.lng = lng;
    this.LatLng = new kakao.maps.LatLng(lat, lng);
    this.marker = new kakao.maps.Circle({
        center : this.LatLng,
        radius: 50, // 미터 단위의 원의 반지름입니다 
        strokeWeight: 5, // 선의 두께입니다 
        strokeColor: '#75B8FA', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid', // 선의 스타일 입니다
        fillColor: '#CFE7FF', // 채우기 색깔입니다
        fillOpacity: 0.7  // 채우기 불투명도 입니다   
    }); 
    this.resizeCircle = function(rad){
        this.marker.setRadius(rad);
    }
    this.infowindow = new kakao.maps.InfoWindow({
        //컨텐츠 ui 수정할것.
        content : '<div style="padding:5px;">'
                + this.name + '<br>' 
                + this.date + this.time + '<br>'
                + this.method 
                + '</div>',
        removable : true
      });
}

//한명의 감염자에 대한 정보를 가지는 객체
function person(id, desc, date, hospital, isItOfficial = false){
    this.id = id;
    this.description = desc;
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