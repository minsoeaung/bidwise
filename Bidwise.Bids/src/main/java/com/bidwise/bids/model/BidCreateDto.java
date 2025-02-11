package com.bidwise.bids.model;

public class BidCreateDto {
    private int itemId;
    private double amount;

    public BidCreateDto(int itemId, double amount) {
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
