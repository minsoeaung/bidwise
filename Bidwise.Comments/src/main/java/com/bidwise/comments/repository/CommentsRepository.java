package com.bidwise.comments.repository;

import com.bidwise.comments.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentsRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findAllByItemId(int itemId, Pageable pageable);
}