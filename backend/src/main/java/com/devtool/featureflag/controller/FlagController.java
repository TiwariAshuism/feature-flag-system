package com.devtool.featureflag.controller;

import com.devtool.featureflag.model.Flag;
import com.devtool.featureflag.service.FlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/flags")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FlagController {
    private final FlagService flagService;

    @GetMapping
    public Page<Flag> getAllFlags(Pageable pageable) {
        return flagService.getAllFlags(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flag> getFlag(@PathVariable UUID id) {
        return ResponseEntity.ok(flagService.getFlag(id));
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<Flag> getFlagByKey(@PathVariable String key) {
        return ResponseEntity.ok(flagService.getFlagByKey(key));
    }

    @PostMapping
    public ResponseEntity<Flag> createFlag(@RequestBody Flag flag) {
        // userId should ideally come from security context
        return ResponseEntity.ok(flagService.createFlag(flag, "system-user"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flag> updateFlag(@PathVariable UUID id, @RequestBody Flag flag) {
        return ResponseEntity.ok(flagService.updateFlag(id, flag, "system-user"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlag(@PathVariable UUID id) {
        flagService.deleteFlag(id, "system-user");
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<Flag> toggleFlag(@PathVariable UUID id) {
        return ResponseEntity.ok(flagService.toggleFlag(id, "system-user"));
    }
}
