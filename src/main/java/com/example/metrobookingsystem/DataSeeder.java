package com.example.metrobookingsystem;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    @Value("${metro.seed.reset:false}")
    private boolean resetNetworkData;

    private final UserRepository userRepository;
    private final StationRepository stationRepository;
    private final LineRepository lineRepository;
    private final RouteRepository routeRepository;
    private final RouteStationRepository routeStationRepository;
    private final TrainRepository trainRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            StationRepository stationRepository,
            LineRepository lineRepository,
            RouteRepository routeRepository,
            RouteStationRepository routeStationRepository,
            TrainRepository trainRepository,
            ScheduleRepository scheduleRepository,
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.stationRepository = stationRepository;
        this.lineRepository = lineRepository;
        this.routeRepository = routeRepository;
        this.routeStationRepository = routeStationRepository;
        this.trainRepository = trainRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        if (resetNetworkData) {
            clearNetworkData();
            seedMumbaiMetroNetwork();
        } else if (stationRepository.count() == 0) {
            seedMumbaiMetroNetwork();
        }
    }

    private void clearNetworkData() {
        routeStationRepository.deleteAll();
        scheduleRepository.deleteAll();
        bookingRepository.deleteAll();
        ticketRepository.deleteAll();
        routeRepository.deleteAll();
        lineRepository.deleteAllInBatch();
        stationRepository.deleteAllInBatch();
        trainRepository.deleteAllInBatch();
    }

    private void seedUsers() {
        if (userRepository.findByEmail("admin@metro.com").isEmpty()) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@metro.com");
            admin.setPhoneNumber("+910000000001");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        if (userRepository.findByEmail("staff@metro.com").isEmpty()) {
            User staff = new User();
            staff.setFirstName("Station");
            staff.setLastName("Staff");
            staff.setEmail("staff@metro.com");
            staff.setPhoneNumber("+910000000002");
            staff.setPassword(passwordEncoder.encode("staff123"));
            staff.setRole(Role.OFFICE_STAFF);
            userRepository.save(staff);
        }
    }

    private void seedMumbaiMetroNetwork() {
        // Line definitions: name, color, list of (stationCode, stationName)
        Map<String, LineDef> lines = new LinkedHashMap<>();

        lines.put("Line 1", new LineDef(
                "Line 1",
                "#0056A8",
                List.of(
                        new StationDef("VSV", "Versova", "Andheri West"),
                        new StationDef("DNA", "D N Nagar", "Andheri West"),
                        new StationDef("AZN", "Azad Nagar", "Andheri East"),
                        new StationDef("AND", "Andheri", "Andheri East"),
                        new StationDef("WEH", "Western Express Highway", "Andheri East"),
                        new StationDef("JBN", "Chakala (J B Nagar)", "Andheri East"),
                        new StationDef("APR", "Airport Road", "Andheri East"),
                        new StationDef("MNA", "Marol Naka", "Andheri East"),
                        new StationDef("SKN", "Saki Naka", "Andheri East"),
                        new StationDef("ASL", "Asalpha", "Ghatkopar West"),
                        new StationDef("JGN", "Jagruti Nagar", "Ghatkopar West"),
                        new StationDef("GHP", "Ghatkopar", "Ghatkopar East")
                )
        ));

        lines.put("Line 2A", new LineDef(
                "Line 2A",
                "#FFD700",
                List.of(
                        new StationDef("DHE", "Dahisar East", "Dahisar East"),
                        new StationDef("ANA", "Anand Nagar", "Dahisar East"),
                        new StationDef("KPD", "Kandarpada", "Borivali West"),
                        new StationDef("MPS", "Mandapeshwar", "Borivali West"),
                        new StationDef("EKS", "Eksar", "Borivali West"),
                        new StationDef("BVW", "Borivali West", "Borivali West"),
                        new StationDef("SHI", "Shimpoli", "Borivali West"),
                        new StationDef("KDW", "Kandivali West", "Kandivali West"),
                        new StationDef("DNW", "Dhanukarwadi", "Kandivali West"),
                        new StationDef("VLN", "Valnai (Charkop)", "Malad West"),
                        new StationDef("MLW", "Malad West", "Malad West"),
                        new StationDef("LML", "Lower Malad", "Malad West"),
                        new StationDef("PPK", "Pushpa Park", "Goregaon West"),
                        new StationDef("BGN", "Bangur Nagar", "Goregaon West"),
                        new StationDef("GRW", "Goregaon West", "Goregaon West"),
                        new StationDef("OSH", "Oshiwara", "Andheri West"),
                        new StationDef("LOW", "Lower Oshiwara", "Andheri West"),
                        new StationDef("ANW", "Andheri West", "Andheri West"),
                        new StationDef("ESI", "ESIC Nagar", "Andheri West"),
                        new StationDef("DNA", "D N Nagar", "Andheri West")
                )
        ));

        lines.put("Line 7", new LineDef(
                "Line 7",
                "#E4002B",
                List.of(
                        new StationDef("DHE", "Dahisar East", "Dahisar East"),
                        new StationDef("OVP", "Ovaripada", "Dahisar East"),
                        new StationDef("RUD", "Rashtriya Udyan", "Borivali East"),
                        new StationDef("MGT", "Magathane", "Borivali East"),
                        new StationDef("DVP", "Devipada", "Borivali East"),
                        new StationDef("GDV", "Gundavali", "Borivali East"),
                        new StationDef("ARY", "Aarey", "Goregaon East"),
                        new StationDef("DDS", "Dindoshi", "Goregaon East"),
                        new StationDef("GRE", "Goregaon East", "Goregaon East"),
                        new StationDef("JGE", "Jogeshwari East", "Jogeshwari East"),
                        new StationDef("MGR", "Mogra", "Andheri East"),
                        new StationDef("ANE", "Andheri East", "Andheri East")
                )
        ));

        // Create or get stations (shared by code)
        Map<String, Station> stationMap = new LinkedHashMap<>();
        for (LineDef lineDef : lines.values()) {
            for (StationDef sd : lineDef.stations) {
                if (!stationMap.containsKey(sd.code)) {
                    Station station = new Station();
                    station.setStationCode(sd.code);
                    station.setStationName(sd.name);
                    station.setCity(sd.city);
                    station.setActive(true);
                    stationMap.put(sd.code, stationRepository.save(station));
                }
            }
        }

        // Create lines, routes and route-stations
        int trainCounter = 1;
        for (LineDef lineDef : lines.values()) {
            Line line = new Line();
            line.setLineName(lineDef.name);
            line.setLineColor(lineDef.color);
            line = lineRepository.save(line);

            List<Station> lineStations = new ArrayList<>();
            for (StationDef sd : lineDef.stations) {
                lineStations.add(stationMap.get(sd.code));
            }
            line.setStations(lineStations);
            lineRepository.save(line);

            Route route = new Route();
            route.setRouteName(lineDef.name + " Route");
            route.setEstimatedTimeMinutes((lineDef.stations.size() - 1) * 3);
            route.setActive(true);
            route = routeRepository.save(route);

            double cumulativeDistance = 0.0;
            for (int i = 0; i < lineDef.stations.size(); i++) {
                StationDef sd = lineDef.stations.get(i);
                RouteStation rs = new RouteStation();
                rs.setRoute(route);
                rs.setStation(stationMap.get(sd.code));
                rs.setStationOrder(i + 1);
                rs.setDistanceFromPrevious(i == 0 ? 0.0 : 1.2);
                rs.setTimeFromPrevious(i == 0 ? 0 : 3);
                routeStationRepository.save(rs);
                cumulativeDistance += rs.getDistanceFromPrevious();
            }

            Train train = new Train();
            train.setTrainNumber("MUM-" + String.format("%03d", trainCounter++));
            train.setCoachCount(6);
            train.setActive(true);
            train = trainRepository.save(train);

            Schedule schedule = new Schedule();
            schedule.setRoute(route);
            schedule.setTrain(train);
            schedule.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(6).withMinute(0).withSecond(0).withNano(0));
            schedule.setArrivalTime(schedule.getDepartureTime().plusMinutes(route.getEstimatedTimeMinutes()));
            schedule.setFare(20.0 + (lineDef.stations.size() - 2) * 5.0);
            schedule.setActive(true);
            scheduleRepository.save(schedule);
        }
    }

    private record LineDef(String name, String color, List<StationDef> stations) {}
    private record StationDef(String code, String name, String city) {}
}
