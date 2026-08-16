package com.example.metrobookingsystem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final QrCodeService qrCodeService;
    private final MinioService minioService;

    public TicketService(
            TicketRepository ticketRepository,
            QrCodeService qrCodeService,
            MinioService minioService) {

        this.ticketRepository = ticketRepository;
        this.qrCodeService = qrCodeService;
        this.minioService = minioService;
    }

    @Transactional
    public Ticket createTicket(Booking booking) {

        String ticketNumber =
                "TKT-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setPassengerName(
                booking.getUser().getFirstName() + " " +
                booking.getUser().getLastName()
        );
        ticket.setPassengerGender("UNKNOWN");
        ticket.setTicketNumber(ticketNumber);
        ticket.setValidFrom(LocalDateTime.now());
        ticket.setValidUntil(booking.getValidUntil());
        ticket.setFare(booking.getTotalFare());
        ticket.setStatus(TicketStatus.ACTIVE);

        ticket = ticketRepository.save(ticket);

        byte[] qrCode =
                qrCodeService.generateQrCode(ticketNumber);

        String objectName =
                "tickets/" + ticketNumber + ".png";

        try {
            minioService.uploadQrCode(objectName, qrCode);
            ticket.setQrObjectName(objectName);
        } catch (RuntimeException ex) {
            // Demo fallback: the QR endpoint can regenerate the code from the ticket number
            // when object storage is unavailable.
            logger.warn("QR object storage unavailable for {}. QR will be generated on demand.", ticketNumber, ex);
        }

        return ticketRepository.save(ticket);
    }
}