package com.example.metrobookingsystem;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String routeName;

    @Column(nullable = false)
    private Integer estimatedTimeMinutes;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "route")
	@JsonIgnore
    private List<RouteStation> routeStations;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRouteName() {
		return routeName;
	}

	public void setRouteName(String routeName) {
		this.routeName = routeName;
	}

	public Integer getEstimatedTimeMinutes() {
		return estimatedTimeMinutes;
	}

	public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) {
		this.estimatedTimeMinutes = estimatedTimeMinutes;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public List<RouteStation> getRouteStations() {
		return routeStations;
	}

	public void setRouteStations(List<RouteStation> routeStations) {
		this.routeStations = routeStations;
	}
}