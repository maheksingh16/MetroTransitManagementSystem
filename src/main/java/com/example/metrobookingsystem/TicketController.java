package com.example.metrobookingsystem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private static final Logger logger = LoggerFactory.getLogger(TicketController.class);

    private final TicketRepository ticketRepository;
    private final MinioService minioService;
    private final QrCodeService qrCodeService;

    public TicketController(
            TicketRepository ticketRepository,
            MinioService minioService,
            QrCodeService qrCodeService) {

        this.ticketRepository = ticketRepository;
        this.minioService = minioService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    @GetMapping("/booking/{bookingId}")
    public Ticket getTicketByBooking(@PathVariable Long bookingId) {
        return ticketRepository.findByBooking_Id(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found for booking id: " + bookingId));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getQrCode(@PathVariable Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        return buildQrResponse(ticket);
    }

    @GetMapping("/booking/{bookingId}/qr")
    public ResponseEntity<byte[]> getQrCodeByBooking(@PathVariable Long bookingId) {
        Ticket ticket = ticketRepository.findByBooking_Id(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found for booking id: " + bookingId));

        return buildQrResponse(ticket);
    }

    private ResponseEntity<byte[]> buildQrResponse(Ticket ticket) {
        byte[] qrCode = null;

        if (ticket.getQrObjectName() != null && !ticket.getQrObjectName().isBlank()) {
            try {
                qrCode = minioService.getQrCode(ticket.getQrObjectName());
            } catch (RuntimeException ex) {
                logger.warn("Unable to retrieve stored QR for {}. Generating QR on demand.", ticket.getTicketNumber(), ex);
            }
        }

        if (qrCode == null) {
            qrCode = qrCodeService.generateQrCode(ticket.getTicketNumber());
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }
}
