package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    public Train createTrain(Train train) {
        return trainRepository.save(train);
    }

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Train getTrainById(Long id) {
        return trainRepository.findById(id).orElse(null);
    }

    public Train updateTrain(Long id, Train train) {

        Train existingTrain = trainRepository.findById(id).orElse(null);

        if (existingTrain != null) {
        	existingTrain.setTrainNumber(train.getTrainNumber());
        	existingTrain.setCoachCount(train.getCoachCount());
        	existingTrain.setActive(train.getActive());

            return trainRepository.save(existingTrain);
        }

        return null;
    }

    public void deleteTrain(Long id) {
        trainRepository.deleteById(id);
    }
}