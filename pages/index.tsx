import { GetServerSideProps } from 'next';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { parseCookies } from 'nookies';
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isAuthenticated } = useContext(AuthContext);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type='email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label>Password</label>
      <input
        type='password'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type='submit'>Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGuest(async (context) => {
  return {
    props: {},
  };
});
