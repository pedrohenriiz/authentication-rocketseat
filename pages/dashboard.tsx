import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { setupAPIClient } from '../services/api';
import { api } from '../services/apiClient';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { withSSRAuth } from '../utils/withSSRAuth';
import { useCan } from '../hooks/useCan';

import { destroyCookie } from 'nookies';
import { Can } from '../component/Can';

export default function Dashboard() {
  const { user, signOut, authChannel } = useContext(AuthContext);

  useEffect(() => {
    api
      .get('/me')
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }, []);

  function handleSignOut() {
    authChannel.current.postMessage('signOut');
    signOut();
  }

  return (
    <>
      <h1>Dashboard</h1>
      {user.email}

      <button onClick={handleSignOut}>Sign out</button>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);
  const response = await apiClient.get('/me');

  return {
    props: {},
  };
});
