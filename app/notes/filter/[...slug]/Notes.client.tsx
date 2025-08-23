'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import css from '@/components/NotesPage/NotesPage.module.css';

import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import NoteModal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import { fetchNotes, type FetchNotesResponse } from '@/lib/api';

interface NotesClientProps {
  initialData: FetchNotesResponse;
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 700);
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedTag =
    initialTag && initialTag !== 'All'
      ? initialTag.charAt(0).toUpperCase() + initialTag.slice(1).toLowerCase()
      : undefined;

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchValue, currentPage, normalizedTag],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearchValue,
        page: currentPage,
        tag: normalizedTag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    initialData:
      debouncedSearchValue === '' && currentPage === 1
        ? initialData
        : undefined,
  });
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  if (!data) return null;
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchValue} onSearch={handleSearch} />
        {data?.totalPages > 1 && (
          <Pagination
            currentActivePage={currentPage}
            totalNumberOfPages={data.totalPages}
            setPage={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create Note +
        </button>
      </div>

      {isFetching && <Loader />}
      {isError && <ErrorMessage message="Failed to fetch notes" />}

      {isSuccess &&
        (data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          <div className={css.emptyState}>
            <p>No notes found. Create your first note!</p>
          </div>
        ))}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCloseModal={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </NoteModal>
      )}
    </div>
  );
}
