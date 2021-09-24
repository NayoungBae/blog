package com.sparta.blog.controller;

import com.sparta.blog.models.Post;
import com.sparta.blog.models.PostRequestDto;
import com.sparta.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class PostController {

    private final PostRepository postRepository;

    @PostMapping("/api/posts")
    public Post writePost(@RequestBody PostRequestDto requestDto) {
        Post post = new Post(requestDto);
        return postRepository.save(post);
    }

    @GetMapping("/api/posts")
    public List<Post> getPosts() {
        return postRepository.findAll();
    }

}
