package com.example.metrobookingsystem;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id).orElse(null);
    }

    public Schedule updateSchedule(Long id, Schedule schedule) {

        Schedule existingSchedule =
                scheduleRepository.findById(id).orElse(null);

        if (existingSchedule != null) {

            existingSchedule.setRoute(schedule.getRoute());
            existingSchedule.setTrain(schedule.getTrain());
            existingSchedule.setDepartureTime(schedule.getDepartureTime());
            existingSchedule.setArrivalTime(schedule.getArrivalTime());
            existingSchedule.setFare(schedule.getFare());
            existingSchedule.setActive(schedule.getActive());

            return scheduleRepository.save(existingSchedule);
        }

        return null;
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}