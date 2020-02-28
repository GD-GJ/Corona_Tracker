
//Kakaomap api
var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level : 3
}

var map = new kakao.maps.Map(container, options);

//카카오 지오코더
var geocoder = new kakao.maps.services.Geocoder();
//카카오 플레이스
var kakaoPlaces = new kakao.maps.services.Places();




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

//장소 키워드로 해당하는 장소들을 찾는 함수
function searchPlace(){
    let placeName = $("#placeName").val();
    var places;
    kakaoPlaces.keywordSearch(placeName, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            places = result;

            //기존 목록 제거
            $(".list-group-item-action").remove();

            console.log(result);
            //목록 생성하기
            for(let place of result){
                $("#SelectPlace").append('<div class="list-group-item list-group-item-action "><a class="itemTitle">' + place.place_name + '</a><br><a class="itemDesc">' + place.address_name + '</a></div>');
            }

            //항목 클릭 리스너
            $("div.list-group-item.list-group-item-action").click(function() {
                console.log(places);
                for(let place of places){
                    if(place.place_name == $(this).find(".itemTitle").text()){
                        map.panTo(new kakao.maps.LatLng(place.y, place.x));

                        $("#placeName").val(place.place_name);
                        setUserLatLng(place.y, place.x);

                        //기존 목록 제거
                        $("#SelectPlace").children().remove();

                        //지금시간으로 설정
                        selectNow();

                        //결과 창 띄우기
                        $('#main_container').css('display','block');
                        //검색결과 컨테이너 띄우기
                        $(".inner").css("display","none");
                        $(".result_path").css("display","block");
                        //시간 옵션 띄우기
                        $(".input-group").css("width","50%");
                        $("#picker").css("display","block");
                        
                
                        //검색하기
                        console.log('동선 검색하기');
                        newVisitedArea();

                    }
                }
            });
        }
    });
}