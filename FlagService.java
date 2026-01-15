package com.devtool.featureflag.service;

import com.devtool.featureflag.model.Flag;
import com.devtool.featureflag.repository.FlagRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlagService {
    private final FlagRepository flagRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    private static final String FLAG_CACHE_PREFIX = "flag:";
    private static final long CACHE_TTL = 300; // 5 minutes

    @Transactional(readOnly = true)
    public Flag getFlag(UUID id) {
        String cacheKey = FLAG_CACHE_PREFIX + id;
        Object cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            return objectMapper.convertValue(cached, Flag.class);
        }

        Flag flag = flagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flag not found: " + id));

        redisTemplate.opsForValue().set(cacheKey, flag, CACHE_TTL, TimeUnit.SECONDS);
        return flag;
    }

    @Transactional(readOnly = true)
    public Flag getFlagByKey(String key) {
        String cacheKey = FLAG_CACHE_PREFIX + "key:" + key;
        Object cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            return objectMapper.convertValue(cached, Flag.class);
        }

        Flag flag = flagRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Flag not found: " + key));

        redisTemplate.opsForValue().set(cacheKey, flag, CACHE_TTL, TimeUnit.SECONDS);
        return flag;
    }

    @Transactional(readOnly = true)
    public Page<Flag> getAllFlags(Pageable pageable) {
        return flagRepository.findAll(pageable);
    }

    @Transactional
    public Flag createFlag(Flag flag, String userId) {
        Flag saved = flagRepository.save(flag);
        auditService.logAction("FLAG", saved.getId(), "CREATE", userId, null, saved);
        invalidateCache(saved.getId(), saved.getKey());
        notificationService.broadcast("FLAG_CREATED", saved.getKey(), saved);
        return saved;
    }

    @Transactional
    public Flag updateFlag(UUID id, Flag flag, String userId) {
        Flag existing = flagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flag not found: " + id));

        // Update fields
        existing.setName(flag.getName());
        existing.setDescription(flag.getDescription());
        existing.setEnabled(flag.getEnabled());
        existing.setFlagType(flag.getFlagType());
        existing.setDefaultValue(flag.getDefaultValue());
        existing.setTags(flag.getTags());
        existing.setArchived(flag.getArchived());

        Flag updated = flagRepository.save(existing);
        auditService.logAction("FLAG", id, "UPDATE", userId, existing, updated);
        invalidateCache(id, updated.getKey());
        notificationService.broadcast("FLAG_UPDATED", updated.getKey(), updated);
        return updated;
    }

    @Transactional
    public void deleteFlag(UUID id, String userId) {
        Flag flag = getFlag(id);
        flagRepository.deleteById(id);
        auditService.logAction("FLAG", id, "DELETE", userId, flag, null);
        invalidateCache(id, flag.getKey());
    }

    @Transactional
    public Flag toggleFlag(UUID id, String userId) {
        Flag flag = getFlag(id);
        flag.setEnabled(!flag.getEnabled());
        Flag updated = flagRepository.save(flag);
        auditService.logAction("FLAG", id, updated.getEnabled() ? "ENABLE" : "DISABLE", userId, flag, updated);
        invalidateCache(id, updated.getKey());
        notificationService.broadcast("FLAG_TOGGLED", updated.getKey(), updated);
        return updated;
    }

    private void invalidateCache(UUID id, String key) {
        redisTemplate.delete(FLAG_CACHE_PREFIX + id);
        redisTemplate.delete(FLAG_CACHE_PREFIX + "key:" + key);
    }
}
