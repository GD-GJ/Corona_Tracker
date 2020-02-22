//시작지점            
console.log(number25);
$("#addNew").click(newVisitedArea);
$("#clearAll").click(clearAll);

// paths = [
//     new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
//     new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
//     new kakao.maps.LatLng(33.45178067090639, 126.5726886938753) 
// ]
// lineDrawer(paths);


for(let path of number25.paths){
    console.log(path)
    setMarker(path)

}

// console.log(number25.paths);

// newPaths = map(Array,(paths.lat, paths.lng));
//lineDrawer(paths);
// console.log(paths[0].latLng);


// console.log(newPaths);

// for(var path of number25.paths){
//     console.log(path)
// }
