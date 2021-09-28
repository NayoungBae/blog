package com.sparta.blog.controller;

import com.sparta.blog.models.Post;
import com.sparta.blog.models.PostRequestDto;
import com.sparta.blog.repository.PostRepository;
import com.sparta.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class PostController {

    private final PostRepository postRepository;
    private final PostService postService;

    @PostMapping("/api/posts")
    public Post writePost(@RequestBody PostRequestDto requestDto) {
        Post post = new Post(requestDto);
        return postRepository.save(post);
    }

//    @GetMapping("/api/posts")
//    public List<Post> getPosts() {
//        return postRepository.findAllByOrderByModifiedAtDesc();
//    }

    @GetMapping("/api/posts")
    public Page<Post> getPosts(@RequestParam(value="title", required = false, defaultValue = "") String title,
                                  @RequestParam(value="name", required = false, defaultValue = "") String name,
                                  @RequestParam(value="content", required = false, defaultValue = "") String content,
                                  @RequestParam(value="page" , required = false, defaultValue = "0") String page) {
        System.out.println("title: " + title + ", title length: " + title.length());
        System.out.println("name: " + name + ", name length: " + name.length());
        System.out.println("content: " + content + ", content length: " + content.length());
        //List<Post> result;
        Page<Post> result;
        int currnt_page = Integer.parseInt(page);
        PageRequest pageRequest = PageRequest.of(currnt_page, 10); //현재페이지(0부터 시작), 한 페이지 당 출력 개수
        if(title.length() > 0) {
            //result = postRepository.findByTitleContainingOrderByModifiedAtDesc(title);
            result = postRepository.findByTitleContainingOrderByModifiedAtDesc(title, pageRequest);
        } else if(name.length() > 0) {
            //result = postRepository.findByNameContainingOrderByModifiedAtDesc(name);
            result = postRepository.findByNameContainingOrderByModifiedAtDesc(name, pageRequest);
        } else if(content.length() > 0) {
            //result = postRepository.findByContentContainingOrderByModifiedAtDesc(content);
            result = postRepository.findByContentContainingOrderByModifiedAtDesc(content, pageRequest);
        } else {
            //result = postRepository.findAllByOrderByModifiedAtDesc();
            result = postRepository.findAllByOrderByModifiedAtDesc(pageRequest);
        }
        return result;
    }

    @GetMapping("/api/posts/{id}")
    public Post getPost(@PathVariable Long id) {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new NullPointerException("PostController) DB에 ID값이 없습니다.")
        );
        return post;
    }

    @PutMapping("/api/posts/{id}")
    public Long updatePost(@PathVariable Long id, @RequestBody PostRequestDto requestDto) {
        return postService.update(id, requestDto);
    }

    @DeleteMapping("/api/posts/{id}")
    public Long deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return id;
    }

}
