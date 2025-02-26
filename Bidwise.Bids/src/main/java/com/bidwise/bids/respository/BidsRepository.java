package com.bidwise.bids.respository;

import com.bidwise.bids.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BidsRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByItemIdOrderByCreatedAtDesc(int itemId);

    Optional<Bid> findByItemIdAndBidderId(int itemId, int bidderId);

//    @Query("SELECT TOP 2 b FROM Bids b WHERE b.ItemId = :ItemId ORDER BY b.Amount DESC")
    List<Bid> findTop2ByItemIdOrderByAmountDesc(int itemId);
}
