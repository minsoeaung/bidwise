package com.bidwise.comments.model;

public class CommentCreateOrUpdateDto {
    private Long commentId;
    private int itemId;
    private String commentText;

    public CommentCreateOrUpdateDto(int itemId, String commentText) {
        this.itemId = itemId;
        this.commentText = commentText;
    }

    // Getters and Setters
    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
}
