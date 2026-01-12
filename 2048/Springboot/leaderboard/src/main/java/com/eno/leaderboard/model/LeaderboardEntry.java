package com.eno.leaderboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

import java.time.Instant;

@Entity             // Tells JPA that this class maps to a database table
public class LeaderboardEntry {

    @Id             // Database identity, primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // Database generates, sets and auto-increments these ids
    private Long id;

    private String playerName;
    private String clientUid;
    private int score;

    private Instant createdAt;

    @PrePersist         // Tells JPA to run the program before inserting the row (making the database entry)
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getClientUid() {
        return clientUid;
    }

    public void setClientUid(String clientUid) {
        this.clientUid = clientUid;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
