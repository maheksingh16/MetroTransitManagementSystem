package com.example.metrobookingsystem;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@EnableScheduling
@SpringBootApplication
public class MetrobookingsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MetrobookingsystemApplication.class, args);
	}

}
