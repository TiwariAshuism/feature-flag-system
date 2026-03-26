export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface AuditMetadata {
    env?: string;
    ip?: string;
    [key: string]: unknown;
}

export interface AuditLog {
    id: string;
    userId?: string | null;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | string;
    entityType: string;
    entityId: string;
    metadata?: AuditMetadata;
    createdAt: string;
}

export interface FeatureFlag {
    id: string;
    name: string;
    key: string;
    description?: string;
    enabled: boolean;
    flagType: 'BOOLEAN' | 'STRING' | 'NUMBER' | 'JSON' | string;
    defaultValue: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ConfigItem {
    id: string;
    key: string;
    name?: string;
    description?: string;
    value: string;
    configType: 'STRING' | 'NUMBER' | 'JSON' | string;
    createdAt: string;
    updatedAt: string;
}
