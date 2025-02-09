package com.bidwise.comments.model;

public class CommentUpdateDto {
    private String commentText;

    public CommentUpdateDto(String commentText) {
        this.commentText = commentText;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}
