package com.example.backend2.service;

import com.example.backend2.dto.CommentDTO;
import com.example.backend2.model.Comment;
import com.example.backend2.model.Post;
import com.example.backend2.model.User;
import com.example.backend2.repository.CommentRepository;
import com.example.backend2.repository.PostRepository;
import com.example.backend2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentDTO createComment(CommentDTO commentDTO) {
        Post post = postRepository.findById(commentDTO.getPostid())
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        User user = userRepository.findById(commentDTO.getUserid())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));


        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setComment(commentDTO.getComment());
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    public CommentDTO updateComment(Long commentId, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        comment.setComment(commentDTO.getComment());

        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }

    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new EntityNotFoundException("Comment not found");
        }
        commentRepository.deleteById(commentId);
    }

    public List<CommentDTO> getCommentsByPostId(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new EntityNotFoundException("Post not found");
        }
        List<Comment> comments = commentRepository.findByPostPostid(postId);
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setCommentid(comment.getCommentid());
        dto.setPostid(comment.getPost().getPostid());
        dto.setUserid(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUserName());
        dto.setComment(comment.getComment());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
