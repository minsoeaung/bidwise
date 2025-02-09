package com.bidwise.comments.controller;

import com.bidwise.comments.entity.Comment;
import com.bidwise.comments.exception.CommentNotFoundException;
import com.bidwise.comments.model.CommentCreateDto;
import com.bidwise.comments.model.CommentUpdateDto;
import com.bidwise.comments.model.UserProfile;
import com.bidwise.comments.repository.CommentsRepository;
import com.bidwise.comments.util.UserProfileUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/comments")
class CommentsController {

    private final CommentsRepository repository;

    CommentsController(CommentsRepository repository) {
        this.repository = repository;
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
    Comment newComment(@RequestBody CommentCreateDto commentDto) {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        Comment comment = new Comment();
        comment.setCommentText(commentDto.getCommentText());
        comment.setItemId(commentDto.getItemId());
        comment.setUserId(userProfile.getId());
        comment.setUserName(userProfile.getUserName());
        return repository.save(comment);
    }

    @GetMapping("{id}")
    Comment one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(id));
    }

    @PutMapping("{id}")
    Comment replaceComment(@RequestBody CommentUpdateDto commentDto, @PathVariable Long id) {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        return repository.findById(id)
                .map(comment -> {
                    if (comment.getUserId() != userProfile.getId())
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own comment");

                    comment.setCommentText(commentDto.getCommentText());
                    return repository.save(comment);
                })
                .orElseThrow(() -> new CommentNotFoundException(id));
    }

    @DeleteMapping("{id}")
    void deleteComment(@PathVariable Long id) {
        repository.deleteById(id);
    }
}