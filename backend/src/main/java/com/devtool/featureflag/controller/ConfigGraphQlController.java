package com.devtool.featureflag.controller;

import com.devtool.featureflag.model.Config;
import com.devtool.featureflag.service.ConfigService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ConfigGraphQlController {

    private final ConfigService configService;
    private final ObjectMapper objectMapper;

    @QueryMapping
    public Page<Config> configs(@Argument int page, @Argument int size) {
        return configService.getAllConfigs(PageRequest.of(page, size > 0 ? size : 10));
    }

    @QueryMapping
    public Config config(@Argument String key) {
        return configService.getConfigByKey(key);
    }

    @MutationMapping
    public Config updateConfig(@Argument String key, @Argument String value) {
        try {
            Config config = configService.getConfigByKey(key);
            // Try to parse as JSON, if it fails, treat as a JSON String
            JsonNode jsonValue;
            try {
                jsonValue = objectMapper.readTree(value);
            } catch (Exception e) {
                jsonValue = objectMapper.valueToTree(value);
            }
            config.setValue(jsonValue);
            return configService.updateConfig(config.getId(), config, "graphql-user");
        } catch (Exception e) {
            throw new RuntimeException("Failed to update config: " + e.getMessage());
        }
    }
}
