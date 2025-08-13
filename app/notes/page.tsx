import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function Notes() {
  const initialQuery = '';
  const initialPage = 1;

  const data = await fetchNotes(initialPage, initialQuery);

  return (
    <>
      <NotesClient initialData={data} />
    </>
  );
}
