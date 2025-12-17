import type { ApiClient } from '../../ApiClient';
import type { BackendCustomGroup, CreateCustomGroupData, UpdateCustomGroupData } from '../../../types/inventory';
export declare function fetchCustomGroups(client: ApiClient): Promise<BackendCustomGroup[]>;
export declare function fetchCustomGroup(client: ApiClient, groupId: string): Promise<BackendCustomGroup>;
export declare function createCustomGroup(client: ApiClient, groupData: CreateCustomGroupData): Promise<{
    id: string;
}>;
export declare function deleteCustomGroup(client: ApiClient, groupId: string): Promise<void>;
export declare function updateCustomGroup(client: ApiClient, groupUpdateData: UpdateCustomGroupData): Promise<void>;
export declare function saveUserCustomGroupOrder(client: ApiClient, orderedIds: string[]): Promise<void>;
//# sourceMappingURL=groups.d.ts.map