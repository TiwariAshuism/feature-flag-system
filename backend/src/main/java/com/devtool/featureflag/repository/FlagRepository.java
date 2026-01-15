package com.devtool.featureflag.repository;

import com.devtool.featureflag.model.Flag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FlagRepository extends JpaRepository<Flag, UUID> {
    Optional<Flag> findByKey(String key);

    List<Flag> findByArchivedFalse();
}
