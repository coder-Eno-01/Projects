package com.eno.leaderboard.controller;

import com.eno.leaderboard.model.LeaderboardEntry;
import com.eno.leaderboard.repository.LeaderboardEntryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController     // Tells Spring that this class handles HTTP requests and returns JSON
@RequestMapping("/api/scores")          // Base URL for everything in this controller
public class LeaderboardController {
    private final LeaderboardEntryRepository repository;

    public LeaderboardController(LeaderboardEntryRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public LeaderboardEntry submitScore(@RequestBody LeaderboardEntry entry) {

        // 1. Reject invalid clients
        if (entry.getClientUid() == null || entry.getClientUid().isBlank()) {
            throw new IllegalArgumentException("clientUid is required");
        }

        // 2. Check if this client already exists
        return repository.findByClientUid(entry.getClientUid())
                .map(existing -> {
                    // 3. Update only if new score is higher
                    if (entry.getScore() > existing.getScore()) {
                        existing.setScore(entry.getScore());
                        existing.setPlayerName(entry.getPlayerName());
                        return repository.save(existing);
                    }
                    // Otherwise keep old score
                    return existing;
                })
                // 4. First time submission
                .orElseGet(() -> repository.save(entry));
    }

        @GetMapping("/top")
    public List<LeaderboardEntry> getTopScores() {
        return repository.findTop5ByClientUidNotNullOrderByScoreDescCreatedAtAsc();
    }
}
