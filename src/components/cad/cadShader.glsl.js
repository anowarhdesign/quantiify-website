// AutoCAD-style model-space background (WebGL2): a procedural floor plan whose rooms
// fill with standard hatch patterns, and a HATCH preview under the cursor.
export const VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

export const FRAG = `#version 300 es
precision highp float;
uniform vec2 res; uniform float t; uniform vec2 mouse; uniform float dark; uniform float S;
out vec4 o;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Procedural floor plan: blocks of 9 × 6 units, each split three times into rooms.
const vec2 B = vec2(9., 6.);
void room(vec2 w, out vec2 cell, out vec2 lo, out vec2 hi){
  cell = floor(w / B);
  vec2 lp = w - cell * B;
  lo = vec2(0.); hi = B;
  vec2 seed = cell;
  for (int i = 0; i < 3; i++){
    vec2 sz = hi - lo;
    if (min(sz.x, sz.y) < 2.2) break;
    float r = hash(seed + float(i) * 7.13);
    bool sx = sz.x > sz.y * (.75 + .5 * hash(seed + 3.3));
    if (sx){ float s = floor(mix(lo.x, hi.x, .3 + .4 * r) * 2.) / 2.;
      if (lp.x < s){ hi.x = s; seed += vec2(1.3, .7); } else { lo.x = s; seed += vec2(2.9, 1.1); } }
    else   { float s = floor(mix(lo.y, hi.y, .3 + .4 * r) * 2.) / 2.;
      if (lp.y < s){ hi.y = s; seed += vec2(.5, 3.1); } else { lo.y = s; seed += vec2(4.2, .3); } }
  }
}
float lineAA(float v, float wpx){ float f = fwidth(v); float d = abs(fract(v + .5) - .5) / f; return 1. - smoothstep(wpx * .5, wpx * .5 + 1., d); }

// AutoCAD hatch patterns (in world units)
float hatch(int k, vec2 w){
  if (k == 0) return lineAA((w.x + w.y) * 2.2, 1.);                                  // ANSI31
  if (k == 1) return max(lineAA((w.x + w.y) * 1.6, 1.), lineAA((w.x - w.y) * 1.6, 1.)); // ANSI37
  if (k == 2){ vec2 g = fract(w * 3.) - .5; float r = length(g) / fwidth(w.x * 3.); return 1. - smoothstep(1., 2., r); } // AR-CONC dots
  if (k == 3){ float row = floor(w.y * 3.); float h = lineAA(w.y * 3., 1.);               // AR-BRSTD brick
    float v = lineAA(w.x * 1.5 + .5 * mod(row, 2.), 1.); return max(h, v * step(.08, fract(w.y * 3.)) * step(fract(w.y * 3.), .92)); }
  return 0.;
}

void main(){
  vec2 uv = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y) / res.x;   // from the top, in widths: height changes don't move it
  vec2 pan = vec2(t * .055, t * .022);
  // anchored to the section's top edge, so a change in section height never shifts the plan
  vec2 w = vec2(gl_FragCoord.x - .5 * res.x, res.y - gl_FragCoord.y) / S + pan;
  vec2 wm = vec2(mouse.x - .5 * res.x, res.y - mouse.y) / S + pan;

  vec2 cell, lo, hi; room(w, cell, lo, hi);
  vec2 mc, mlo, mhi; room(wm, mc, mlo, mhi);
  vec2 lp = w - cell * B;
  float px = 1. / S;                                     // one pixel in world units

  float dRoom = min(min(lp.x - lo.x, hi.x - lp.x), min(lp.y - lo.y, hi.y - lp.y)) / px;
  float dBlock = min(min(lp.x, B.x - lp.x), min(lp.y, B.y - lp.y)) / px;
  float wall = 1. - smoothstep(.6, 1.6, dRoom);
  float ext = 1. - smoothstep(1.4, 2.6, dBlock);

  float id = hash(cell * 13.1 + lo * 3.7 + hi * 1.9);
  int k = int(floor(id * 5.));                             // 4 = empty room
  float phase = fract(id * 7.3);
  float vis = smoothstep(.3, 1., sin(t * .16 + phase * 6.2832) * .5 + .5);
  float hv = hatch(k, w) * vis;
  float inset = smoothstep(2., 5., dRoom);                // keep hatch off the walls
  hv *= inset;

  bool hover = all(equal(cell, mc)) && all(equal(lo, mlo)) && all(equal(hi, mhi)) && mouse.x > -9000.;
  float hp = hover ? hatch(0, w) * inset : 0.;            // HATCH preview under the cursor

  float edge = smoothstep(.12, .7, length((uv - vec2(.5, .28)) * vec2(1.3, 1.6)));
  float a = .18 + .82 * edge;

  vec3 col;
  if (dark > .5){
    col = vec3(.043, .071, .125);                          // section navy
    col = mix(col, vec3(.56, .76, .98), hv * .05 * a);
    col = mix(col, vec3(.56, .76, .98), max(wall * .04, ext * .07) * a);
    if (hover){ col = mix(col, vec3(.56, .76, .98), (hp * .1 + wall * .1) * a); }
  } else {
    col = vec3(.984, .992, 1.);
    col = mix(col, vec3(.886, .925, 1.), .5 * smoothstep(.85, 0., length(uv - vec2(.15 + .05 * sin(t * .07), .1))));
    col = mix(col, vec3(.56, .76, .98), hv * .11 * a);
    col = mix(col, vec3(.2, .25, .37), max(wall * .05, ext * .09) * a);
    if (hover){ col = mix(col, vec3(.89, .93, 1.), .3 * a); col = mix(col, vec3(.15, .39, .96), (hp * .14 + wall * .2) * a); }
  }
  o = vec4(col, 1.);
}`;
