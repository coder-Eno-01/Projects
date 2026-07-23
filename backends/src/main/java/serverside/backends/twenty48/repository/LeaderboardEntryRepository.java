package serverside.backends.twenty48.repository;

import serverside.backends.twenty48.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaderboardEntryRepository
        extends JpaRepository<LeaderboardEntry, Long> {

    Optional<LeaderboardEntry> findByClientUid(String clientUid);
    Optional<List<LeaderboardEntry>> findAllByRole(String role);

    List<LeaderboardEntry> findTop5ByClientUidNotNullOrderByScoreDescCreatedAtAsc();
}
