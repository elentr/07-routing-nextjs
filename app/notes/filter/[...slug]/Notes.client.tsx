'use client';
import css from '@/components/NotesPage/NotesPage.module.css';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import { Note } from '@/types/note';

type Props = {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
};

const NotesClient = ({ initialData }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, debouncedSearch),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    initialData,
  });
  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchQuery} onSearch={setSearchQuery} />
          {isSuccess && totalPages > 1 && (
            <Pagination
              currentActivePage={currentPage}
              totalNumberOfPages={totalPages}
              setPage={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
          {isModalOpen && (
            <Modal onClose={closeModal}>
              <NoteForm onCloseModal={closeModal} />
            </Modal>
          )}
        </header>
        {notes.length > 0 ? (
          <NoteList notes={notes} />
        ) : (
          <p className={css.emptyMessage}>No notes available.</p>
        )}
      </div>
    </>
  );
};

export default NotesClient;
