package com.devtool.featureflag.service;

import com.devtool.featureflag.model.AuditLog;
import com.devtool.featureflag.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Async
    @Transactional
    public void logAction(String entityType, UUID entityId, String action, String userId, Object oldState,
            Object newState) {
        log.info("Logging action asynchronously on thread: {}", Thread.currentThread().getName());
        AuditLog log = new AuditLog();
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setUserId(userId);

        if (oldState != null || newState != null) {
            // In a real app, you'd compute a diff here. For now, we'll just store the new
            // state or both.
            log.setChanges(objectMapper.valueToTree(newState));
        }

        auditLogRepository.save(log);
    }
}
