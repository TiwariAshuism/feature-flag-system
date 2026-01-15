package com.devtool.featureflag.controller;

import com.devtool.featureflag.model.AuditLog;
import com.devtool.featureflag.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditController {
    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public Page<AuditLog> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    @GetMapping("/entity/{type}/{id}")
    public Page<AuditLog> getLogsForEntity(@PathVariable String type, @PathVariable UUID id, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(type, id, pageable);
    }
}
