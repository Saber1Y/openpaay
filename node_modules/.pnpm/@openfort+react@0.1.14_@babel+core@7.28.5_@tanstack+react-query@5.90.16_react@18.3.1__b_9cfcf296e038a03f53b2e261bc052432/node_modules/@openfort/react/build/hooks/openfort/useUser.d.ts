/**
 * Hook for accessing current user information and authentication state
 *
 * This hook provides access to the current authenticated user's information and
 * authentication status. It also offers methods to manage access tokens and validate
 * user sessions. The hook automatically updates when authentication state changes.
 *
 * @returns Current user state and authentication utilities
 *
 * @example
 * ```tsx
 * const userHook = useUser();
 *
 * // Check if user is authenticated
 * if (userHook.isAuthenticated && userHook.user) {
 *   console.log('User is authenticated:', userHook.user);
 *   console.log('User ID:', userHook.user.id);
 *   console.log('User email:', userHook.user.email);
 *   console.log('Linked accounts:', userHook.user.linkedAccounts);
 * } else {
 *   console.log('User is not authenticated');
 * }
 *
 * // Get fresh access token
 * const getToken = async () => {
 *   try {
 *     const token = await userHook.getAccessToken();
 *     console.log('Access token:', token);
 *   } catch (error) {
 *     console.error('Failed to get access token:', error);
 *   }
 * };
 *
 * // Validate and refresh token if needed
 * const refreshToken = async () => {
 *   try {
 *     await userHook.validateAndRefreshToken();
 *     console.log('Token validated and refreshed');
 *   } catch (error) {
 *     console.error('Token validation failed:', error);
 *   }
 * };
 * ```
 */
export declare function useUser(): {
    user: import("@openfort/openfort-js").AuthPlayerResponse | null;
    isAuthenticated: boolean;
    getAccessToken: () => Promise<string | null>;
    validateAndRefreshToken: () => Promise<void>;
};
