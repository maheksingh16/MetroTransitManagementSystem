package com.example.metrobookingsystem;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trains")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String trainNumber;

    @Column(nullable = false)
    private Integer coachCount;

    @Column(nullable = false)
    private Boolean active = true;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTrainNumber() {
		return trainNumber;
	}

	public void setTrainNumber(String trainNumber) {
		this.trainNumber = trainNumber;
	}

	public Integer getCoachCount() {
		return coachCount;
	}

	public void setCoachCount(Integer coachCount) {
		this.coachCount = coachCount;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}