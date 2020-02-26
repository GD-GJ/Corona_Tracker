//시작지점            
$("#addNewPath").click(newVisitedArea);
$("#clearAll").click(clearAll);
$("#btn_search_place").click(searchPlace);

//장소검색하기
$("#show_search_page").click(function(){
    //주소 검색창 띄우기
    $(".page").css("display","none");
    $(".search").css("display","block");

    //장소 확정버튼 숨기기
    $("#btn_select_place").css("display","none");
});

//내위치에서 검색
$("#search_from_myloc").click(function(){
    //시간 입력 페이지 띄우기
    $(".page").css("display","none");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude,
                lng = position.coords.longitude;

            

            var geocoder = new kakao.maps.services.Geocoder();

            var coord = new kakao.maps.LatLng(lat, lng);
            var callback = function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    placeName = result[0].address.address_name;
                    return placeName;
                    
                }
                
            };
            
            placeName = geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    
            // console.log(lat, lng);
            
    
            // var locPosition = new kakaoPlaces.maps.LatLng(lat, lon),
            
            setUserLatLng(lat, lng);
            $(".when").css("display","block");
            console.log(placeName);
            return placeName;
        })
    } else {
        //geolocation을 못받아오면 실행되는 코드
        // $(".search").css('display','block');
        // $('.search p').html('장소 찾기 : 위치정보를 불러오지 못했습니다. ')
    }
});

//장소 선택하기
$("#btn_select_place").click(function(){
    //기존 목록 제거
    $(".list-group-item-action").remove();
    
    //시간 입력 페이지 띄우기
    $(".page").css("display","none");
    $(".when").css("display","block");
});

//새 동선 추가
$("#searchPath").click(function(){
    //검색하기
    console.log('동선 검색하기');
    newVisitedArea();

    //결과 창 띄우기
    $(".page").css("display","none");
    $(".result").css("display","block");

    $(".container").css("display","none");
    $(".result_path").css("display","block");
});

//내 동선에 추가하기
$("#btn_save_path").click(function(){
    console.log('내 동선에 추가하기');
    save(searchTarget);
});

//홈으로
$(".navbar-brand").click(function(){
    //주소 검색창 띄우기
    $(".page").css("display","none");
    $(".main").css("display","block")
});

//동선 모두삭제
$("#btn_delete_paths").click(clearAll);

var Datas = new Array();

$.ajax({
    url: 'https://gd-gj.github.io/Corona_Tracker/data.json',
    dataType: 'json',
    success: function(received){
        json2persons(Datas, received);

        loadUserPaths();

        kakao.maps.event.addListener(map, 'zoom_changed', function(){
            let level = map.getLevel();
            for(let person of Datas){
                for(let path of person.paths){
                    path.resizeCircle(level*level*10);
                }
            }
            for(let path of User.paths){
                path.resizeCircle(level*level*10);
            }
        });
    },
    error: function(xhr, status, responseTxt){
        console.log(xhr);
    }
});

