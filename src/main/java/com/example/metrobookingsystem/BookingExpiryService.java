package com.example.metrobookingsystem;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class BookingExpiryService {

    private final BookingRepository bookingRepository;

    public BookingExpiryService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void expireBookings() {

        List<Booking> bookings = bookingRepository.findAll();

        for (Booking booking : bookings) {

            if (booking.getStatus() == BookingStatus.ACTIVE &&
                booking.getValidUntil().isBefore(LocalDateTime.now())) {

                booking.setStatus(BookingStatus.EXPIRED);
                bookingRepository.save(booking);
            }
        }
    }
}