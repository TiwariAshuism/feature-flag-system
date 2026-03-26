package com.devtool.featureflag.config;

import com.devtool.featureflag.model.AuditLog;
import com.devtool.featureflag.model.Config;
import com.devtool.featureflag.model.Flag;
import com.devtool.featureflag.repository.AuditLogRepository;
import com.devtool.featureflag.repository.ConfigRepository;
import com.devtool.featureflag.repository.FlagRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds dummy data on first startup when persistence is empty.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StartupDataSeeder implements ApplicationRunner {

    private static final String SEED_USER_ID = "system-seed";
    private static final String SEED_USER_EMAIL = "seed@featureflags.local";

    private final FlagRepository flagRepository;
    private final ConfigRepository configRepository;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (flagRepository.count() > 0 || configRepository.count() > 0) {
            log.info("Skipping seed data because records already exist.");
            return;
        }

        List<Flag> flags = seedFlags();
        List<Config> configs = seedConfigs();
        seedAuditLogs(flags, configs);

        log.info(
                "Seeded initial data: {} flags, {} configs, {} audit logs.",
                flags.size(),
                configs.size(),
                flags.size() + configs.size()
        );
    }

    private List<Flag> seedFlags() {
        Flag maintenanceMode = new Flag();
        maintenanceMode.setKey("maintenance_mode");
        maintenanceMode.setName("Maintenance Mode");
        maintenanceMode.setDescription("Shows maintenance banner and blocks checkout.");
        maintenanceMode.setEnabled(false);
        maintenanceMode.setFlagType(Flag.FlagType.BOOLEAN);
        maintenanceMode.setDefaultValue("false");
        maintenanceMode.setTags(new String[]{"ops", "release"});
        maintenanceMode.setCreatedBy(SEED_USER_ID);

        Flag expressCheckout = new Flag();
        expressCheckout.setKey("express_checkout");
        expressCheckout.setName("Express Checkout");
        expressCheckout.setDescription("Enables one-click checkout experience.");
        expressCheckout.setEnabled(true);
        expressCheckout.setFlagType(Flag.FlagType.BOOLEAN);
        expressCheckout.setDefaultValue("true");
        expressCheckout.setTags(new String[]{"checkout", "growth"});
        expressCheckout.setCreatedBy(SEED_USER_ID);

        Flag newSearch = new Flag();
        newSearch.setKey("new_search_v2");
        newSearch.setName("Semantic Search V2");
        newSearch.setDescription("Rolls out semantic search for the catalog.");
        newSearch.setEnabled(false);
        newSearch.setFlagType(Flag.FlagType.BOOLEAN);
        newSearch.setDefaultValue("false");
        newSearch.setTags(new String[]{"search", "experimentation"});
        newSearch.setCreatedBy(SEED_USER_ID);

        return flagRepository.saveAll(List.of(
                maintenanceMode,
                expressCheckout,
                newSearch
        ));
    }

    private List<Config> seedConfigs() {
        Config recommendationModel = new Config();
        recommendationModel.setKey("recommendation_model");
        recommendationModel.setName("Recommendation Model");
        recommendationModel.setDescription("Active recommendation model identifier.");
        recommendationModel.setValue(objectMapper.getNodeFactory().textNode("baseline-v1"));
        recommendationModel.setConfigType("STRING");
        recommendationModel.setEnvironment("production");
        recommendationModel.setCreatedBy(SEED_USER_ID);

        Config checkoutBanner = new Config();
        checkoutBanner.setKey("checkout_banner_text");
        checkoutBanner.setName("Checkout Banner Text");
        checkoutBanner.setDescription("Checkout area message shown to users.");
        checkoutBanner.setValue(
                objectMapper.getNodeFactory().textNode(
                        "Free shipping on orders above $50."
                )
        );
        checkoutBanner.setConfigType("STRING");
        checkoutBanner.setEnvironment("production");
        checkoutBanner.setCreatedBy(SEED_USER_ID);

        Config maxCartItems = new Config();
        maxCartItems.setKey("max_cart_items");
        maxCartItems.setName("Max Cart Items");
        maxCartItems.setDescription("Maximum items allowed in user cart.");
        maxCartItems.setValue(objectMapper.getNodeFactory().numberNode(20));
        maxCartItems.setConfigType("NUMBER");
        maxCartItems.setEnvironment("production");
        maxCartItems.setCreatedBy(SEED_USER_ID);

        return configRepository.saveAll(List.of(
                recommendationModel,
                checkoutBanner,
                maxCartItems
        ));
    }

    private void seedAuditLogs(List<Flag> flags, List<Config> configs) {
        for (Flag flag : flags) {
            AuditLog auditLog = new AuditLog();
            auditLog.setEntityType("FLAG");
            auditLog.setEntityId(flag.getId());
            auditLog.setAction("CREATE");
            auditLog.setUserId(SEED_USER_ID);
            auditLog.setUserEmail(SEED_USER_EMAIL);
            auditLog.setMetadata(seedMetadata("Initial demo flag seeded on startup."));
            auditLogRepository.save(auditLog);
        }

        for (Config config : configs) {
            AuditLog auditLog = new AuditLog();
            auditLog.setEntityType("CONFIG");
            auditLog.setEntityId(config.getId());
            auditLog.setAction("CREATE");
            auditLog.setUserId(SEED_USER_ID);
            auditLog.setUserEmail(SEED_USER_EMAIL);
            auditLog.setMetadata(seedMetadata("Initial demo config seeded on startup."));
            auditLogRepository.save(auditLog);
        }
    }

    private ObjectNode seedMetadata(String note) {
        ObjectNode metadata = objectMapper.createObjectNode();
        metadata.put("source", "startup-seeder");
        metadata.put("environment", "production");
        metadata.put("note", note);
        return metadata;
    }
}
