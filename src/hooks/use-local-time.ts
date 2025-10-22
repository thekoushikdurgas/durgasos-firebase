'use client';

import { useState, useEffect } from 'react';

export function useLocalTime() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' }));
    };

    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000 * 60); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  return { time, date };
}
