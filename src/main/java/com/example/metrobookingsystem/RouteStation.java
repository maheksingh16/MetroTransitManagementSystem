package com.example.metrobookingsystem;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_stations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Column(nullable = false)
    private Integer stationOrder;

    @Column(nullable = false)
    private Double distanceFromPrevious;

    @Column(nullable = false)
    private Integer timeFromPrevious;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Route getRoute() {
		return route;
	}

	public void setRoute(Route route) {
		this.route = route;
	}

	public Station getStation() {
		return station;
	}

	public void setStation(Station station) {
		this.station = station;
	}

	public Integer getStationOrder() {
		return stationOrder;
	}

	public void setStationOrder(Integer stationOrder) {
		this.stationOrder = stationOrder;
	}

	public Double getDistanceFromPrevious() {
		return distanceFromPrevious;
	}

	public void setDistanceFromPrevious(Double distanceFromPrevious) {
		this.distanceFromPrevious = distanceFromPrevious;
	}

	public Integer getTimeFromPrevious() {
		return timeFromPrevious;
	}

	public void setTimeFromPrevious(Integer timeFromPrevious) {
		this.timeFromPrevious = timeFromPrevious;
	}
}