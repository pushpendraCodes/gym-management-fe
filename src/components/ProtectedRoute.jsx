// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { logOutAsync } from '../features/Auth/AuthSlice';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // Loading state while checking tokens
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/auth/refresh-token', { refreshToken });

      const {  newAccessToken } = response.data;
      localStorage.setItem('accessToken', newAccessToken);

      return true; // Token refreshed successfully
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return false; // Token refresh failed
    }
  };

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  // Log out the user and redirect to login
  // const logout = () => {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   window.location.href = '/signin';
  // };

  // Effect to check token status and refresh if needed
  useEffect(() => {
    const checkTokens = async () => {
      if (!accessToken || !refreshToken) {
        logOutAsync();
        window.location.href = '/signin';
        return;
      }

      if (isTokenExpired(accessToken)) {
        // Access token expired, attempt to refresh it
        if (isTokenExpired(refreshToken)) {
          // Refresh token expired, log the user out
          logOutAsync();
          window.location.href = '/signin';
        } else {
          // Refresh token is still valid, refresh the access token
          const tokenRefreshed = await refreshAccessToken();
          if (!tokenRefreshed) {
            logOutAsync();
            window.location.href = '/signin'; // If refreshing the token failed, log out
          } else {
            setLoading(false); // Token successfully refreshed, allow access
          }
        }
      } else {
        // Access token is still valid
        setLoading(false);
      }
    };

    checkTokens();
  }, [accessToken, refreshToken]);

  // Show a loading spinner or some fallback while checking the tokens
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the protected route if tokens are valid or refreshed
  return children;
};

export default ProtectedRoute;