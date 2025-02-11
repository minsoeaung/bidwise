package com.bidwise.bids.respository;

import com.bidwise.bids.entity.Bid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidsRepository extends JpaRepository<Bid, Long> {
    Page<Bid> findAllByItemId(int itemId, Pageable pageable);
}
