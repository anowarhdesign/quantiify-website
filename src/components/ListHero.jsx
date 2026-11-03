import ShaderCanvas from './cad/ShaderCanvas.jsx';

/** Light hero used by listing and document pages (blog, case studies, legal). */
export default function ListHero({ innerClass = '', children }) {
  return (
    <section className="hero p-hero list-hero">
      <ShaderCanvas />
      <div className={'wrap' + (innerClass ? ' ' + innerClass : '')}>{children}</div>
    </section>
  );
}
