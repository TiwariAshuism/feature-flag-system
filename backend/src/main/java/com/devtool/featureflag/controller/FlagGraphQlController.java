package com.devtool.featureflag.controller;

import com.devtool.featureflag.model.Flag;
import com.devtool.featureflag.service.FlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class FlagGraphQlController {

    private final FlagService flagService;

    @QueryMapping
    public Page<Flag> flags(@Argument int page, @Argument int size) {
        return flagService.getAllFlags(PageRequest.of(page, size > 0 ? size : 10));
    }

    @QueryMapping
    public Flag flag(@Argument String id, @Argument String key) {
        if (id != null) {
            return flagService.getFlag(UUID.fromString(id));
        }
        if (key != null) {
            return flagService.getFlagByKey(key);
        }
        return null;
    }

    @MutationMapping
    public Flag toggleFlag(@Argument String id) {
        return flagService.toggleFlag(UUID.fromString(id), "graphql-user");
    }
}
