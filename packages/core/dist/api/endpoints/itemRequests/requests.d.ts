import type { ApiClient } from '../../ApiClient';
import type { CreateItemRequestRequest, CreateItemRequestResponse, ListItemRequestsResponse } from '../../../types/itemRequests';
export declare function listItemRequests(client: ApiClient, params: {
    q?: string;
    direction?: string;
    status?: string;
    page?: number;
    limit?: number;
}): Promise<ListItemRequestsResponse>;
export declare function createItemRequest(client: ApiClient, body: CreateItemRequestRequest): Promise<CreateItemRequestResponse>;
export declare function acceptItemRequest(client: ApiClient, requestId: string): Promise<{
    message: string;
}>;
export declare function denyItemRequest(client: ApiClient, requestId: string): Promise<{
    message: string;
}>;
export declare function fulfillItemRequest(client: ApiClient, requestId: string): Promise<{
    message: string;
}>;
export declare function cancelItemRequest(client: ApiClient, requestId: string): Promise<{
    message: string;
}>;
//# sourceMappingURL=requests.d.ts.map