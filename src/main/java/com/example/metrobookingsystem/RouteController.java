package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping("/all")
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/id/{id}")
    public Route getRouteById(@PathVariable Long id) {
        return routeService.getRouteById(id);
    }

    @PostMapping("/add")
    public Route createRoute(@RequestBody Route route) {
        return routeService.createRoute(route);
    }

    @PutMapping("/update/{id}")
    public Route updateRoute(@PathVariable Long id, @RequestBody Route route) {
        return routeService.updateRoute(id, route);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
    }
}