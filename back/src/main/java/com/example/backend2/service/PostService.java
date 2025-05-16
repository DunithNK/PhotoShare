package com.example.backend2.service;

import com.example.backend2.dto.PostDTO;
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
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    private PostDTO convertToDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setPostid(post.getPostid());
        postDTO.setUserid(post.getUser().getId());
        postDTO.setUsername(post.getUser().getUserName());
        postDTO.setPostlink(post.getPostlink());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setCategory(post.getCategory());
        return postDTO;
    }

    private Post convertToEntity(PostDTO postDTO) {
        Post post = new Post();
        post.setPostid(postDTO.getPostid());
        post.setPostlink(postDTO.getPostlink());
        post.setCreatedAt(postDTO.getCreatedAt() != null ? postDTO.getCreatedAt() : LocalDateTime.now());
        post.setCategory(postDTO.getCategory());

        if (postDTO.getUserid() != null) {
            User user = userRepository.findById(postDTO.getUserid())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + postDTO.getUserid()));
            post.setUser(user);
        }

        return post;
    }

    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PostDTO> getRecentPosts() {
        return postRepository.findTop6ByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PostDTO createPost(PostDTO postDTO) {
        Post post = convertToEntity(postDTO);
        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    public void deletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new EntityNotFoundException("Post not found with id: " + postId);
        }

        postRepository.deleteById(postId);
        commentRepository.deleteByPostPostid(postId);
    }
}

