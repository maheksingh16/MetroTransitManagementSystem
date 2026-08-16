package com.example.metrobookingsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StationService {

    @Autowired
    private StationRepository stationRepository;

    public Station createStation(Station station) {
        return stationRepository.save(station);
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Station getStationById(Long id) {
        return stationRepository.findById(id).orElse(null);
    }

    public Station updateStation(Long id, Station station) {
        Station existingStation = stationRepository.findById(id).orElse(null);
        if (existingStation == null) {
            return null;
        }
        existingStation.setStationCode(station.getStationCode());
        existingStation.setStationName(station.getStationName());
        existingStation.setCity(station.getCity());
        existingStation.setActive(station.getActive());
        return stationRepository.save(existingStation);
    }

    public void deleteStation(Long id) {
        stationRepository.deleteById(id);
    }
}