//시작지점            
$("#addNewPath").click(newVisitedArea);
$("#clearAll").click(clearAll);
$("#btn_search_place").click(searchPlace);



//장소검색하기
$("#show_search_page").click(function(){
    //주소 검색창 띄우기
    $('#mainMenu').css('display','none');
    $('#placeMenu').css('display','block');

    //장소 확정버튼 숨기기
    $("#btn_select_place").css("display","none");
});

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
                    $("#placeName").val(placeName);
                    $("#mainMenu").css("display","none");
                    $('#placeMenu').css('display','block');
                    // $(".when").css("display","block");
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

//장소 선택하기
$("#btn_select_place").click(function(){
    //기존 목록 제거
    $(".list-group-item-action").remove();
    
    //시간 입력 페이지 띄우기
    $("#placeMenu").css("display","none");
    $('#timeMenu').css('display','block');

    //자기 자신 숨기기
    $(this).css('display','none');
});


//새 동선 추가
$("#searchPath").click(function(){
    //검색하기
    console.log('동선 검색하기');
    newVisitedArea();

    //결과 창 띄우기
    $('#timeMenu').css('display','none');
    $('#resultMenu').css('display','block');
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

//홈으로 v2
$('#returnToMenu').click(function(){
    $('#mainMenu').css("display",'block');
    $('#placeMenu').css("display",'block');
    $('#timeMenu').css("display",'block');
    $('#resultMenu').css("display",'none');
})

//동선 모두삭제
$("#btn_delete_paths").click(clearAll);



//내 동선 확인하기
$("#show_review_page").click(function(){
    loadUserPaths();
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


// for(let obj of displayed){
//     kakao.maps.event.addListener(obj.marker, 'click', function(mouseEvent) {  
//         // 마커 클릭시 인포윈도우 오픈
//         obj.infowindow.open(map);      
//     });
// }