package com.example.metrobookingsystem;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false, length = 100)
    private String passengerName;
    @Column(nullable = false)
    private String passengerGender;
    @Column(nullable = false, unique = true, length = 30)
    private String ticketNumber;
    @Column
    private String qrObjectName;
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Booking getBooking() {
		return booking;
	}

	public void setBooking(Booking booking) {
		this.booking = booking;
	}

	public String getPassengerName() {
		return passengerName;
	}

	public void setPassengerName(String passengerName) {
		this.passengerName = passengerName;
	}

	public String getPassengerGender() {
		return passengerGender;
	}

	public void setPassengerGender(String passengerGender) {
		this.passengerGender = passengerGender;
	}

	public String getTicketNumber() {
		return ticketNumber;
	}

	public void setTicketNumber(String ticketNumber) {
		this.ticketNumber = ticketNumber;
	}

	public String getQrObjectName() {
		return qrObjectName;
	}

	public void setQrObjectName(String qrObjectName) {
		this.qrObjectName = qrObjectName;
	}

	public LocalDateTime getValidFrom() {
		return validFrom;
	}

	public void setValidFrom(LocalDateTime validFrom) {
		this.validFrom = validFrom;
	}

	public LocalDateTime getValidUntil() {
		return validUntil;
	}

	public void setValidUntil(LocalDateTime validUntil) {
		this.validUntil = validUntil;
	}

	public BigDecimal getFare() {
		return fare;
	}

	public void setFare(BigDecimal fare) {
		this.fare = fare;
	}

	public TicketStatus getStatus() {
		return status;
	}

	public void setStatus(TicketStatus status) {
		this.status = status;
	}

	public LocalDateTime getCheckedInAt() {
		return checkedInAt;
	}

	public void setCheckedInAt(LocalDateTime checkedInAt) {
		this.checkedInAt = checkedInAt;
	}

	public LocalDateTime getCheckedOutAt() {
		return checkedOutAt;
	}

	public void setCheckedOutAt(LocalDateTime checkedOutAt) {
		this.checkedOutAt = checkedOutAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Column(nullable = false)
    private LocalDateTime validFrom;

    @Column(nullable = false)
    private LocalDateTime validUntil;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal fare;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column
    private LocalDateTime checkedInAt;

    @Column
    private LocalDateTime checkedOutAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}