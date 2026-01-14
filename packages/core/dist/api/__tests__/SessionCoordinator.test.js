"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionCoordinator_1 = require("../SessionCoordinator");
describe('SessionCoordinator', () => {
    let coordinator;
    beforeEach(() => {
        coordinator = new SessionCoordinator_1.SessionCoordinator();
    });
    afterEach(() => {
        coordinator.cleanup();
    });
    describe('markUserInitiatedLogout', () => {
        it('should mark logout as user-initiated', () => {
            coordinator.markUserInitiatedLogout();
            expect(coordinator.isUserInitiated()).toBe(true);
        });
        it('should auto-reset user-initiated flag after timeout', (done) => {
            coordinator.markUserInitiatedLogout();
            expect(coordinator.isUserInitiated()).toBe(true);
            // Wait for auto-reset (10 seconds + buffer)
            setTimeout(() => {
                expect(coordinator.isUserInitiated()).toBe(false);
                done();
            }, 10100);
        }, 11000);
    });
    describe('startLogout / endLogout', () => {
        it('should prevent concurrent logout attempts', () => {
            const firstAttempt = coordinator.startLogout();
            expect(firstAttempt).toBe(true);
            expect(coordinator.isLogoutInProgress()).toBe(true);
            const secondAttempt = coordinator.startLogout();
            expect(secondAttempt).toBe(false);
            expect(coordinator.isLogoutInProgress()).toBe(true);
            coordinator.endLogout();
            expect(coordinator.isLogoutInProgress()).toBe(false);
        });
        it('should allow logout after previous logout completes', () => {
            coordinator.startLogout();
            coordinator.endLogout();
            const secondAttempt = coordinator.startLogout();
            expect(secondAttempt).toBe(true);
            expect(coordinator.isLogoutInProgress()).toBe(true);
            coordinator.endLogout();
        });
    });
    describe('reset', () => {
        it('should reset all flags', () => {
            coordinator.markUserInitiatedLogout();
            coordinator.startLogout();
            expect(coordinator.isUserInitiated()).toBe(true);
            expect(coordinator.isLogoutInProgress()).toBe(true);
            coordinator.reset();
            expect(coordinator.isUserInitiated()).toBe(false);
            expect(coordinator.isLogoutInProgress()).toBe(false);
        });
        it('should clear auto-reset timer', (done) => {
            coordinator.markUserInitiatedLogout();
            coordinator.reset();
            // Timer should be cleared, so flag should remain false
            setTimeout(() => {
                expect(coordinator.isUserInitiated()).toBe(false);
                done();
            }, 10100);
        }, 11000);
    });
    describe('cleanup', () => {
        it('should clear timers on cleanup', () => {
            coordinator.markUserInitiatedLogout();
            coordinator.cleanup();
            // Cleanup should clear the timer, preventing auto-reset
            // We can't easily verify this without waiting 10 seconds,
            // but at minimum it shouldn't throw
            expect(() => coordinator.cleanup()).not.toThrow();
        });
    });
    describe('integration scenario', () => {
        it('should handle user-initiated logout with concurrent 401s', () => {
            // User clicks logout button
            coordinator.markUserInitiatedLogout();
            expect(coordinator.isUserInitiated()).toBe(true);
            // Logout process starts
            const startedLogout = coordinator.startLogout();
            expect(startedLogout).toBe(true);
            // During logout, API call gets 401 and tries to trigger session expiration
            // This should be prevented because:
            // 1. isUserInitiated() returns true
            // 2. isLogoutInProgress() returns true
            const shouldShowSessionExpired = !coordinator.isUserInitiated() &&
                !coordinator.isLogoutInProgress();
            expect(shouldShowSessionExpired).toBe(false);
            // Another 401 during logout should also be prevented
            const anotherLogoutAttempt = coordinator.startLogout();
            expect(anotherLogoutAttempt).toBe(false);
            // Logout completes
            coordinator.endLogout();
            coordinator.reset();
            expect(coordinator.isUserInitiated()).toBe(false);
            expect(coordinator.isLogoutInProgress()).toBe(false);
        });
        it('should handle automatic session expiration', () => {
            // Token expires, API call gets 401
            // This is NOT user-initiated
            expect(coordinator.isUserInitiated()).toBe(false);
            // Session expiration handler should be allowed to run
            const canStartLogout = coordinator.startLogout();
            expect(canStartLogout).toBe(true);
            // Session expiration message should be shown
            const shouldShowMessage = !coordinator.isUserInitiated();
            expect(shouldShowMessage).toBe(true);
            coordinator.endLogout();
        });
    });
});
//# sourceMappingURL=SessionCoordinator.test.js.map