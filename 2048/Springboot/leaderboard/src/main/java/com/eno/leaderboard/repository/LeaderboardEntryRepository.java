package com.eno.leaderboard.repository;

import com.eno.leaderboard.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaderboardEntryRepository
        extends JpaRepository<LeaderboardEntry, Long> {

    Optional<LeaderboardEntry> findByClientUid(String clientUid);

    List<LeaderboardEntry> findTop5ByClientUidNotNullOrderByScoreDescCreatedAtAsc();
}
