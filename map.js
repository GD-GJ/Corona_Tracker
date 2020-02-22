
//Kakaomap api
var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level : 3
}

var map = new kakao.maps.Map(container, options);

var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

function setMarker(path){
    // 마커가 표시될 위치입니다 
    let markerPosition = new kakao.maps.LatLng(path.lat, path.lng);

    // 마커를 생성합니다
    let marker = new kakao.maps.Marker({
        position: markerPosition
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
}


// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
// marker.setMap(null);   

////////////////////////////////////////////////////////////

// HTML5의 geolocation을 활용한 현위치.
// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">현위치</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
            
      });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition
    }); 
    
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
} 

function lineDrawer(paths, lineColor='#db4040'){
    //paths      : 경로 배열
    //lineColor  : 선의 색깔
    var array = []
    for (let i = 0; i < paths.length; i++){
        array.push(paths[i].latLng);
        console.log(paths[i].latLng);
        
    }


    line = new kakao.maps.Polyline({
        endArrow : true,
        map: map,
        path: array,
        strokeWeight : 3,
        strokeColor : lineColor, //'#db4040'
        strokeOpacity : 1,
        strokeStyle : 'solid'
    });
}

//카카오 지오코더
var geocoder = new kakao.maps.services.Geocoder();

//카카오 플레이스
var kakaoPlaces = new kakao.maps.services.Places();

//장소 키워드로 해당하는 장소들을 찾는 함수
function searchPlace(){
    let placeName = $("#placeName").val();
    var places;
    kakaoPlaces.keywordSearch(placeName, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            places = result;

            //기존 목록 제거
            $(".list-group-item-action").remove();

            //목록 생성하기
            for(let place of result){
                $("#SelectPlace").append('<a class="list-group-item list-group-item-action ">' + place.place_name + '</a>');
            }

            //항목 클릭 리스너
            $("a.list-group-item.list-group-item-action").click(function() {
                console.log(places);
                for(let place of places){
                    if(place.place_name == $(this).text()){
                        map.panTo(new kakao.maps.LatLng(place.y, place.x));
                        $("#placeName").val(place.place_name);
                        setUserLatLng(place.y, place.x);
                    }
                }
            });
        }
    });
}