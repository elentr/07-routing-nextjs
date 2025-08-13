import axios from 'axios';
import type { Note, NewNote, FetchNotesResponse } from '@/types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

export const fetchNotes = async (
  page: number,
  search: string
): Promise<FetchNotesResponse> => {
  const params = {
    page,
    perPage: 12,
    search,
  };
  if (search.trim()) params.search = search.trim();
  const res = await axios.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const res = await axios.post<Note>('/notes', newNote, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};
