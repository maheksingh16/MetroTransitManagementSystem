package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trains")
public class TrainController {

    @Autowired
    private TrainService trainService;

    @GetMapping("/all")
    public List<Train> getAllTrains() {
        return trainService.getAllTrains();
    }

    @GetMapping("/id/{id}")
    public Train getTrainById(@PathVariable Long id) {
        return trainService.getTrainById(id);
    }

    @PostMapping("/add")
    public Train createTrain(@RequestBody Train train) {
        return trainService.createTrain(train);
    }

    @PutMapping("/update/{id}")
    public Train updateTrain(@PathVariable Long id, @RequestBody Train train) {
        return trainService.updateTrain(id, train);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTrain(@PathVariable Long id) {
        trainService.deleteTrain(id);
    }
}