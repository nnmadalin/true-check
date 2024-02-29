"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/index.html');
  }, []);

  return null; // Nu este nevoie să returnezi nimic, deoarece utilizatorul va fi redirecționat automat
}
