package com.bidwise.comments.model;

public class CommentCreateDto {
    private int itemId;
    private String commentText;

    public CommentCreateDto(int itemId, String commentText) {
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
}
