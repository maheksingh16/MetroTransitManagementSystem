package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @PostMapping
    public Station createStation(@RequestBody Station station) {
        return stationService.createStation(station);
    }

    @GetMapping("/stationbyId/{id}")
    public Station getStationById(@PathVariable Long id) {
        return stationService.getStationById(id);
    }

    @PutMapping("/Stationupdate/{id}")
    public Station updateStation(@PathVariable Long id,
                                 @RequestBody Station station) {
        return stationService.updateStation(id, station);
    }

    @DeleteMapping("/DeleteStation/{id}")
    public void deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
    }

    @GetMapping("/allstations")
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }
}