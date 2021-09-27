package com.sparta.blog.controller;

import com.sparta.blog.models.Post;
import com.sparta.blog.models.PostRequestDto;
import com.sparta.blog.repository.PostRepository;
import com.sparta.blog.service.PostService;
import lombok.RequiredArgsConstructor;
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
    public List<Post> searchPosts(@RequestParam(value="title", required = false, defaultValue = "") String title,
                                  @RequestParam(value="name", required = false, defaultValue = "") String name,
                                  @RequestParam(value="content", required = false, defaultValue = "") String content) {
        System.out.println("title: " + title + ", title length: " + title.length());
        System.out.println("name: " + name + ", name length: " + name.length());
        System.out.println("content: " + content + ", content length: " + content.length());
        List<Post> result;
        if(title.length() > 0) {
            result = postRepository.findByTitleContainingOrderByModifiedAtDesc(title);
        } else if(name.length() > 0) {
            result = postRepository.findByNameContainingOrderByModifiedAtDesc(name);
        } else if(content.length() > 0) {
            result = postRepository.findByContentContainingOrderByModifiedAtDesc(content);
        } else {
            result = postRepository.findAllByOrderByModifiedAtDesc();
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
