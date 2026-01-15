#!/bin/bash

BASE_URL="http://localhost:8080/api/configs"

function create_config() {
    local name=$1
    local key=$2
    local description=$3
    local type=$4
    local value=$5

    echo "Attempting to add: $key ($name)..."
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL" \
         -H "Content-Type: application/json" \
         -d "{
               \"name\": \"$name\",
               \"key\": \"$key\",
               \"description\": \"$description\",
               \"configType\": \"$type\",
               \"value\": $value
             }")

    if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "201" ]; then
        echo "Successfully added $key"
    elif [ "$RESPONSE" == "500" ]; then
        echo "Error: Could not add $key (it likely already exists or validation failed)"
    else
        echo "Failed to add $key - HTTP Status: $RESPONSE"
    fi
}

echo "Seeding complex configurations..."

# 1. Payment Gateway Config
create_config "Payment Gateway Settings" "PAYMENT_GATEWAY_CONFIG" "Configuration for multiple payment providers" "JSON" '{"stripe": {"enabled": true, "timeout": 5000}, "paypal": {"enabled": true}, "fallback": "paypal"}'

# 2. Search Relevance Weights
create_config "Search Relevance Weights" "SEARCH_WEIGHTS" "Dynamic weights for search field relevance" "JSON" '{"title": 10, "description": 5, "tags": 8}'

# 3. Resource Limits
create_config "Compute Resource Limits" "RESOURCE_LIMITS" "Global limits for CPU and Memory per tier" "JSON" '{"free": {"cpu": "0.5", "memory": "512MB"}, "pro": {"cpu": "2.0", "memory": "4GB"}}'

# 4. Feature Rollout Map
create_config "Regional Feature Rollout" "REGIONAL_FEATURES" "Availability of features across different regions" "JSON" '{"US-EAST": ["video-calling", "ai-summaries"], "EU-WEST": ["video-calling"]}'

# 5. Global Maintenance Mode
create_config "Maintenance Banner" "MAINTENANCE_BANNER" "Content for the maintenance banner" "STRING" '"Scheduled maintenance from 2AM to 4AM EST."'

# 6. Max Session Duration
create_config "Max Session Duration" "MAX_SESSION_SECONDS" "Maximum idle time before session expiry" "NUMBER" 3600

# Mass seeding - add 20 more random configs
echo -e "\nGenerating 20 more configurations for testing..."
for i in {1..20}
do
    create_config "Test Config $i" "TEST_CONFIG_$i" "Bulk generated testing configuration" "STRING" "\"Value for test config $i\""
done

echo -e "\nSeeding process complete!"
