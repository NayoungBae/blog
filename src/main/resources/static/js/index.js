let url = "/api/posts"; //이동할 url
/*
* 단위페이지: 하단에 previous나 Next page를 누르면 페이지 번호가 10개 묶음으로 바뀜
*           ex) 1 2 3 4 5 6 7 8 9 10 : 한 묶음
*               11 12 13 14 15 16 17 18 19 20 : 한 묶음
* */

$(document).ready(function() {
    //page번호 세팅 후 게시물 목록 구성
    getPagingAndPostsData(url, 0, 0);



    //글쓰기 버튼 누르면 모달로 글쓰기 창이 나타남
    $("#write-btn").click(function() {
        $("#write-title").val("");
        $("#write-name").val("");
        $("#write-content").val("");
        $("#write-name").attr("disabled", false); //작성자 이름 못 바꾸게 막았던거 풀기
        $("#modal-name").text("글쓰기");
        $("#modify-post-btn").hide();
        $("#save-post-btn").show();
        $("#write-modal").addClass("is-active");
    });



    //체크박스 하나 선택해서 게시물 삭제
    $("#delete-btn").click(function() {
        let checked_count = $("input:checkbox[name=check]:checked").length;
        if(checked_count > 1) {
            alert("하나만 선택해주세요");
            $("input:checkbox[name=check]").prop("checked", false);
            return;
        }
        if(checked_count == 0) {
            alert("삭제할 게시물을 선택해주세요");
            return;
        }
        if(confirm("삭제하시겠습니까?")) {
            let checked_value = $("input:checkbox[name=check]:checked").val();
            $.ajax({
                type:"DELETE",
                url:`/api/posts/${checked_value}`,
                success: function() {
                    window.location.reload();
                }
            });
        }

    });



    //글 저장(게시물 올리기)
    $("#save-post-btn").click(function() {
        writePost();
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
        $("#save-post-btn").hide();
        $("#write-name").attr("disabled", true); //작성자 이름 못 바꾸게 막기
        $("#modal-name").text("글수정");
        $("#modify-post-btn").show();
        $("#write-modal").addClass("is-active");
    });

    //수정 완료
    $("#modify-post-btn").click(function() {
        modifyPost();
    });

    //글쓰기/수정 모달 취소버튼: input값 초기화 / 모달 닫기
    $("#cancel-btn").click(function () {
        if(confirm("취소하시겠습니까?")) {
            $("#write-title").val("");
            $("#write-name").val("");
            $("#write-content").val("");
            $("#write-modal").removeClass("is-active");
        }
    });



    //다음 페이지 단위로 이동
    //previous 버튼에 있는 값은 페이징 처리 시 페이지 번호의 십의자리 숫자임
    $("#pagination-next").click(function() {
        let current_previous_val = parseInt($("#pagination-previous").attr("value"));
        getPagingAndPostsData(url, current_previous_val + 1, (current_previous_val + 1)*10);
    });

    //이전 페이지 단위로 이동
    $("#pagination-previous").click(function() {
        let current_previous_val = parseInt($("#pagination-previous").attr("value"));
        getPagingAndPostsData(url, current_previous_val - 1, (current_previous_val - 1)*10);
    });
});

//페이징을 구성하고 데이터를 가져옴
function getPagingAndPostsData(url, current_page, select_page) {
    let url_include_page = "";
    if(url.includes("?")) {
        url_include_page = url + "&page=" + current_page;
    } else {
        url_include_page = url + "?page=" + current_page;
    }
    $.ajax({
        type:"GET",
        async: false, //전역변수에 값을 담기 위함
        url:url_include_page,
        success: function(response) {
            console.log(response);
            let result_length = response["content"].length;
            let result_count = response["totalElements"].toString();  //게시물 총 개수
            let page_number = response["pageable"]["pageNumber"].toString(); //현재 페이지(0부터 시작)
            let data_per_page = response["pageable"]["pageSize"].toString(); //한 페이지당 게시물 개수
            let total_pages = response["totalPages"].toString(); //총 페이지 수
            paging(current_page, result_count, result_length, page_number, total_pages);
            selectPage(select_page);
        }
    });
}


