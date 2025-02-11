package com.bidwise.bids.advice;

import com.bidwise.bids.exception.BidNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class CommentNotFoundAdvice {

    @ExceptionHandler(BidNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String commentNotFoundHandler(BidNotFoundException ex) {
        return ex.getMessage();
    }
}