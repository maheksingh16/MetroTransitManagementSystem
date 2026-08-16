package com.example.metrobookingsystem;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import java.util.ArrayList;
@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToMany(mappedBy = "stations")
    @JsonIgnore
    private List<Line> lines = new ArrayList<>();

    @Column(nullable = false, unique = true, length = 20)
    private String stationCode;

    @Column(nullable = false, length = 100)
    private String stationName;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false)
    private Boolean active = true;

    public Station() {
    }

    public List<Line> getLines() {
		return lines;
	}

	public void setLines(List<Line> lines) {
		this.lines = lines;
	}

	public Station(Long id, String stationCode, String stationName, String city, Boolean active) {
        this.id = id;
        this.stationCode = stationCode;
        this.stationName = stationName;
        this.city = city;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStationCode() {
        return stationCode;
    }

    public void setStationCode(String stationCode) {
        this.stationCode = stationCode;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}