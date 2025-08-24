'use client';

import { fetchNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

const formatDate = (date?: string) => {
  return date ? new Date(date).toLocaleString() : 'N/A';
};

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note, Error>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
    staleTime: 60_000,
  });

  const handleBack = () => router.back();

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!data) return <p>Something went wrong.</p>;

  const formattedData = data.updatedAt
    ? `Updated at: ${formatDate(data.updatedAt)}`
    : `Created at: ${formatDate(data.createdAt)}`;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <button className={css.backLink} onClick={handleBack}>
          ← Back
        </button>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>{formattedData}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
