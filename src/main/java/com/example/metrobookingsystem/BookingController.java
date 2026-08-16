package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/add")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }
    @PostMapping("/{id}/check-out")
    public Booking checkOut(@PathVariable Long id) {
        return bookingService.checkOut(id);
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/id/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @PutMapping("/update/{id}")
    public Booking updateBooking(
            @PathVariable Long id,
            @RequestBody Booking booking) {

        return bookingService.updateBooking(id, booking);
    }
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
    @PostMapping("/{id}/check-in")
    public Booking checkIn(@PathVariable Long id) {
        return bookingService.checkIn(id);
    }
    
}