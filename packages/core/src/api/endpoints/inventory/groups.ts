import type { ApiClient } from '../../ApiClient';
import type { BackendCustomGroup, CreateCustomGroupData, UpdateCustomGroupData } from '../../../types/inventory';
import { validateArrayResponse, validateObjectResponse } from '../../responseValidation';

export async function fetchCustomGroups(client: ApiClient): Promise<BackendCustomGroup[]> {
  const customGroups = await client.request<BackendCustomGroup[]>({
    method: 'GET',
    path: '/get-custom-groups',
  });
  return validateArrayResponse<BackendCustomGroup>(customGroups, 'fetchCustomGroups');
}

export async function fetchCustomGroup(client: ApiClient, groupId: string): Promise<BackendCustomGroup> {
  const customGroup = await client.request<BackendCustomGroup>({
    method: 'GET',
    path: '/get-custom-group',
    query: { id: groupId },
  });
  return validateObjectResponse(customGroup, 'fetchCustomGroup', ['id'] as any);
}

export async function createCustomGroup(
  client: ApiClient,
  groupData: CreateCustomGroupData
): Promise<{ id: string }> {
  const response = await client.request<{ id: string; message?: string }>({
    method: 'POST',
    path: '/create-custom-group',
    body: groupData,
  });
  return validateObjectResponse(response, 'createCustomGroup', ['id'] as any) as { id: string };
}

export async function deleteCustomGroup(client: ApiClient, groupId: string): Promise<void> {
  await client.request<any>({
    method: 'DELETE',
    path: '/delete-custom-group',
    query: { id: groupId },
  });
}

export async function updateCustomGroup(
  client: ApiClient,
  groupUpdateData: UpdateCustomGroupData
): Promise<void> {
  await client.request<any>({
    method: 'PUT',
    path: '/update-custom-group',
    body: groupUpdateData,
  });
}

export async function saveUserCustomGroupOrder(client: ApiClient, orderedIds: string[]): Promise<void> {
  await client.request<any>({
    method: 'POST',
    path: '/update-user-custom-group-order',
    body: { orderedIds },
  });
}

