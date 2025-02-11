package com.bidwise.bids.controller;

import com.bidwise.bids.entity.Bid;
import com.bidwise.bids.exception.BidNotFoundException;
import com.bidwise.bids.model.BidCreateDto;
import com.bidwise.bids.model.BidUpdateDto;
import com.bidwise.bids.model.UserProfile;
import com.bidwise.bids.respository.BidsRepository;
import com.bidwise.bids.util.UserProfileUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/bids")
public class BidsController {
    private final BidsRepository repository;

    BidsController(BidsRepository repository) {
        this.repository = repository;
    }

    @GetMapping()
    Page<Bid> allByItemId(
            @RequestParam int itemId,
            @RequestParam(defaultValue = "smallest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Sort.Direction direction = sort.equalsIgnoreCase("smallest")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "amount"));
        return repository.findAllByItemId(itemId, pageable);
    }

    @PostMapping()
    Bid newBid(@RequestBody BidCreateDto bidDto) {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        Bid bid = new Bid();
        bid.setAmount(bidDto.getAmount());
        bid.setItemId(bidDto.getItemId());
        bid.setBidderId(userProfile.getId());
        bid.setBidderName(userProfile.getUserName());
        return repository.save(bid);
    }

    // update bid amount
    @PutMapping("{id}")
    Bid replaceBid(@RequestBody BidUpdateDto bidDto, @PathVariable Long id) {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        return repository.findById(id)
                .map(bid -> {
                    if (bid.getBidderId() != userProfile.getId())
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own bid");

                    bid.setAmount(bidDto.getAmount());
                    return repository.save(bid);
                })
                .orElseThrow(() -> new BidNotFoundException(id));
    }

    // withdraw from auction
    // TODO: only allow if not expired
    @DeleteMapping("{id}")
    void deleteBid(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

