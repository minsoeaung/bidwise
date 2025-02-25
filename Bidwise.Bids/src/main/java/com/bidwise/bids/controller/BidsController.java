package com.bidwise.bids.controller;

import com.bidwise.bids.entity.Bid;
import com.bidwise.bids.model.BidCreateOrUpdateDto;
import com.bidwise.bids.model.UserProfile;
import com.bidwise.bids.respository.BidsRepository;
import com.bidwise.bids.util.UserProfileUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/bids")
public class BidsController {
    private final BidsRepository repository;

    BidsController(BidsRepository repository) {
        this.repository = repository;
    }

    @GetMapping()
    List<Bid> allByItemId(@RequestParam int itemId) {
        return repository.findByItemIdOrderByAmountDesc(itemId);
    }

    @PostMapping()
    Bid createOrUpdateBid(@RequestBody BidCreateOrUpdateDto bidDto) {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        int bidderId = userProfile.getId();
        int itemId = bidDto.getItemId();
        double amount = bidDto.getAmount();

        Optional<Bid> existingBid = repository.findByItemIdAndBidderId(itemId, bidderId);

        Bid bid = new Bid();

        if (existingBid.isPresent()) {
            bid = existingBid.get();
            bid.setAmount(bidDto.getAmount());
        } else {
            bid = new Bid();
            bid.setItemId(itemId);
            bid.setBidderId(bidderId);
            bid.setBidderName(userProfile.getUserName());
            bid.setAmount(bidDto.getAmount());
        }

        return repository.save(bid);
    }

    // withdraw from auction
    // TODO: only allow if not expired
    @DeleteMapping("{id}")
    void deleteBid(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

