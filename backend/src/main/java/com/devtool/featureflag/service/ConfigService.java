package com.devtool.featureflag.service;

import com.devtool.featureflag.model.Config;
import com.devtool.featureflag.repository.ConfigRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ConfigService {
    private final ConfigRepository configRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    private static final String CONFIG_CACHE_PREFIX = "config:";
    private static final long CACHE_TTL = 600; // 10 minutes

    @Transactional(readOnly = true)
    public Page<Config> getAllConfigs(Pageable pageable) {
        return configRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Config getConfigById(UUID id) {
        return configRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Config not found: " + id));
    }

    @Transactional(readOnly = true)
    public Config getConfigByKey(String key) {
        String cacheKey = CONFIG_CACHE_PREFIX + key;
        Object cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            return objectMapper.convertValue(cached, Config.class);
        }

        Config config = configRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Config not found: " + key));

        redisTemplate.opsForValue().set(cacheKey, config, CACHE_TTL, TimeUnit.SECONDS);
        return config;
    }

    @Transactional
    public Config createConfig(Config config, String userId) {
        Config saved = configRepository.save(config);
        auditService.logAction("CONFIG", saved.getId(), "CREATE", userId, null, saved);
        redisTemplate.delete(CONFIG_CACHE_PREFIX + saved.getKey());
        notificationService.broadcast("CONFIG_CREATED", saved.getKey(), saved);
        return saved;
    }

    @Transactional
    public Config updateConfig(UUID id, Config config, String userId) {
        Config existing = configRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Config not found: " + id));

        existing.setName(config.getName());
        existing.setDescription(config.getDescription());
        existing.setValue(config.getValue());
        existing.setConfigType(config.getConfigType());
        existing.setEnvironment(config.getEnvironment());
        existing.setVersion(existing.getVersion() + 1);

        Config updated = configRepository.save(existing);
        auditService.logAction("CONFIG", id, "UPDATE", userId, existing, updated);
        redisTemplate.delete(CONFIG_CACHE_PREFIX + updated.getKey());
        notificationService.broadcast("CONFIG_UPDATED", updated.getKey(), updated);
        return updated;
    }

    @Transactional
    public void deleteConfig(UUID id, String userId) {
        Config existing = configRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Config not found: " + id));

        configRepository.delete(existing);
        auditService.logAction("CONFIG", id, "DELETE", userId, existing, null);
        redisTemplate.delete(CONFIG_CACHE_PREFIX + existing.getKey());
        notificationService.broadcast("CONFIG_DELETED", existing.getKey(), existing);
    }
}
