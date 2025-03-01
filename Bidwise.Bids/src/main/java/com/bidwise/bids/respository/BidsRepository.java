package com.bidwise.bids.respository;

import com.bidwise.bids.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BidsRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByItemIdOrderByCreatedAtDesc(int itemId);

    Optional<Bid> findByItemIdAndBidderId(int itemId, int bidderId);

    List<Bid> findByBidderId(int bidderId);

    List<Bid> findTop2ByItemIdOrderByAmountDesc(int itemId);
}
