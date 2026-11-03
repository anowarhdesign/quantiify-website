// Annotated product screens (real UI exports) shared by the hero tour and the How it works viewer.
// Each overlay is a short CSS animation (styles: "per-step product animations") whose length is `ms`;
// hl boxes / dots are positioned in % of the screenshot, so they line up at any size.
import { asset } from '../../content/site.js';

const CURSOR = <svg className="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.6L4 20z" /></svg>;

export const SCREENS = {
  setup: {
    img: 'ui/project-setup.webp', w: 1800, h: 1190, ms: 3400, focus: ['58%', '42%'],
    alt: "Quantiify: Create New Project form",
    overlay: <><span className="type">Downtown Office Complex</span><i className="hl create" style={{'--x': '43.9%', '--y': '80.6%', '--w': '30%', '--h': '3.8%'}} />{CURSOR}<i className="ring" /><span className="tipc solo">Name it, pick the trade and units</span></>,
  },
  uploading: {
    img: 'ui/uploading.webp', w: 1800, h: 1189, ms: 2400, focus: ['58%', '34%'],
    alt: "Quantiify: Uploading drawing documents",
    overlay: <><b className="upbar" /><span className="tipc solo">Upload PDF and CAD drawing sets</span></>,
  },
  legend: {
    img: 'ui/legend.webp', w: 1800, h: 1422, ms: 4200, focus: ['80%', '42%'],
    alt: "Quantiify: Legend Overview with AI legend detection",
    overlay: <><i className="hl auto" style={{'--x': '84.6%', '--y': '8.6%', '--w': '14.2%', '--h': '2.8%'}} /><i className="hl lrow r1" style={{'--x': '55.6%', '--y': '32.0%', '--w': '24.6%', '--h': '4.4%'}} /><i className="hl lrow r2" style={{'--x': '55.6%', '--y': '37.599999999999994%', '--w': '24.6%', '--h': '4.4%'}} /><i className="hl lrow r3" style={{'--x': '55.6%', '--y': '43.199999999999996%', '--w': '24.6%', '--h': '4.4%'}} /><i className="hl lrow r4" style={{'--x': '55.6%', '--y': '48.8%', '--w': '24.6%', '--h': '4.4%'}} /><i className="hl lrow r5" style={{'--x': '55.6%', '--y': '54.5%', '--w': '24.6%', '--h': '4.4%'}} /><i className="hl lrow r6" style={{'--x': '55.6%', '--y': '60.099999999999994%', '--w': '24.6%', '--h': '4.4%'}} /><i className="hl lrow r7" style={{'--x': '55.6%', '--y': '65.7%', '--w': '24.6%', '--h': '4.4%'}} /><span className="cnt c1 mono" style={{'--y': '20.8%'}}>36</span><span className="cnt c2 mono" style={{'--y': '24.4%'}}>08</span><span className="cnt c3 mono" style={{'--y': '28.1%'}}>02</span><span className="cnt c4 mono" style={{'--y': '31.7%'}}>07</span><span className="cnt c5 mono" style={{'--y': '35.4%'}}>18</span><span className="cnt c6 mono" style={{'--y': '39.1%'}}>16</span>{CURSOR}<i className="ring" /><span className="tipc t1">AI auto-detects the legend</span><span className="tipc t2">Every legend symbol is matched</span><span className="tipc t3">Counts fill in per legend</span></>,
  },
  symbols: {
    img: 'product/app-symbol-count-ui.webp', w: 1371, h: 991, ms: 4200, focus: ['45%', '48%'],
    alt: "Quantiify: Symbol counting on the drawing",
    overlay: <><i className="sd" style={{'--x': '32.68%', '--y': '42.99%', '--k': '0'}} /><i className="sd" style={{'--x': '33.63%', '--y': '37.13%', '--k': '1'}} /><i className="sd" style={{'--x': '34.35%', '--y': '50.86%', '--k': '2'}} /><i className="sd" style={{'--x': '34.35%', '--y': '58.22%', '--k': '3'}} /><i className="sd" style={{'--x': '34.35%', '--y': '65.39%', '--k': '4'}} /><i className="sd" style={{'--x': '37.86%', '--y': '37.13%', '--k': '5'}} /><i className="sd" style={{'--x': '40.63%', '--y': '44.10%', '--k': '6'}} /><i className="sd" style={{'--x': '40.99%', '--y': '50.86%', '--k': '7'}} /><i className="sd" style={{'--x': '40.99%', '--y': '53.68%', '--k': '8'}} /><i className="sd" style={{'--x': '40.99%', '--y': '55.30%', '--k': '9'}} /><i className="sd" style={{'--x': '40.99%', '--y': '58.22%', '--k': '10'}} /><i className="sd" style={{'--x': '40.99%', '--y': '65.39%', '--k': '11'}} /><i className="sd" style={{'--x': '42.01%', '--y': '37.13%', '--k': '12'}} /><i className="sd" style={{'--x': '45.37%', '--y': '65.59%', '--k': '13'}} /><i className="sd" style={{'--x': '49.09%', '--y': '53.08%', '--k': '14'}} /><i className="sd" style={{'--x': '49.09%', '--y': '58.93%', '--k': '15'}} /><i className="sd" style={{'--x': '49.09%', '--y': '66.40%', '--k': '16'}} /><i className="sd" style={{'--x': '50.11%', '--y': '47.53%', '--k': '17'}} /><i className="sd" style={{'--x': '53.03%', '--y': '47.53%', '--k': '18'}} /><i className="sd" style={{'--x': '53.25%', '--y': '61.65%', '--k': '19'}} /><i className="sd" style={{'--x': '54.12%', '--y': '47.53%', '--k': '20'}} /><i className="sd" style={{'--x': '54.78%', '--y': '63.07%', '--k': '21'}} /><i className="sd" style={{'--x': '55.51%', '--y': '58.73%', '--k': '22'}} /><i className="sd" style={{'--x': '57.18%', '--y': '47.53%', '--k': '23'}} /><i className="sd" style={{'--x': '57.91%', '--y': '41.88%', '--k': '24'}} /><i className="sd" style={{'--x': '57.99%', '--y': '32.09%', '--k': '25'}} /><i className="sd" style={{'--x': '61.05%', '--y': '56.81%', '--k': '26'}} /><i className="sd" style={{'--x': '61.63%', '--y': '68.52%', '--k': '27'}} /><i className="sd" style={{'--x': '64.26%', '--y': '47.53%', '--k': '28'}} /><i className="sd" style={{'--x': '66.23%', '--y': '55.10%', '--k': '29'}} /><i className="sd" style={{'--x': '68.49%', '--y': '63.07%', '--k': '30'}} /><i className="sweep" /><span className="tipc solo">Every symbol found and boxed on the sheet</span></>,
  },
  takeoff: {
    img: 'ui/takeoff-cable.webp', w: 1800, h: 1280, ms: 6000, focus: ['72%', '40%'],
    alt: "Quantiify: Cable Length Measurement workspace",
    overlay: <><i className="hl sym" style={{'--x': '84.4%', '--y': '13.2%', '--w': '6.2%', '--h': '2.9%'}} /><i className="hl det d1" style={{'--x': '44.3%', '--y': '33%', '--w': '2.4%', '--h': '3.2%'}} /><i className="hl det d2" style={{'--x': '52.8%', '--y': '32.1%', '--w': '2.4%', '--h': '3.2%'}} /><i className="hl det d3" style={{'--x': '49.1%', '--y': '35.1%', '--w': '2.4%', '--h': '3.2%'}} /><i className="hl det d4" style={{'--x': '36.8%', '--y': '43%', '--w': '2.4%', '--h': '3.2%'}} /><i className="hl det d5" style={{'--x': '52.3%', '--y': '48.8%', '--w': '2.4%', '--h': '3.2%'}} /><i className="hl det d6" style={{'--x': '38.9%', '--y': '52.4%', '--w': '2.4%', '--h': '3.2%'}} /><svg className="cable" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="57" y1="47.6" x2="54.8" y2="63.6" /></svg><span className="len mono">L = 14.13 m</span><i className="hl commit" style={{'--x': '94%', '--y': '65.4%', '--w': '4.4%', '--h': '3.2%'}} />{CURSOR}<i className="ring" /><span className="tipc t1">AI auto-detects symbols</span><span className="tipc t2">Click to measure cable runs</span><span className="tipc t3">Review, then commit</span></>,
  },
  estimate: {
    img: 'ui/estimate.webp', w: 1800, h: 1423, ms: 6000, focus: ['68%', '40%'],
    alt: "Quantiify: Estimation table with priced quantities",
    overlay: <><i className="hl row" style={{'--x': '19.5%', '--y': '29.6%', '--w': '78.8%', '--h': '3.4%'}} /><i className="hl tot t-a" style={{'--x': '87.8%', '--y': '24.8%', '--w': '6.6%', '--h': '2.9%'}} /><i className="hl tot t-b" style={{'--x': '87.8%', '--y': '53.8%', '--w': '6.6%', '--h': '2.9%'}} /><i className="hl exp" style={{'--x': '92.9%', '--y': '15.2%', '--w': '4.4%', '--h': '3.1%'}} />{CURSOR}<i className="ring" /><span className="tipc t1">Each quantity gets a rate</span><span className="tipc t2">Totals roll up by trade</span><span className="tipc t3">Export the estimate</span></>,
  },
  export: {
    img: 'ui/export.webp', w: 1800, h: 1423, ms: 6000, focus: ['52%', '55%'],
    alt: "Quantiify: Export Estimation dialog",
    overlay: <><i className="hl xls" style={{'--x': '22%', '--y': '39%', '--w': '18.2%', '--h': '5.6%'}} /><i className="hl go" style={{'--x': '69%', '--y': '74.4%', '--w': '9.2%', '--h': '3.4%'}} /><span className="toast mono">Estimate_E-101.xlsx &middot; ready</span>{CURSOR}<i className="ring" /><span className="tipc t1">Pick Excel, CSV or PDF</span><span className="tipc t2">Download a BOQ-ready file</span></>,
  },
  dashboard: {
    img: 'ui/dashboard.webp', w: 1800, h: 1190, ms: 2600, focus: ['78%', '30%'],
    alt: "Quantiify: Quantiify dashboard with projects",
    overlay: <><i className="hl newp" style={{'--x': '87.0%', '--y': '24.2%', '--w': '9.8%', '--h': '4.0%'}} />{CURSOR}<i className="ring" /><span className="tipc solo">Start from the dashboard &middot; New project</span></>,
  },
  upload: {
    img: 'ui/upload.webp', w: 1800, h: 1189, ms: 5000, focus: ['60%', '45%'],
    alt: "Quantiify: Files uploaded to the project",
    overlay: <><i className="hl card" style={{'--x': '41.5%', '--y': '45%', '--w': '34.8%', '--h': '9.5%'}}><b className="bar" /></i><i className="hl next" style={{'--x': '69.4%', '--y': '73.4%', '--w': '6.9%', '--h': '3.7%'}} /><span className="file mono">E-101_lighting.pdf</span>{CURSOR}<i className="ring" /><span className="tipc t1">Add more sheets any time</span><span className="tipc t2">Every sheet stays organized</span><span className="tipc t3">Next step &rarr; analyze</span></>,
  },
  detecting: {
    img: 'ui/analyze.webp', w: 1800, h: 1280, ms: 2600, focus: ['62%', '45%'],
    alt: "Quantiify: AI detecting symbols and cable trays",
    overlay: <><i className="pulse" /><span className="tipc solo">AI reads and classifies every sheet</span></>,
  },
};

/** One screen: screenshot + its animated annotations, framed to the image's own aspect ratio. */
export function Shot({ name, eager = false }) {
  const s = SCREENS[name];
  const src = asset(s.img), small = asset(s.img.replace(/\.webp$/, '-900.webp'));
  return (
    <div className="shot" style={{ '--ar': `${s.w}/${s.h}`, '--fx': s.focus[0], '--fy': s.focus[1] }}>
      <img src={src} srcSet={`${small} 900w, ${src} ${s.w}w`} sizes="(max-width: 720px) 100vw, 1100px" width={s.w} height={s.h}
        {...(eager ? { fetchPriority: 'high' } : { loading: 'lazy' })} alt={s.alt} />
      <div className={`an an-${name}`} aria-hidden="true" style={{ '--d': (s.ms / 1000).toFixed(1) + 's' }}>{s.overlay}</div>
    </div>
  );
}
