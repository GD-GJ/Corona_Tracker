//시작지점            
$("#addNewPath").click(newVisitedArea);
$("#clearAll").click(clearAll);
$("#btn_search_place").click(searchPlace);

//내위치에서 검색
$("#search_from_myloc").click(function(){
    //시간 입력 페이지 띄우기
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude,
                lng = position.coords.longitude;

            var geocoder = new kakao.maps.services.Geocoder();
            var coord = new kakao.maps.LatLng(lat, lng);
                
            geocoder.coord2Address(coord.getLng(), coord.getLat(), function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var placeName = result[0].address.address_name;
                    //장소 설정
                    $("#placeName").val(placeName);
                    //시간 지금으로 설정
                    selectNow();

                    $(".Menu").css("display","none");
                    $("#resultMenu").css("display","block");

                    $(".inner").css("display","none");
                    $(".result_path").css("display","block");

                    //결과 불러오기
                    newVisitedArea();
                }
            });

            setUserLatLng(lat, lng);
            
        });
    } else {
        //geolocation을 못받아오면 실행되는 코드
        // $(".search").css('display','block');
        // $('.search p').html('장소 찾기 : 위치정보를 불러오지 못했습니다. ')
    }
    
});

//내 동선에 추가하기
$("#btn_save_path").click(function(){
    console.log('내 동선에 추가하기');
    save(searchTarget);
});

//동선 모두삭제
$("#btn_delete_paths").click(clearAll);

//date picker 리스너
$('#picker').change(function(){
    newVisitedArea();
});

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