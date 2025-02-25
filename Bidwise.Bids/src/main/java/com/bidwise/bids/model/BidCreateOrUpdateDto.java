package com.bidwise.bids.model;

public class BidCreateOrUpdateDto {
    private int itemId;
    private double amount;

    public BidCreateOrUpdateDto(int itemId, double amount) {
        this.itemId = itemId;
        this.amount = amount;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
