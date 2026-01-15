package com.devtool.featureflag.repository;

import com.devtool.featureflag.model.Config;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfigRepository extends JpaRepository<Config, UUID> {
    Optional<Config> findByKey(String key);
}
