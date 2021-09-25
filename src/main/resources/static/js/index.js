$(document).ready(function() {
    getPosts();

    //글쓰기 버튼 누르면 모달로 글쓰기 창이 나타남
    $("#write-btn").click(function() {
        $("#write-title").val("");
        $("#write-name").val("");
        $("#write-content").val("");
        $("#modal-name").text("글쓰기");
        $("#modify-btns").hide();
        $("#save-btns").show();
        $("#write-modal").addClass("is-active");
    });
    //글 저장
    $("#save-post-btn").click(function() {
        writePost();
    });
    //글쓰기 취소: input값 초기화 / 모달 닫기
    $("#cancel-save-btn").click(function () {
        if(confirm("취소하시겠습니까?")) {
            $("#write-title").val("");
            $("#write-name").val("");
            $("#write-content").val("");
            $("#write-modal").removeClass("is-active");
        }
    });
    //엑스 누르면 글쓰기 모달창 꺼짐
    $("#close-write-modal").click(function() {
        $("#write-modal").removeClass("is-active");
    });
    //배경 누르면 글쓰기 모달창 꺼짐
    $("#write-modal-background").click(function() {
        $("#write-modal").removeClass("is-active");
    });


    //엑스 누르면 상세보기 모달창 꺼짐
    $("#close-detail-modal").click(function() {
        $("#detail-modal").removeClass("is-active");
    });
    //배경 누르면 상세보기 모달창 꺼짐
    $("#detail-modal-background").click(function() {
        $("#detail-modal").removeClass("is-active");
    });

    //상세보기 모달) 글 수정 버튼 누르기기
   $("#modify-btn").click(function() {
        $("#detail-modal").removeClass("is-active");
        getModifyData();
        $("#save-btns").hide();
        $("#modal-name").text("글수정");
        $("#modify-btns").show();
        $("#write-modal").addClass("is-active");
    });

    //수정 완료
    $("#modify-post-btn").click(function() {
        modifyPost();
    });
    //글쓰기 취소: input값 초기화 / 모달 닫기
    $("#cancel-save-btn").click(function () {
        if(confirm("취소하시겠습니까?")) {
            $("#write-title").val("");
            $("#write-name").val("");
            $("#write-content").val("");
            $("#write-modal").removeClass("is-active");
        }
    });
});

//게시물 데이터 모두 가져오기
function getPosts() {
    $.ajax({
        type:"GET",
        url:"/api/posts",
        success: function(response) {
            if (response.length > 0) {
                $("#table-tbody").empty();
                for (let i = 0; i < response.length; i++) {
                    let id = response[i]["id"];
                    let title = response[i]["title"];
                    let name = response[i]["name"];
                    let modified_at_date = response[i]["modifiedAt"].substr(0,10);
                    let temp_html =
                        `<tr id="${id}-post" onclick="showDetail('${id}')">
                            <td>
                                <input id="${id}-checkbox" type="checkbox" value="${id}">
                            </td>
                            <th id="${id}">${id}</th>
                            <td id="${id}-title">${title}</td>
                            <td id="${id}-name">${name}</td>
                            <td id="${id}-modifieddate">${modified_at_date}</td>
                        </tr>`;
                    $("#table-tbody").append(temp_html);
                }
            }
        }
    });
}

//클릭한 게시물의 상세내용 보여주기
function showDetail(id) {
    let post_id = id;

    $.ajax({
        type:"GET",
        url:"/api/posts/" + post_id,
        success: function(response) {
            console.log(response);
            let id = response["id"];
            let title = response["title"];
            let name = response["name"];
            let created_at_date = response["createdAt"].substr(0,10);
            let modified_at_date = response["modifiedAt"].substr(0,10);
            let content = response["content"];

            if(created_at_date != modified_at_date) {
                $("#date").text("수정일");
            }
            $("#detail-title").text(title);
            $("#detail-name").text(name);
            $("#detail-createdate").text(modified_at_date);
            $("#detail-content").text(content);
            $("#detail-id").val(id);
            $("#detail-content").css("white-space", "pre");

            $("#detail-modal").addClass("is-active");
        },
        error: function(error) {
            alert("게시물을 조회할 수 없습니다");
            console.log("error" + error);
        }
    });
}

//글 작성
function writePost() {
    let title = $("#write-title").val().trim();
    let name = $("#write-name").val().trim();
    let content = $("#write-content").val().trim();

    if(title == "") {
        alert("제목을 입력하세요");
        $("#write-title").focus();
        return;
    }
    if(name == "") {
        alert("작성자 이름을 입력하세요");
        $("#write-name").focus();
        return;
    }
    if(content == "") {
        alert("내용을 입력하세요");
        $("#write-content").focus();
        return;
    }
        let data = {title:title, name:name, content:content}
        $.ajax({
        type:"POST",
        url:"/api/posts",
        contentType:"application/json",
        data: JSON.stringify(data),
        success: function(response) {
            alert("작성되었습니다");
            window.location.reload();
        }
    });
}

//글 수정 모달창에 값 불러오기
function getModifyData() {
    let title = $("#detail-title").text();
    let name = $("#detail-name").text();
    let content = $("#detail-content").text();
    let id = $("#detail-id").val();

    $("#write-title").val(title);
    $("#write-name").val(name);
    $("#write-content").val(content);
    $("#write-id").val(id);
}

//글 수정 완료하기
function modifyPost() {
    let post_id = $("#write-id").val();
    let title = $("#write-title").val();
    let name = $("#write-name").val();
    let content = $("#write-content").val();
    let data = {title:title, name:name, content:content}
    $.ajax({
        type:"PUT",
        url:"/api/posts/" + post_id,
        contentType:"application/json",
        data: JSON.stringify(data),
        success: function(response) {
            alert("수정되었습니다");
            window.location.reload();
        }
    });
}