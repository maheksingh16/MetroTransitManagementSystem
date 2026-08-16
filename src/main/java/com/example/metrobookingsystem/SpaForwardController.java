package com.example.metrobookingsystem;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the React website for browser page loads.
 * API JSON endpoints stay on RestControllers (different produces / paths).
 */
@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/dashboard",
            "/journey",
            "/profile",
            "/stations",
            "/routes",
            "/schedules",
            "/staff",
            "/admin",
            "/admin/**"
    }, produces = MediaType.TEXT_HTML_VALUE)
    public String appPages() {
        return "forward:/index.html";
    }

    // Browser refresh on these React routes (Accept: text/html).
    // Axios API calls use Accept: application/json and hit RestControllers.
    @GetMapping(value = {
            "/bookings",
            "/bookings/{id}",
            "/tickets",
            "/tickets/{id}"
    }, produces = MediaType.TEXT_HTML_VALUE)
    public String bookingTicketPages() {
        return "forward:/index.html";
    }
}
