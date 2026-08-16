package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lines")
public class LineController {

    @Autowired
    private LineService lineService;

    @GetMapping("/all")
    public List<Line> getAllLines() {
        return lineService.getAllLines();
    }

    @GetMapping("/id/{id}")
    public Line getLineById(@PathVariable Long id) {
        return lineService.getLineById(id);
    }

    @PostMapping("/add")
    public Line createLine(@RequestBody Line line) {
        return lineService.createLine(line);
    }
    @PostMapping("/{lineId}/stations/{stationId}")
    public Line addStationToLine(
            @PathVariable Long lineId,
            @PathVariable Long stationId) {

        return lineService.addStationToLine(lineId, stationId);
    }

    @DeleteMapping("/{lineId}/stations/{stationId}")
    public Line removeStationFromLine(
            @PathVariable Long lineId,
            @PathVariable Long stationId) {

        return lineService.removeStationFromLine(lineId, stationId);
    }
    @PutMapping("/update/{id}")
    public Line updateLine(@PathVariable Long id, @RequestBody Line line) {
        return lineService.updateLine(id, line);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteLine(@PathVariable Long id) {
        lineService.deleteLine(id);
    }
}