//게시물 데이터 모두 가져와 목록 만들기
function getPosts(url, current_page) {
    let url_include_page = "";
    if(url.includes("?")) {
        url_include_page = url + "&page=" + current_page;
    } else {
        url_include_page = url + "?page=" + current_page;
    }
    $.ajax({
        type:"GET",
        async: false, //전역변수에 값을 담기 위함
        url:url_include_page,
        success: function(response) {
            console.log(response);
            let result = response["content"];  //게시물 데이터
            console.log(result);
            if (result.length > 0) {
                $("#table-tbody").empty();
                for (let i = 0; i < result.length; i++) {
                    let id = result[i]["id"];
                    let title = result[i]["title"];
                    let name = result[i]["name"];
                    let modified_at_date = result[i]["modifiedAt"].substr(0,10);
                    let temp_html =
                        `<tr onclick="showDetail('${id}')">
                            <td onclick="event.cancelBubble=true">
                                <input id="${id}-checkbox" name="check" type="checkbox" value="${id}">
                            </td>
                            <th id="${id}">${id}</th>
                            <td id="${id}-title">${title}</td>
                            <td id="${id}-name">${name}</td>
                            <td id="${id}-modifieddate">${modified_at_date}</td>
                        </tr>`;
                    $("#table-tbody").append(temp_html);
                }
            } else {
                $("#table-tbody").empty();
                let temp_html =`<tr><td id="table-empty" colspan="5">작성한 글이 없습니다.</td></tr>`;
                $("#table-tbody").append(temp_html);
            }
        }
    });
}

//페이징처리
function paging(previous, result_count, result_length, page_number, total_pages) {
    let next = previous + 1;  //Next page 버튼값
    let remainder = total_pages % 10;
    let end_page = Math.floor(total_pages / 10);
    let for_start = (previous * 10) + 1;
    let for_end;
    if(previous == end_page) {
        for_end = (previous * 10) + remainder;
    } else {
        for_end = next * 10;
    }
    $("#pagination-list").empty();
    for(let i=for_start; i<=for_end; i++) {
        let page_tag = `<li><a id="page-${i-1}" class="pagination-link" 
                               aria-label="Goto page ${i}" onclick="selectPage('${i-1}')">${i}</a></li>`;
        $("#pagination-list").append(page_tag);
    }
    $("#pagination-previous").attr("value", previous);
    $("#pagination-next").attr("value", next);

    //맨 첫번째 페이지에 있을 때 previous 버튼 숨기기
    if($("#pagination-previous").attr("value") == "0" || result_length == 0) {
        $("#pagination-previous").hide();
    } else {
        $("#pagination-previous").show();
    }
    //가장 마지막 페이지에 있을 때 Next page 버튼 숨기기
    if($("#pagination-next").attr("value") == Math.ceil(total_pages / 10) || result_length == 0) {
        $("#pagination-next").hide();
    } else {
        $("#pagination-next").show();
    }
}

//선택한 페이지로 이동
function selectPage(page_number) {
    $(".pagination-link").removeClass("is-current");
    $(`#page-${page_number}`).addClass("is-current");

    getPosts(url, page_number);
}

//검색
function search() {
    if(window.event.keyCode == 13) {
        let search_select = $("#search-select").val().trim();
        let search_input = $("#search-input").val().trim();
        url = "";
        if($("#search-input").val() == "") {
            url = "/api/posts";
        } else {
            url = `/api/posts?${search_select}=${search_input}`;
        }
        getPagingAndPostsData(url, 0, 0);
    }
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

    //버튼 여러번 누르는 것 방지
    $("#save-post-btn").attr("disabled", true);
    let data = {title:title, name:name, content:content};
    $.ajax({
        type:"POST",
        url:"/api/posts",
        contentType:"application/json",
        data: JSON.stringify(data),
        success: function(response) {
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

    //버튼 여러번 누르는 것 방지
    $("#modify-post-btn").attr("disabled", true);
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