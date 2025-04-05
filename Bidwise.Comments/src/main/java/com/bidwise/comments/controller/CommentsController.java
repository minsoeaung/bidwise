package com.bidwise.comments.controller;

import com.bidwise.comments.entity.Comment;
import com.bidwise.comments.exception.CommentNotFoundException;
import com.bidwise.comments.model.CommentCreateOrUpdateDto;
import com.bidwise.comments.model.UserProfile;
import com.bidwise.comments.repository.CommentsRepository;
import com.bidwise.comments.util.UserProfileUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/comments")
class CommentsController {

    private final CommentsRepository repository;
    @Autowired
    private final KafkaTemplate<String, String> kafkaTemplate;

    CommentsController(CommentsRepository repository, KafkaTemplate<String, String> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping()
    Page<Comment> allByItemId(
            @RequestParam int itemId,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort.Direction direction = sort.equalsIgnoreCase("oldest")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
        return repository.findAllByItemId(itemId, pageable);
    }

    @PostMapping()
    Comment newComment(@RequestBody CommentCreateOrUpdateDto commentDto) throws JsonProcessingException {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

        if (commentDto.getCommentId() == 0) {
            Comment comment = new Comment();
            comment.setCommentText(commentDto.getCommentText());
            comment.setItemId(commentDto.getItemId());
            comment.setUserId(userProfile.getId());
            comment.setUserName(userProfile.getUserName());
            comment = repository.save(comment);

            kafkaTemplate.send("CommentCreated", String.valueOf(comment.getItemId()), objectMapper.writeValueAsString(comment));

            return comment;
        } else {
            return repository.findById(commentDto.getCommentId())
                    .map(comment -> {
                        if (comment.getUserId() != userProfile.getId())
                            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own comment");

                        comment.setCommentText(commentDto.getCommentText());

                        try {
                            kafkaTemplate.send("CommentUpdated", String.valueOf(comment.getItemId()), objectMapper.writeValueAsString(comment));
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }

                        return repository.save(comment);
                    })
                    .orElseThrow(() -> new CommentNotFoundException(commentDto.getCommentId()));
        }
    }

    @GetMapping("{id}")
    Comment one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(id));
    }

    @DeleteMapping("{id}")
    void deleteComment(@PathVariable Long id) {
        repository.deleteById(id);
    }
}