package RouteStationController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.metrobookingsystem.RouteStation;
import com.example.metrobookingsystem.RouteStationService;

@RestController
@RequestMapping("/route-stations")
public class RouteStationController {

    @Autowired
    private RouteStationService routeStationService;

    @GetMapping("/all")
    public List<RouteStation> getAllRouteStations() {
        return routeStationService.getAllRouteStations();
    }

    @GetMapping("/id/{id}")
    public RouteStation getRouteStationById(@PathVariable Long id) {
        return routeStationService.getRouteStationById(id);
    }

    @PostMapping("/add")
    public RouteStation createRouteStation(@RequestBody RouteStation routeStation) {
        return routeStationService.createRouteStation(routeStation);
    }

    @PutMapping("/update/{id}")
    public RouteStation updateRouteStation(
            @PathVariable Long id,
            @RequestBody RouteStation routeStation) {

        return routeStationService.updateRouteStation(id, routeStation);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteRouteStation(@PathVariable Long id) {
        routeStationService.deleteRouteStation(id);
    }
}