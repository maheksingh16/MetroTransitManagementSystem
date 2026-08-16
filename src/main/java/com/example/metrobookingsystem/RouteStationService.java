package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteStationService {

    @Autowired
    private RouteStationRepository routeStationRepository;

    public RouteStation createRouteStation(RouteStation routeStation) {
        return routeStationRepository.save(routeStation);
    }

    public List<RouteStation> getAllRouteStations() {
        return routeStationRepository.findAll();
    }

    public RouteStation getRouteStationById(Long id) {
        return routeStationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route station not found with id: " + id));
    }

    public RouteStation updateRouteStation(Long id, RouteStation routeStation) {

        RouteStation existingRouteStation = routeStationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route station not found with id: " + id));

        existingRouteStation.setRoute(routeStation.getRoute());
        existingRouteStation.setStation(routeStation.getStation());
        existingRouteStation.setStationOrder(routeStation.getStationOrder());
        existingRouteStation.setDistanceFromPrevious(routeStation.getDistanceFromPrevious());
        existingRouteStation.setTimeFromPrevious(routeStation.getTimeFromPrevious());

        return routeStationRepository.save(existingRouteStation);
    }

    public void deleteRouteStation(Long id) {
        if (!routeStationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Route station not found with id: " + id);
        }
        routeStationRepository.deleteById(id);
    }
}