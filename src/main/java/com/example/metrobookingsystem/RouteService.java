package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id).orElse(null);
    }

    public Route updateRoute(Long id, Route route) {

        Route existingRoute = routeRepository.findById(id).orElse(null);

        if (existingRoute != null) {
            existingRoute.setRouteName(route.getRouteName());
            existingRoute.setEstimatedTimeMinutes(route.getEstimatedTimeMinutes());
            existingRoute.setActive(route.getActive());

            return routeRepository.save(existingRoute);
        }

        return null;
    }

    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }
}