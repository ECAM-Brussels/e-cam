import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';
import { getMicrosoftToken } from '~/lib/auth/azure';
import { login } from '~/lib/auth/session';

export default function Callback() {
  const navigate = useNavigate();

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const codeVerifier = sessionStorage.getItem('codeVerifier');
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