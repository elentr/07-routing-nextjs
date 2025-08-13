import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.loading} role="status" aria-live="polite">
      <div className={css.loader}></div>
      <p className={css.text}> Loading notes, please wait...</p>
    </div>
  );
}
