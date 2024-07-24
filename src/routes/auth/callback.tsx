import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { getMicrosoftToken } from '~/lib/auth/azure';
import { login } from '~/lib/auth/session';

export default function Callback() {
  const navigate = useNavigate();

  createEffect(async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (code && codeVerifier) {
      try {
        const tokenData = await getMicrosoftToken(code, codeVerifier);
        await login(tokenData.access_token)

        navigate('/');
      } catch (error) {
        console.error('Authentication error:', error);
      }
    }
  });

  return <div>Authenticating...</div>;
}