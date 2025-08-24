import css from './SidebarNotes.module.css';
import Link from 'next/link';

const tags = [
  { id: 'All', name: 'All' },
  { id: 'Todo', name: 'Todo' },
  { id: 'Work', name: 'Work' },
  { id: 'Personal', name: 'Personal' },
  { id: 'Meeting', name: 'Meeting' },
  { id: 'Shopping', name: 'Shopping' },
];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {tags.map(tag => (
        <li key={tag.id} className={css.menuItem}>
          <Link href={`/notes/filter/${tag.id}`} className={css.menuLink}>
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
