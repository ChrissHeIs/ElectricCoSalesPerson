import { User, ApiResponse, AuthResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL
const proxyUrl = process.env.REACT_APP_PROXY_URL;

export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const apiUrl = `${API_BASE_URL}/accessTokens/loginSalesperson`;
    console.log(apiUrl);
    const url = `${proxyUrl}/api/proxy?url=${encodeURIComponent(apiUrl)}`;
    console.log(url);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      token: data.token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateAccessCode(user: User, token: string): Promise<ApiResponse> {
  try {
    console.log(token);
    const response = await fetch(`${API_BASE_URL}/accessTokens/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': token,
      },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, we should handle this
        throw new Error('Authentication expired, please login again');
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      code: data.shortCode,
    };
  } catch (error) {
    console.error('Error generating access code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}