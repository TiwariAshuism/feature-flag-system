package com.devtool.featureflag.controller;

import com.devtool.featureflag.model.AuditLog;
import com.devtool.featureflag.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AuditGraphQlController {

    private final AuditLogRepository auditLogRepository;

    @QueryMapping
    public Page<AuditLog> auditLogs(@Argument int page, @Argument int size) {
        return auditLogRepository.findAll(PageRequest.of(page, size > 0 ? size : 10));
    }
}
