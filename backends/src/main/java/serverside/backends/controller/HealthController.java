package serverside.backends.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        String dbStatus;
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            dbStatus = "UP";
        } catch (Exception e) {
            dbStatus = "DOWN";
        }

        return Map.of(
            "server", "UP",
            "database", dbStatus,
            "weather", "UP"
        );
    }
}