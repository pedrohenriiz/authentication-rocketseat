import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { setupAPIClient } from '../services/api';
import { api } from '../services/apiClient';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { withSSRAuth } from '../utils/withSSRAuth';

import { destroyCookie } from 'nookies';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get('/me')
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      {user.email}
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);
  const response = await apiClient.get('/me');

  console.log(response);

  return {
    props: {},
  };
});
