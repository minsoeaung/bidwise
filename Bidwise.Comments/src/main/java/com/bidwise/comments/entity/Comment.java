package com.bidwise.comments.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Comments")
public class Comment {

    @Id
    @Column(name = "Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ItemId", nullable = false)
    private int itemId;

    @Column(name = "UserId", nullable = false)
    private int userId;

    @Column(name = "UserName", nullable = false)
    private String userName;

    @Column(name = "CommentText", nullable = false)
    private String commentText;

    @CreationTimestamp
    @Column(name = "CreatedAt",
            nullable = false,
            updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt", nullable = false)
    private LocalDateTime updatedAt;

    public Comment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Comment))
            return false;
        Comment comment = (Comment) o;
        return Objects.equals(this.id, comment.id)
                && Objects.equals(this.commentText, comment.commentText)
                && Objects.equals(this.itemId, comment.itemId)
                && Objects.equals(this.userId, comment.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.commentText);
    }

//    @Override
//    public String toString() {
//        return "Comment{" + "id=" + this.id + ", content='" + this.commentText + '\'' + ", userId='" + this.userId + '\'' + '}';
//    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}