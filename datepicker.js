// datepicker용 javascript파일
$('#picker').datetimepicker({
    datepicker:true,
    timepicker:true
});

// $('#picker').change(function(){
//     console.log($(this).val().split(' '));
// });

$('#now').click(function(params) {
    var d = new Date();
    var dString = dateStringfier(d);
    $('#picker').val(dString);
});

$('#yesterday').click(function(){
    var d = new Date();
    // 하루를 빼는 코드
    d.setTime(d.getTime()-(1 * 24 * 60 * 60 * 1000));
    var dString = dateStringfier(d);
    $('#picker').val(dString);
});


function dateStringfier(dAte){
    var year = dAte.getFullYear();
    //getMonth는 0부터 시작하므로
    var month = dAte.getMonth() + 1;
    if(month < 10){
        //String의 문자를 맞추기 위하여 01 02 03 ~ 11 12
        month = '0' + month;
    }
    var date = dAte.getDate();
    if (date < 10) {
        date = '0' + date;
    }

    var hour = dAte.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }

    var minute = dAte.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }


    var dString = year + '/' + month + '/' + date + ' ' + hour + ':' + minute;
    return dString;
}
