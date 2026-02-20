import type { ApiClient, Machine, MachineTag, Reservation, RecurringRule, CreateMachineData, UpdateMachineData, CreateMachineTagData, UpdateMachineTagData, CreateReservationData, UpdateReservationData, CreateRecurringRuleData, UpdateRecurringRuleData, ListReservationsParams, ListMyReservationsParams, CheckAvailabilityParams, CheckAvailabilityResponse, ListMachinesParams, RejectReservationData, SetMachineApproversData, SetMachineApproversResponse, ApproveReservationData, ApproveReservationResponse, DeactivateRecurringRuleParams, MachineImagePresignedUrlRequest, MachineImagePresignedUrlResponse, MachineImageViewUrlRequest, MachineImageViewUrlResponse, CheckOutReservationData } from '@labshare/shared-core';
import { type ApiError } from '@labshare/shared-core';
export declare function useMachineTags(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<MachineTag[], Error>;
export declare function useMachineTagMutations(client: ApiClient): {
    createTagMutation: import("@tanstack/react-query").UseMutationResult<MachineTag, Error, CreateMachineTagData, unknown>;
    updateTagMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data: UpdateMachineTagData;
    }, unknown>;
    deleteTagMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
};
export declare function useMachines(client: ApiClient, params?: ListMachinesParams & {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Machine[], Error>;
export declare function useMachine(client: ApiClient, params: {
    machineId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Machine | null, Error | ApiError<unknown>>;
export declare function useMachineMutations(client: ApiClient): {
    createMachineMutation: import("@tanstack/react-query").UseMutationResult<Machine, Error, CreateMachineData, unknown>;
    updateMachineMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data: UpdateMachineData;
    }, unknown>;
    deleteMachineMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    setApproversMutation: import("@tanstack/react-query").UseMutationResult<SetMachineApproversResponse, Error, {
        id: string;
        data: SetMachineApproversData;
    }, unknown>;
};
export declare function useReservations(client: ApiClient, params: ListReservationsParams & {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Reservation[], Error>;
export declare function useMyReservations(client: ApiClient, params?: ListMyReservationsParams & {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Reservation[], Error>;
export declare function useReservation(client: ApiClient, params: {
    reservationId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Reservation | null, Error | ApiError<unknown>>;
export declare function useCheckAvailability(client: ApiClient, params: CheckAvailabilityParams & {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<CheckAvailabilityResponse, Error>;
export declare function usePendingApprovals(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<Reservation[], Error>;
export declare function useReservationMutations(client: ApiClient): {
    createReservationMutation: import("@tanstack/react-query").UseMutationResult<Reservation, Error, CreateReservationData, unknown>;
    updateReservationMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data: UpdateReservationData;
    }, unknown>;
    cancelReservationMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    approveReservationMutation: import("@tanstack/react-query").UseMutationResult<ApproveReservationResponse, Error, {
        id: string;
        data?: ApproveReservationData;
    }, unknown>;
    rejectReservationMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data?: RejectReservationData;
    }, unknown>;
    checkInMutation: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
    checkOutMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data?: CheckOutReservationData;
    }, unknown>;
};
export declare function useRecurringRules(client: ApiClient, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<RecurringRule[], Error>;
export declare function useRecurringRule(client: ApiClient, params: {
    ruleId: string | null | undefined;
    enabled?: boolean;
}): import("@tanstack/react-query").UseQueryResult<RecurringRule | null, Error | ApiError<unknown>>;
export declare function useRecurringRuleMutations(client: ApiClient): {
    createRuleMutation: import("@tanstack/react-query").UseMutationResult<RecurringRule, Error, CreateRecurringRuleData, unknown>;
    updateRuleMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        data: UpdateRecurringRuleData;
    }, unknown>;
    deactivateRuleMutation: import("@tanstack/react-query").UseMutationResult<void, Error, {
        id: string;
        params?: DeactivateRecurringRuleParams;
    }, unknown>;
};
export declare function useMachineImageUpload(client: ApiClient): {
    generatePresignedUrlMutation: import("@tanstack/react-query").UseMutationResult<MachineImagePresignedUrlResponse, Error, MachineImagePresignedUrlRequest, unknown>;
    getViewUrlMutation: import("@tanstack/react-query").UseMutationResult<MachineImageViewUrlResponse, Error, MachineImageViewUrlRequest, unknown>;
};
//# sourceMappingURL=reservations.d.ts.map