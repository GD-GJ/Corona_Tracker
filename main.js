//시작지점            
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
        
            setUserLatLng(lat, lng);

            geocoder.coord2Address(coord.getLng(), coord.getLat(), function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var placeName = result[0].address.address_name;
                    //장소 설정
                    $("#placeName").val(placeName);

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
            
                    newVisitedArea();
                }
            });
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
    //검색결과 컨테이너 띄우기
    $(".inner").css("display","none");
    $(".result_path").css("display","block");
    //검색
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