// src/utils/authUtils.js
export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');
    
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
        // Access token expired, try to refresh
        const refreshResponse = await fetch('/user/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
            const { token } = await refreshResponse.json();
            localStorage.setItem('accessToken', token);

            // Retry the original request with the new token
            options.headers['Authorization'] = `Bearer ${token}`;
            response = await fetch(url, options);
        } else {
            // Refresh token failed, redirect to login
            window.location.href = '/login';
        }
    }

    return response;
}
