//시작지점            
$("#addNewPath").click(newVisitedArea);
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
$("#searchPath").click(function(){
    //결과 창 띄우기
    $(".page").css("display","none");
    $(".result").css("display","block")

    $(".container").css("display","none");
    $(".result_path").css("display","block");
});

//내 동선에 추가하기
$("#btn_save_path").click(function(){
    //내 동선 창 띄우기
    $(".container").css("display","none");
    $(".review").css("display","block");
});

//홈으로
$(".navbar-brand").click(function(){
    //주소 검색창 띄우기
    $(".page").css("display","none");
    $(".main").css("display","block")
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