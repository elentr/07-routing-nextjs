import css from './NoteForm.module.css';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useId } from 'react';
import { createNote } from '@/lib/api';
import type { NoteTag, Note, CreateNotePayload } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const values: FormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteFormProps {
  onCloseModal: () => void;
  onSuccess?: () => void;
}

const AddNoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Too Long!')
    .required('Required field'),
  content: Yup.string().max(500, 'Too Long!'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(
      {
        title: values.title,
        content: values.content,
        tag: values.tag,
      },
      {
        onSuccess: () => {
          mutation.reset();
          onCloseModal();
        },
      }
    );
  };

  return (
    <Formik
      initialValues={values}
      validationSchema={AddNoteSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              name="content"
              rows={8}
              id={`${fieldId}-content`}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <Field
              as="select"
              name="tag"
              id={`${fieldId}-tag`}
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
