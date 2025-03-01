package com.bidwise.bids.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "Bids")
public class Bid {
    @Id
    @Column(name = "Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ItemId", nullable = false)
    private int itemId;

    @Column(name = "BidderId", nullable = false)
    private int bidderId;

    @Column(name = "BidderName", nullable = false)
    private String bidderName;

    @Column(name = "Amount", nullable = false)
    private double amount;

    @CreationTimestamp
    @Column(name = "CreatedAt",
            nullable = false,
            updatable = false,
            columnDefinition = "datetimeoffset(7)")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt", nullable = false, columnDefinition = "datetimeoffset(7)")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime updatedAt;

    public Bid() {
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

    public int getBidderId() {
        return bidderId;
    }

    public void setBidderId(int bidderId) {
        this.bidderId = bidderId;
    }

    public String getBidderName() {
        return bidderName;
    }

    public void setBidderName(String bidderName) {
        this.bidderName = bidderName;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
