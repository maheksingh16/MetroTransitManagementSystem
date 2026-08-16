package com.example.metrobookingsystem;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "lines")
public class Line {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToMany
    @JoinTable(
        name = "line_station",
        joinColumns = @JoinColumn(name = "line_id"),
        inverseJoinColumns = @JoinColumn(name = "station_id")
    )
    private List<Station> stations = new ArrayList<>();
    public List<Station> getStations() {
		return stations;
	}

	public void setStations(List<Station> stations) {
		this.stations = stations;
	}

	@Column(nullable = false, unique = true)
    private String lineName;

    @Column(nullable = false)
    private String lineColor;
    

    // Default constructor
    public Line() {
    }

    public Line(Long id, String lineName, String lineColor) {
        this.id = id;
        this.lineName = lineName;
        this.lineColor = lineColor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public String getLineColor() {
        return lineColor;
    }

    public void setLineColor(String lineColor) {
        this.lineColor = lineColor;
    }
}