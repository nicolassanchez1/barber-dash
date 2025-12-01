import React from 'react';
import { Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(({ session }) => session);
  return user?.token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
