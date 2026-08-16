package com.example.metrobookingsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping("/verify/{bookingId}")
    public Booking verifyBooking(@PathVariable Long bookingId) {
        return staffService.verifyBooking(bookingId);
    }
    @PostMapping("/check-in/{bookingId}")
    public Booking checkInBooking(@PathVariable Long bookingId) {
        return staffService.checkInBooking(bookingId);
    }

    @PostMapping("/check-out/{bookingId}")
    public Booking checkOutBooking(@PathVariable Long bookingId) {
        return staffService.checkOutBooking(bookingId);
    }
}