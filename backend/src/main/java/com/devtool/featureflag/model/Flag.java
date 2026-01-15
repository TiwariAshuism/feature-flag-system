package com.devtool.featureflag.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "flags")
@Data
public class Flag {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String key;

    @Column(nullable = false)
    private String name;

    private String description;

    private Boolean enabled = false;

    @Enumerated(EnumType.STRING)
    private FlagType flagType = FlagType.BOOLEAN;

    private String defaultValue;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private String createdBy;

    @Column(name = "tags", columnDefinition = "text[]")
    private String[] tags;

    private Boolean archived = false;

    @OneToMany(mappedBy = "flag", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RolloutRule> rolloutRules = new ArrayList<>();

    private Integer version = 1;

    public enum FlagType {
        BOOLEAN, STRING, NUMBER, JSON
    }
}
