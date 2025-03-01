package com.bidwise.bids.controller;

import com.bidwise.bids.entity.Bid;
import com.bidwise.bids.model.BidCreateOrUpdateDto;
import com.bidwise.bids.model.UserProfile;
import com.bidwise.bids.respository.BidsRepository;
import com.bidwise.bids.util.UserProfileUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/bids")
public class BidsController {
    private final BidsRepository repository;

    @Autowired
    private final KafkaTemplate<String, String> kafkaTemplate;

    BidsController(BidsRepository repository, KafkaTemplate<String, String> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping()
    List<Bid> allByItemIdOrBidderId(
            @RequestParam(required = false) Integer itemId,
            @RequestParam(required = false) Integer bidderId) {
        if (itemId != null)
            return repository.findByItemIdOrderByCreatedAtDesc(itemId);

        if (bidderId != null)
            return repository.findByBidderId(bidderId);

        return Collections.emptyList();
    }

    @GetMapping("top-2")
    List<Bid> getTop2(@RequestParam int itemId) {
        return repository.findTop2ByItemIdOrderByAmountDesc(itemId);
    }

    @PostMapping()
    Bid createOrUpdateBid(@RequestBody BidCreateOrUpdateDto bidDto) throws JsonProcessingException {
        UserProfile userProfile = UserProfileUtils.getProfile();
        if (userProfile == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");

        int bidderId = userProfile.getId();
        int itemId = bidDto.getItemId();

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

        bid = repository.save(bid);

        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
        kafkaTemplate.send("BidPlaced", String.valueOf(bidDto.getItemId()), objectMapper.writeValueAsString(bid));

        return bid;
    }

    // withdraw from auction
    // TODO: only allow if not expired
    @DeleteMapping("{id}")
    void deleteBid(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

