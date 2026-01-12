package com.eno.leaderboard.repository;

import com.eno.leaderboard.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaderboardEntryRepository
        extends JpaRepository<LeaderboardEntry, Long> {

    List<LeaderboardEntry> findTop5ByOrderByScoreDescCreatedAtAsc();
}
