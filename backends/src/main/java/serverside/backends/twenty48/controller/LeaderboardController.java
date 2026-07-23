package serverside.backends.twenty48.controller;

import serverside.backends.twenty48.model.LeaderboardEntry;
import serverside.backends.twenty48.repository.LeaderboardEntryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController     // Tells Spring that this class handles HTTP requests and returns JSON
@RequestMapping("/2048/api")          // Base URL for everything in this controller
public class LeaderboardController {
    private final LeaderboardEntryRepository repository;

    public LeaderboardController(LeaderboardEntryRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public LeaderboardEntry submitScore(@RequestBody LeaderboardEntry entry) {

        // Reject invalid clients
        if (entry.getClientUid() == null || entry.getClientUid().isBlank()) {
            throw new IllegalArgumentException("clientUid is required");
        }

        // Check if this client already exists
        return repository.findByClientUid(entry.getClientUid())
                .map(existing -> {
                    boolean updated = false;

                    // Update only if changes present
                    if (entry.getScore() > existing.getScore()) {
                        existing.setScore(entry.getScore());
                        updated = true;
                    }

                    // Update icon if there's been a change
                    if (!Objects.equals(entry.getIconID(), existing.getIconID())) {
                        existing.setIconID(entry.getIconID());
                        updated = true;
                    }

                    if(updated) return repository.save(existing);

                    // Otherwise keep old score
                    return existing;
                })

                // First time submission
                .orElseGet(() -> {
                    entry.setRole("PLAYER");
                    entry.setIconID(null);
                    return repository.save(entry);
                });
    }

    @GetMapping("/scores/top")
    public List<LeaderboardEntry> getTopScores() {
        return repository.findTop5ByClientUidNotNullOrderByScoreDescCreatedAtAsc();
    }

    @GetMapping("/player/{clientUid}")
    public Optional<LeaderboardEntry> getPlayer(@PathVariable String clientUid){
        return repository.findByClientUid(clientUid);
    }

    @GetMapping("/icons")
    public List<Short> getIconsByDevs(){
        List<LeaderboardEntry> entries = repository.findAllByRole("DEVELOPER").orElse(Collections.emptyList());

        List<Short> icons = new ArrayList<>();

        for (LeaderboardEntry entry : entries){
            icons.add(entry.getIconID());
        }

        return icons;
    }
}
