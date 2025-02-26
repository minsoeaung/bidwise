package com.bidwise.bids.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {

    @KafkaListener(topics = "AuctionCreated")
    public void listenGroupFoo(String message) {
        System.out.println("Received Message in Topic AuctionCreated: " + message);
    }
}
