import { useEffect, useRef, useState } from 'react';

/** Header dropdown: opens on hover or click, closes on leave, outside click, focus leaving or Escape. */
export default function NavDropdown({ id, label, small = false, children }) {
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null), btnRef = useRef(null), timer = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); btnRef.current.focus(); } };
    const onClick = e => { if (!ddRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div
      ref={ddRef}
      className={'nav-dd' + (small ? ' small' : '') + (open ? ' open' : '')}
      onMouseEnter={() => { clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setOpen(false), 150); }}
      onBlur={e => { if (!ddRef.current.contains(e.relatedTarget)) setOpen(false); }}
      onClick={e => { if (e.target.closest('a')) setOpen(false); }}
    >
      <button ref={btnRef} type="button" className="dd-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>{label}</button>
      <div className={'dd-menu' + (small ? ' dd-list' : '')} id={id}>{children}</div>
    </div>
  );
}
