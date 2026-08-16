package com.example.metrobookingsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StaffService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking verifyBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
    }

    public Booking checkInBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.ACTIVE) {
            throw new IllegalStateException("Booking cannot be checked in. Current status: " + booking.getStatus());
        }

        if (booking.getValidUntil().isBefore(java.time.LocalDateTime.now())) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw new IllegalStateException("Booking has expired");
        }

        booking.setStatus(BookingStatus.CHECKED_IN);

        return bookingRepository.save(booking);
    }

    public Booking checkOutBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new IllegalStateException("Booking cannot be checked out. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
}}