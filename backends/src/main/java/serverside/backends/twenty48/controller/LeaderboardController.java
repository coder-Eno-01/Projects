package serverside.backends.twenty48.controller;

import serverside.backends.twenty48.model.LeaderboardEntry;
import serverside.backends.twenty48.repository.LeaderboardEntryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    private boolean updated = false;

    @PostMapping
    public LeaderboardEntry submitScore(@RequestBody LeaderboardEntry entry) {

        // Reject invalid clients
        if (entry.getClientUid() == null || entry.getClientUid().isBlank()) {
            throw new IllegalArgumentException("clientUid is required");
        }

        // Check if this client already exists
        return repository.findByClientUid(entry.getClientUid())
                .map(existing -> {
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
}
