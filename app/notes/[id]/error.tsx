'use client';

import React from 'react';
import css from '@/components/ErrorMessage/ErrorMessage.module.css';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div>
      <p className={css.text}>
        Could not fetch the list of notes. {error.message}
      </p>
      <button className={css.button} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
