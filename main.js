//시작지점            
$("#addNew").click(newVisitedArea);
$("#clearAll").click(clearAll);
$("#search_place").click(searchPlace);
$("#select_place").click(function(){
    //뷰 전환
    $(".search_view").css("display","none");
    $(".add_view").css("display","block");
    $(".result_view").css("display","none");

    //기존 목록 제거
    $(".list-group-item-action").remove();
});
$("#show_urp").click(function(){
    $("#user_route_panel").animate({bottom: "0px"}, 250, function(){
        console.log("panel visible");
    })
});
$("#hide_urp").click(function(){
    $(".search_view").css("display","block");
    $(".add_view").css("display","none");
    $(".result_view").css("display","none");
    $("#user_route_panel").animate({bottom: "-800px"}, 250, function(){
        console.log("panel invisible");
    })
});

loadUserPaths();

var Datas = new Array();

$.ajax({
    url: 'https://gd-gj.github.io/Corona_Tracker/data.json',
    dataType: 'json',
    success: function(received){
        json2persons(Datas, received);

        for(let person of Datas){
            //목록 추가
            $(".top-panel").append('<a class="item horizontal patient">' + person.id + ' </a>');
        }
        
        $(".patient").click(function(){
            for(let person of Datas){
                if($(this).text() == person.id){
                    person.drawMarkerAndLine(map);
                }
            }
        })
    },
    error: function(xhr, status, responseTxt){
        console.log(xhr);
    }
});