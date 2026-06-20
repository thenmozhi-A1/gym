package com.example.gym.service;

import com.example.gym.entity.User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class NotificationTicketService {

    // Map of ticket -> User
    private final Map<String, User> ticketStore = new ConcurrentHashMap<>();

    public String generateTicket(User user) {
        String ticket = UUID.randomUUID().toString();
        ticketStore.put(ticket, user);
        
        // Ticket expires in 30 seconds
        Executors.newSingleThreadScheduledExecutor().schedule(() -> {
            ticketStore.remove(ticket);
        }, 30, TimeUnit.SECONDS);
        
        return ticket;
    }

    public User validateAndConsumeTicket(String ticket) {
        if (ticket == null) return null;
        return ticketStore.remove(ticket);
    }
}
