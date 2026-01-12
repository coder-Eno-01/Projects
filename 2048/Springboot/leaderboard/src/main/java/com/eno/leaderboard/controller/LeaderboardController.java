package com.eno.leaderboard.controller;

import com.eno.leaderboard.model.LeaderboardEntry;
import com.eno.leaderboard.repository.LeaderboardEntryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController     // Tells Spring that this class handles HTTP requests and returns JSON
@RequestMapping("/api/scores")          // Base URL for everything in this controller
public class LeaderboardController {
    private final LeaderboardEntryRepository repository;

    public LeaderboardController(LeaderboardEntryRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public LeaderboardEntry submitScore(@RequestBody LeaderboardEntry entry) {
        return repository.save(entry);
    }

    @GetMapping("/top")
    public List<LeaderboardEntry> getTopScores() {
        return repository.findTop5ByOrderByScoreDescCreatedAtAsc();
    }
}
