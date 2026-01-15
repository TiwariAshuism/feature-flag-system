package com.devtool.featureflag.controller;

import com.devtool.featureflag.model.Config;
import com.devtool.featureflag.service.ConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/configs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConfigController {
    private final ConfigService configService;

    @GetMapping
    public Page<Config> getAllConfigs(Pageable pageable) {
        return configService.getAllConfigs(pageable);
    }

    @GetMapping("/{key}")
    public ResponseEntity<Config> getConfigByKey(@PathVariable String key) {
        return ResponseEntity.ok(configService.getConfigByKey(key));
    }

    @PostMapping
    public ResponseEntity<Config> createConfig(@RequestBody Config config) {
        return ResponseEntity.ok(configService.createConfig(config, "system-user"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Config> updateConfig(@PathVariable UUID id, @RequestBody Config config) {
        return ResponseEntity.ok(configService.updateConfig(id, config, "system-user"));
    }
}
