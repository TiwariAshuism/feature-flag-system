# Backend API CURL Commands

You can use these `curl` commands to interact with the Feature Flag and Configuration Management API.

## Feature Flags

### Get All Flags
```bash
curl -X GET http://localhost:8080/api/flags
```

### Create a Flag
```bash
curl -X POST http://localhost:8080/api/flags \
     -H "Content-Type: application/json" \
     -d '{
           "name": "New Landing Page",
           "key": "new-landing-page",
           "description": "Enables the new high-conversion landing page",
           "flagType": "BOOLEAN",
           "defaultValue": "false",
           "enabled": true,
           "tags": ["frontend", "marketing"]
         }'
```

### Get Flag By ID
```bash
# Replace {id} with the actual UUID
curl -X GET http://localhost:8080/api/flags/{id}
```

### Toggle Flag Status
```bash
# Replace {id} with the actual UUID
curl -X POST http://localhost:8080/api/flags/{id}/toggle
```

### Update a Flag
```bash
# Replace {id} with the actual UUID
curl -X PUT http://localhost:8080/api/flags/{id} \
     -H "Content-Type: application/json" \
     -d '{
           "name": "New Landing Page (V2)",
           "enabled": true
         }'
```

### Delete a Flag
```bash
# Replace {id} with the actual UUID
curl -X DELETE http://localhost:8080/api/flags/{id}
```

---

## Dynamic Configurations

### Get All Configs
```bash
curl -X GET http://localhost:8080/api/configs
```

### Create a Configuration
```bash
curl -X POST http://localhost:8080/api/configs \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Max Upload Size",
           "key": "MAX_UPLOAD_SIZE",
           "value": "20MB",
           "configType": "STRING"
         }'
```

### Update a Configuration
```bash
# Replace {id} with the actual UUID
curl -X PUT http://localhost:8080/api/configs/{id} \
     -H "Content-Type: application/json" \
     -d '{
           "value": "50MB"
         }'
```

---

## Audit Logs

### Get All Audit Logs
```bash
curl -X GET http://localhost:8080/api/audit
```

### Get Logs for Specific Entity
```bash
# Replace {type} with FLAG or CONFIG and {id} with the UUID
curl -X GET http://localhost:8080/api/audit/entity/{type}/{id}
```
