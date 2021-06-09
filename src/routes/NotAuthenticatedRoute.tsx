/* eslint-disable no-extra-boolean-cast */
import React from 'react';
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  // notAuthenticated?: boolean;
  component: React.ComponentType;
}

const PrivateRoute: React.FC<RouteProps> = ({
  // notAuthenticated = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return !user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/profile',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
