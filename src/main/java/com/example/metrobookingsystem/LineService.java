package com.example.metrobookingsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LineService {

    @Autowired
    private LineRepository lineRepository;
    @Autowired
    private StationRepository stationRepository;
    public Line addStationToLine(Long lineId, Long stationId) {

        Line line = lineRepository.findById(lineId).orElse(null);
        Station station = stationRepository.findById(stationId).orElse(null);

        if (line != null && station != null) {
            line.getStations().add(station);
            return lineRepository.save(line);
        }

        return null;
    }

    public Line removeStationFromLine(Long lineId, Long stationId) {

        Line line = lineRepository.findById(lineId).orElse(null);
        Station station = stationRepository.findById(stationId).orElse(null);

        if (line != null && station != null) {
            line.getStations().remove(station);
            return lineRepository.save(line);
        }

        return null;
    }
    public Line createLine(Line line) {
        return lineRepository.save(line);
    }

 
    public List<Line> getAllLines() {
        return lineRepository.findAll();
    }

    public Line getLineById(Long id) {
        return lineRepository.findById(id).orElse(null);
    }
    public Line updateLine(Long id, Line line) {

        Line existingLine = lineRepository.findById(id).orElse(null);

        if (existingLine != null) {

            existingLine.setLineName(line.getLineName());
            existingLine.setLineColor(line.getLineColor());

            return lineRepository.save(existingLine);
        }

        return null;
    }

    public void deleteLine(Long id) {
        lineRepository.deleteById(id);
    }
    
}