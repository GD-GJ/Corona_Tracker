//시작지점            
$("#addNew").click(newVisitedArea);
$("#clearAll").click(clearAll);
$("#search_place").click(searchPlace);
$("#select_place").click(function(){
    $(".search_view").css("display","none");
    $(".add_view").css("display","block");
    $(".result_view").css("display","none");
});
$("#show_urp").click(function(){
    $(".search_view").css("display","block");
    $(".add_view").css("display","none");
    $(".result_view").css("display","none");
    $("#user_route_panel").animate({bottom: "0px"}, 250, function(){
        console.log("panel visible");
    })
});
$("#hide_urp").click(function(){
    $("#user_route_panel").animate({bottom: "-800px"}, 250, function(){
        console.log("panel invisible");
    })
});

//모든 확진자 경로 그려주기
for(let person of Datas){
    person.drawMarkerAndLine(map);
}

//사용자 경로 그려주기
loadUserPaths();