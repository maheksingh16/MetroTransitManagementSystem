package com.example.metrobookingsystem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByBooking_Id(Long bookingId);
}