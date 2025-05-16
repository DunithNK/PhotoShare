package com.example.backend2.repository;

import com.example.backend2.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostPostid(Long postId);
    void deleteByPostPostid(Long postId);
}