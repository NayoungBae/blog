package com.sparta.blog.repository;

import com.sparta.blog.models.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByOrderByModifiedAtDesc(Pageable pageable);
    Page<Post> findByTitleContainingOrderByModifiedAtDesc(String title, Pageable pageable);
    Page<Post> findByNameContainingOrderByModifiedAtDesc(String name, Pageable pageable);
    Page<Post> findByContentContainingOrderByModifiedAtDesc(String content, Pageable pageable);
}
