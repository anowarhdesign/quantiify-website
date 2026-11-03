/** CAD dimension line with a centred label: |—— LABEL ——| */
export default function DimLine({ label, className = '', hidden = true }) {
  return (
    <div className={'dim' + (className ? ' ' + className : '')} aria-hidden={hidden ? 'true' : undefined}>
      <span className="dim-tick" /><span className="dim-line" />
      <span className="dim-label">{label}</span>
      <span className="dim-line" /><span className="dim-tick" />
    </div>
  );
}
