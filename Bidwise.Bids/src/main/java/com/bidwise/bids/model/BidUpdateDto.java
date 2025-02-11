package com.bidwise.bids.model;

public class BidUpdateDto {
    private int amount;

    public BidUpdateDto(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
