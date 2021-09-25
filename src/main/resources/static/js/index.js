$(document).ready(function() {
    getPosts();

    //글쓰기 버튼 누르면 모달로 글쓰기 창이 나타남
    $("#write-btn").click(function() {
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

    //엑스 누르면 상세보기 모달창 꺼짐
    $("#close-detail-modal").click(function() {
        $("#detail-modal").removeClass("is-active");
    });
    //배경 누르면 상세보기 모달창 꺼짐
    $("#detail-modal-background").click(function() {
        $("#detail-modal").removeClass("is-active");
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
                    let content = response[i]["content"];
                    let temp_html =
                        `<tr id="${id}-post" onclick="showDetail('${id}')">
                            <td>
                                <input id="${id}-checkbox" type="checkbox" value="${id}">
                            </td>
                            <th id="${id}">${id}</th>
                            <td id="${id}-title">${title}</td>
                            <td id="${id}-name">${name}</td>
                            <input type="hidden" id="${id}-content" value="${content}">
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
    let title = $(`#${id}-title`).text();
    let name = $(`#${id}-name`).text();

    $.ajax({
        type:"GET",
        url:"/api/posts/" + post_id,
        success: function(response) {
            console.log(response);
            let id = response["id"];
            let title = response["title"];
            let name = response["name"];
            let content = response["content"];
        },
        error: function(error) {
            alert("게시물을 조회할 수 없습니다");
            console.log("error" + error);
        }
    });

    $("#write-modal").addClass("is-active");
}