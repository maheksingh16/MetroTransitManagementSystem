package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TicketService ticketService;

    @Transactional
    public Booking createBooking(Booking booking) {

        if (booking.getUser() == null || booking.getUser().getId() == null) {
            throw new IllegalArgumentException("Booking user id is required");
        }

        if (booking.getSchedule() == null || booking.getSchedule().getId() == null) {
            throw new IllegalArgumentException("Booking schedule id is required");
        }

        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + booking.getUser().getId()
                ));

        Schedule schedule = scheduleRepository.findById(booking.getSchedule().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Schedule not found with id: " + booking.getSchedule().getId()
                ));

        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setStatus(BookingStatus.ACTIVE);

        Booking savedBooking = bookingRepository.save(booking);

        ticketService.createTicket(savedBooking);

        return savedBooking;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking updateBooking(Long id, Booking booking) {

        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + id
                        ));

        existingBooking.setSchedule(booking.getSchedule());
        existingBooking.setJourneyDate(booking.getJourneyDate());
        existingBooking.setTotalPassengers(booking.getTotalPassengers());
        existingBooking.setTotalFare(booking.getTotalFare());

        return bookingRepository.save(existingBooking);
    }
    public Booking checkIn(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId
                        ));

        if (booking.getValidUntil()
                .isBefore(java.time.LocalDateTime.now())) {

            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);

            throw new IllegalStateException("Booking has expired");
        }

        if (booking.getStatus() != BookingStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Booking cannot be checked in. Current status: "
                            + booking.getStatus()
            );
        }

        booking.setStatus(BookingStatus.CHECKED_IN);

        return bookingRepository.save(booking);
    }

    public Booking checkOut(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId
                        ));

        if (booking.getStatus() != BookingStatus.CHECKED_IN) {
            throw new IllegalStateException(
                    "Booking cannot be checked out. Current status: "
                            + booking.getStatus()
            );
        }

        booking.setStatus(BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
    }
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}