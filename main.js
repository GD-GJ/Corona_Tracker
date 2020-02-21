//시작지점            
console.log(number25.paths);

paths = [
    new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
    new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
    new kakao.maps.LatLng(33.45178067090639, 126.5726886938753) 
]
lineDrawer(paths);

for(var date of number25.paths){
    for(var path of date.paths){
        console.log(path)
        setMarker(path)
    }
}
