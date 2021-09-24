$(document).ready(function() {
    //글쓰기 버튼 누르면 모달로 글쓰기 창이 나타남
    $("#write").click(function() {
        $("#write-modal").addClass("is-active");
    });
    //엑스 누르면 글쓰기 모달창 꺼짐
    $("#close-write-modal").click(function() {
        $("#write-modal").removeClass("is-active");
    });
    //배경 누르면 글쓰기 모달창 꺼짐
    $("#write-modal-background").click(function() {
        $("#write-modal").removeClass("is-active");
    });

    //행 누르면 상세보기 모달창 나타남
    //각 행에 대해 id값 부여해야함!!!!
    $("#1-post").click("on", function() {
        $("#write-modal").addClass("is-active");
    });
    //엑스 누르면 상세보기 모달창 꺼짐
    $("#close-detail-modal").click(function() {
        $("#detail-modal").removeClass("is-active");
    });
    //배경 누르면 상세보기 모달창 꺼짐
    $("#detail-modal-background").click(function() {
        $("#detail-modal").removeClass("is-active");
    });
});
