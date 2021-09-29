package com.sparta.blog.controller;

import com.sparta.blog.models.Post;
import com.sparta.blog.models.PostRequestDto;
import com.sparta.blog.repository.PostRepository;
import com.sparta.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class PostController {

    private final PostRepository postRepository;
    private final PostService postService;

    //글쓰기 버튼 눌렀을 때 DB에 Insert
    @PostMapping("/api/posts")
    public Post writePost(@RequestBody PostRequestDto requestDto) {
        Post post = new Post(requestDto);
        return postRepository.save(post);
    }

    //게시물 전체 조회/검색 & 페이지 관련 데이터 조회
    @GetMapping("/api/posts")
    public Page<Post> getPosts(@RequestParam(value="title", required = false, defaultValue = "") String title,
                                  @RequestParam(value="name", required = false, defaultValue = "") String name,
                                  @RequestParam(value="content", required = false, defaultValue = "") String content,
                                  @RequestParam(value="page" , required = false, defaultValue = "0") String page) {
        //게시물 데이터와 페이지 관련 데이터 담는 변수
        Page<Post> result;
        int currnt_page = Integer.parseInt(page);
        //of 함수 매개변수: (현재페이지(0부터 시작), 한 페이지 당 출력 개수)
        PageRequest pageRequest = PageRequest.of(currnt_page, 10);
        if(title.length() > 0) {
            //제목으로 검색
            result = postRepository.findByTitleContainingOrderByModifiedAtDesc(title, pageRequest);
        } else if(name.length() > 0) {
            //작성자 이름으로 검색
            result = postRepository.findByNameContainingOrderByModifiedAtDesc(name, pageRequest);
        } else if(content.length() > 0) {
            //내용으로 검색
            result = postRepository.findByContentContainingOrderByModifiedAtDesc(content, pageRequest);
        } else {
            //전체 게시물 조회
            result = postRepository.findAllByOrderByModifiedAtDesc(pageRequest);
        }
        return result;
    }

    //게시물 상세내용 조회
    @GetMapping("/api/posts/{id}")
    public Post getPost(@PathVariable Long id) {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new NullPointerException("PostController) DB에 ID값이 없습니다.")
        );
        return post;
    }

    //게시물 수정
    @PutMapping("/api/posts/{id}")
    public Long updatePost(@PathVariable Long id, @RequestBody PostRequestDto requestDto) {
        return postService.update(id, requestDto);
    }

    //게시물 삭제
    @DeleteMapping("/api/posts/{id}")
    public Long deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return id;
    }

}
