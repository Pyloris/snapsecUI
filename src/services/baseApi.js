import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define base query with common configuration
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL || "https://suite.snapsec.co",
    prepareHeaders: (headers, { getState }) => {
        // Get token from state (adjust path based on your auth slice structure)
        const token = getState().auth?.token || localStorage.getItem('token')
        
        // Set common headers
        headers.set('Content-Type', 'application/json')
        
        // Add authorization header if token exists
        if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        }
        
        return headers
    },
})

// Base query with error handling and 401 logout logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    // Handle 401 unauthorized responses
    if (result?.error?.status === 401) {
        // Clear all authentication data from localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        // Add any other auth-related localStorage keys you want to clear
        
        // Invalidate all cached data
        api.dispatch(baseApi.util.resetApiState())
        
        // Clear any auth state in Redux if you have an auth slice
        // api.dispatch(logout())
        
        // Redirect to signin page
        window.location.href = '/signin'
        
        // Optionally, you can use React Router's navigate if available
        // Note: This requires access to navigate function, which might not be available here
        // Alternative: dispatch a custom action that components can listen to for navigation
    }

    return result
}

// Create the base API
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    
    // Define tag types for cache invalidation
    tagTypes: [
        'User',
        // Add more tag types as needed
    ],
    
    // Keep unused data for 60 seconds
    keepUnusedDataFor: 60,
    
    // Refetch on mount or arg change
    refetchOnMountOrArgChange: 30,
    
    // Refetch on focus (optional)
    refetchOnFocus: false,
    
    // Refetch on reconnect
    refetchOnReconnect: true,
    
    // Empty endpoints object - will be injected later
    endpoints: () => ({}),
})

// Export hooks (will be populated when endpoints are injected)
export const {} = baseApi