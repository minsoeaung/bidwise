package com.bidwise.bids.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class BidNotFoundException extends RuntimeException {
    public BidNotFoundException(Long id) {
        super("Could not find bid " + id);
    }
}