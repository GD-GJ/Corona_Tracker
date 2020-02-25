//시작지점            
$("#addNew").click(newVisitedArea);
$("#clearAll").click(clearAll);
$("#btn_search_place").click(searchPlace);
$("#btn_select_place").click(function(){
    //기존 목록 제거
    $(".list-group-item-action").remove();
    
    //시간 입력 페이지 띄우기
    $(".page").css("display","none");
    $(".when").css("display","block")
});

//장소검색하기
$("#show_search_page").click(function(){
    //주소 검색창 띄우기
    $(".page").css("display","none");
    $(".search").css("display","block")
});

//내위치에서 검색
$("#search_from_myloc").click(function(){
    //결과 창 띄우기
    $(".page").css("display","none");
    $(".when").css("display","block")
});

//새 동선 추가
$("#addNewPath").click(function(){
    //결과 창 띄우기
    $(".page").css("display","none");
    $(".result").css("display","block")
});


var Datas = new Array();

$.ajax({
    url: 'https://gd-gj.github.io/Corona_Tracker/data.json',
    dataType: 'json',
    success: function(received){
        json2persons(Datas, received);

        loadUserPaths();
    },
    error: function(xhr, status, responseTxt){
        console.log(xhr);
    }
});