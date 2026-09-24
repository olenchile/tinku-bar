"use client";

/**
 * FoodIcon — WebGL2 procedural icons usando SDF (Signed Distance Functions).
 * Cada tipo de categoría genera su propio shader que dibuja una silueta
 * reconocible sin usar emojis ni imágenes externas.
 */

import { useEffect, useRef } from "react";

/* ─── Tipos de ícono disponibles ─────────────────────────────── */
export type FoodIconType =
  | "breakfast"   // plato con huevo
  | "plate"       // plato con carne
  | "sharing"     // bowl compartir
  | "board"       // tabla de madera
  | "pasta"       // espiral pasta
  | "sandwich"    // sandwich perfil
  | "sandwich_fries" // sandwich + papas
  | "tea"         // taza de té
  | "dessert"     // copa helado
  | "digestif"    // copa bajativo
  | "juice"       // vaso jugo
  | "coffee"      // taza café
  | "cocktail"    // copa cóctel
  | "promo"       // 2 copas
  | "wine"        // botella vino
  | "colacion";   // plato pequeño

/* ─── Shaders GLSL ES 3.00 ───────────────────────────────────── */

const VERT = /* glsl */ `#version 300 es
precision mediump float;
in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// SDF helpers embebidos en cada frag
const SDF_HELPERS = /* glsl */ `
float sdCircle(vec2 p, float r){ return length(p)-r; }
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.0))+min(max(d.x,d.y),0.0); }
float sdRoundBox(vec2 p, vec2 b, float r){ vec2 d=abs(p)-b+r; return length(max(d,0.0))+min(max(d.x,d.y),0.0)-r; }
float sdCapsule(vec2 p, vec2 a, vec2 b, float r){ vec2 pa=p-a,ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
float sdTriangle(vec2 p, vec2 a, vec2 b, vec2 c){ vec2 e0=b-a,e1=c-b,e2=a-c,v0=p-a,v1=p-b,v2=p-c; vec2 pq0=v0-e0*clamp(dot(v0,e0)/dot(e0,e0),0.,1.),pq1=v1-e1*clamp(dot(v1,e1)/dot(e1,e1),0.,1.),pq2=v2-e2*clamp(dot(v2,e2)/dot(e2,e2),0.,1.); float s=sign(e0.x*e2.y-e0.y*e2.x); vec2 d2=min(min(vec2(dot(pq0,pq0),s*(v0.x*e0.y-v0.y*e0.x)),vec2(dot(pq1,pq1),s*(v1.x*e1.y-v1.y*e1.x))),vec2(dot(pq2,pq2),s*(v2.x*e2.y-v2.y*e2.x))); return -sqrt(d2.x)*sign(d2.y); }
vec4 blend(vec4 a, vec4 b){ return mix(a,b,b.a); }
vec4 fill(float d, vec3 col, float aa){ float a=1.0-smoothstep(-aa,aa,d); return vec4(col,a); }
`;

/* ─── Frags por tipo ─────────────────────────────────────────── */

const FRAGS: Record<FoodIconType, string> = {

  breakfast: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // plato
  float plate=sdCircle(p,0.78); float rim=sdCircle(p,0.65);
  float plateFill=max(-rim,plate);
  // yema
  float yolk=sdCircle(p-vec2(0.0,0.08),0.22);
  // clara
  float white=sdCircle(p-vec2(0.0,0.06),0.40);
  vec4 col=vec4(0.94,0.91,0.83,0.0);
  col=blend(col,fill(plate, vec3(0.82,0.72,0.58),aa));
  col=blend(col,fill(plateFill,vec3(0.95,0.92,0.87),aa));
  col=blend(col,fill(white, vec3(0.97,0.97,0.95),aa));
  col=blend(col,fill(yolk,  vec3(0.96,0.72,0.18),aa));
  fragColor=col;
}`,

  plate: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float outer=sdCircle(p,0.78);
  float inner=sdCircle(p,0.60);
  float rim=max(-inner,outer);
  float food=sdRoundBox(p-vec2(0.0,-0.05),vec2(0.38,0.20),0.10);
  float sauce=sdCircle(p-vec2(0.12,0.12),0.14);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(outer,vec3(0.84,0.74,0.60),aa));
  col=blend(col,fill(rim,  vec3(0.92,0.87,0.80),aa));
  col=blend(col,fill(inner,vec3(0.97,0.95,0.90),aa));
  col=blend(col,fill(food, vec3(0.70,0.34,0.18),aa));
  col=blend(col,fill(sauce,vec3(0.75,0.20,0.12),aa));
  fragColor=col;
}`,

  sharing: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // bowl
  vec2 bp=p-vec2(0.0,0.06);
  float bowl=sdRoundBox(bp,vec2(0.55,0.38),0.35);
  float base=sdBox(p-vec2(0.0,0.42),vec2(0.25,0.06));
  float item1=sdCircle(p-vec2(-0.18,-0.08),0.16);
  float item2=sdCircle(p-vec2(0.18,-0.06),0.14);
  float item3=sdCircle(p-vec2(0.0,-0.14),0.13);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(bowl, vec3(0.89,0.80,0.65),aa));
  col=blend(col,fill(base, vec3(0.82,0.70,0.52),aa));
  col=blend(col,fill(item1,vec3(0.92,0.72,0.42),aa));
  col=blend(col,fill(item2,vec3(0.72,0.52,0.28),aa));
  col=blend(col,fill(item3,vec3(0.85,0.65,0.35),aa));
  fragColor=col;
}`,

  board: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float board=sdRoundBox(p,vec2(0.62,0.44),0.14);
  float handle=sdCapsule(p,vec2(0.58,0.0),vec2(0.80,0.0),0.10);
  float grain1=sdBox(p-vec2(-0.2,0.0),vec2(0.02,0.35));
  float grain2=sdBox(p-vec2(0.05,0.0),vec2(0.02,0.35));
  float grain3=sdBox(p-vec2(0.30,0.0),vec2(0.02,0.35));
  float food=sdCircle(p-vec2(-0.25,0.05),0.18);
  float cheese=sdRoundBox(p-vec2(0.15,0.08),vec2(0.15,0.10),0.05);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(board, vec3(0.78,0.58,0.32),aa));
  col=blend(col,fill(handle,vec3(0.72,0.50,0.26),aa));
  col=blend(col,fill(grain1,vec3(0.68,0.46,0.22),aa*0.5));
  col=blend(col,fill(grain2,vec3(0.68,0.46,0.22),aa*0.5));
  col=blend(col,fill(grain3,vec3(0.68,0.46,0.22),aa*0.5));
  col=blend(col,fill(food,  vec3(0.84,0.30,0.20),aa));
  col=blend(col,fill(cheese,vec3(0.96,0.82,0.30),aa));
  fragColor=col;
}`,

  pasta: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float plate=sdCircle(p,0.75);
  float inner=sdCircle(p,0.60);
  float rim=max(-inner,plate);
  // noodles: arcs de círculos
  float n=8.0;
  float pasta=1e9;
  for(float i=0.;i<n;i++){
    float a=i/n*3.14159*2.0+0.3;
    float r=0.28+0.08*sin(i*1.3);
    vec2 c=vec2(cos(a),sin(a))*0.18;
    float arc=abs(sdCircle(p-c,r))-0.055;
    pasta=min(pasta,arc);
  }
  float sauce=sdCircle(p,0.25);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(plate,  vec3(0.84,0.74,0.60),aa));
  col=blend(col,fill(rim,    vec3(0.92,0.87,0.80),aa));
  col=blend(col,fill(inner,  vec3(0.97,0.95,0.90),aa));
  col=blend(col,fill(pasta,  vec3(0.92,0.78,0.42),aa));
  col=blend(col,fill(sauce,  vec3(0.82,0.28,0.16),aa));
  fragColor=col;
}`,

  sandwich: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // pan superior (redondeado arriba)
  vec2 tp=p-vec2(0.0,0.22);
  float topBun=sdRoundBox(tp,vec2(0.52,0.22),0.22);
  // pan inferior
  float botBun=sdRoundBox(p-vec2(0.0,-0.28),vec2(0.52,0.14),0.08);
  // rellenos
  float meat=sdBox(p-vec2(0.0,-0.02),vec2(0.48,0.09));
  float lettuce=sdBox(p-vec2(0.0,0.08),vec2(0.50,0.055));
  float tomato=sdBox(p-vec2(0.0,-0.10),vec2(0.44,0.045));
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(topBun, vec3(0.92,0.72,0.36),aa));
  col=blend(col,fill(botBun, vec3(0.88,0.68,0.30),aa));
  col=blend(col,fill(lettuce,vec3(0.45,0.72,0.28),aa));
  col=blend(col,fill(tomato, vec3(0.88,0.28,0.20),aa));
  col=blend(col,fill(meat,   vec3(0.72,0.34,0.20),aa));
  fragColor=col;
}`,

  sandwich_fries: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // mini sandwich izq
  vec2 sp=p-vec2(-0.28,0.0);
  float topBun=sdRoundBox(sp-vec2(0.0,0.20),vec2(0.32,0.16),0.16);
  float botBun=sdRoundBox(sp-vec2(0.0,-0.22),vec2(0.32,0.10),0.06);
  float meat=sdBox(sp,vec2(0.30,0.14));
  // papas fritas der
  vec2 fp=p-vec2(0.30,0.0);
  float box=sdRoundBox(fp-vec2(0.0,-0.20),vec2(0.22,0.18),0.06);
  float f1=sdCapsule(fp,vec2(-0.10,0.20),vec2(-0.10,-0.12),0.055);
  float f2=sdCapsule(fp,vec2(0.0, 0.26),vec2(0.0, -0.12),0.055);
  float f3=sdCapsule(fp,vec2(0.10,0.22),vec2(0.10,-0.12),0.055);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(topBun,vec3(0.92,0.72,0.36),aa));
  col=blend(col,fill(botBun,vec3(0.88,0.68,0.30),aa));
  col=blend(col,fill(meat,  vec3(0.72,0.34,0.20),aa));
  col=blend(col,fill(box,   vec3(0.88,0.26,0.22),aa));
  col=blend(col,fill(f1,    vec3(0.95,0.78,0.30),aa));
  col=blend(col,fill(f2,    vec3(0.95,0.78,0.30),aa));
  col=blend(col,fill(f3,    vec3(0.95,0.78,0.30),aa));
  fragColor=col;
}`,

  tea: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float cup=sdRoundBox(p-vec2(0.0,0.05),vec2(0.38,0.38),0.10);
  float handle=sdCapsule(p,vec2(0.38,-0.05),vec2(0.38,0.30),0.10);
  float handleInner=sdCapsule(p,vec2(0.38,-0.02),vec2(0.38,0.26),0.06);
  float saucer=sdRoundBox(p-vec2(0.0,0.44),vec2(0.52,0.08),0.08);
  float liquid=sdBox(p-vec2(0.0,0.16),vec2(0.36,0.18));
  float steam1=sdCapsule(p,vec2(-0.10,-0.38),vec2(-0.14,-0.62),0.04);
  float steam2=sdCapsule(p,vec2(0.10,-0.38),vec2(0.14,-0.62),0.04);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(saucer,  vec3(0.88,0.82,0.70),aa));
  col=blend(col,fill(cup,     vec3(0.94,0.90,0.82),aa));
  col=blend(col,fill(max(-handleInner,handle), vec3(0.94,0.90,0.82),aa));
  col=blend(col,fill(liquid,  vec3(0.62,0.38,0.18),aa));
  col=blend(col,fill(steam1,  vec3(0.80,0.80,0.80),aa*2.0));
  col=blend(col,fill(steam2,  vec3(0.80,0.80,0.80),aa*2.0));
  fragColor=col;
}`,

  dessert: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // copa
  float base=sdCapsule(p,vec2(0.0,0.45),vec2(0.0,0.20),0.06);
  float foot=sdRoundBox(p-vec2(0.0,0.50),vec2(0.20,0.06),0.04);
  vec2 gp=p-vec2(0.0,-0.06);
  float glass=sdRoundBox(gp,vec2(0.42,0.36),0.18);
  float filling=sdBox(p-vec2(0.0,0.06),vec2(0.40,0.20));
  float scoop=sdCircle(p-vec2(0.0,-0.20),0.30);
  float cherry=sdCircle(p-vec2(0.0,-0.50),0.08);
  float stem=sdCapsule(p,vec2(0.0,-0.42),vec2(0.08,-0.58),0.025);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(glass,   vec3(0.90,0.86,0.78),aa));
  col=blend(col,fill(base,    vec3(0.84,0.76,0.62),aa));
  col=blend(col,fill(foot,    vec3(0.84,0.76,0.62),aa));
  col=blend(col,fill(filling, vec3(0.96,0.84,0.64),aa));
  col=blend(col,fill(scoop,   vec3(0.98,0.90,0.78),aa));
  col=blend(col,fill(stem,    vec3(0.50,0.28,0.14),aa));
  col=blend(col,fill(cherry,  vec3(0.86,0.18,0.22),aa));
  fragColor=col;
}`,

  digestif: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float base=sdCapsule(p,vec2(0.0,0.50),vec2(0.0,0.20),0.06);
  float foot=sdRoundBox(p-vec2(0.0,0.55),vec2(0.18,0.06),0.04);
  // copa estrecha tulipa
  float cup=sdRoundBox(p-vec2(0.0,-0.08),vec2(0.28,0.44),0.16);
  float liquid=sdBox(p-vec2(0.0,0.12),vec2(0.26,0.22));
  // hojas verdes
  float leaf=sdCircle(p-vec2(0.0,-0.52),0.12);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(cup,    vec3(0.90,0.87,0.80),aa));
  col=blend(col,fill(base,   vec3(0.82,0.75,0.60),aa));
  col=blend(col,fill(foot,   vec3(0.82,0.75,0.60),aa));
  col=blend(col,fill(liquid, vec3(0.48,0.70,0.36),aa));
  col=blend(col,fill(leaf,   vec3(0.34,0.60,0.24),aa));
  fragColor=col;
}`,

  juice: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float glass=sdRoundBox(p-vec2(0.0,0.0),vec2(0.36,0.54),0.12);
  float liquid=sdBox(p-vec2(0.0,0.14),vec2(0.34,0.36));
  float straw=sdCapsule(p,vec2(0.18,0.55),vec2(0.32,-0.30),0.045);
  float slice=sdCircle(p-vec2(-0.20,0.48),0.18);
  float sliceInner=sdCircle(p-vec2(-0.20,0.48),0.12);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(glass,      vec3(0.90,0.87,0.80),aa));
  col=blend(col,fill(liquid,     vec3(0.98,0.72,0.22),aa));
  col=blend(col,fill(straw,      vec3(0.88,0.30,0.28),aa));
  col=blend(col,fill(slice,      vec3(0.98,0.80,0.28),aa));
  col=blend(col,fill(sliceInner, vec3(0.98,0.66,0.18),aa));
  fragColor=col;
}`,

  coffee: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float saucer=sdRoundBox(p-vec2(0.0,0.44),vec2(0.55,0.09),0.09);
  float cup=sdRoundBox(p-vec2(0.0,0.10),vec2(0.42,0.36),0.12);
  float handle=sdCapsule(p,vec2(0.42,0.04),vec2(0.42,0.32),0.10);
  float handleIn=sdCapsule(p,vec2(0.42,0.07),vec2(0.42,0.29),0.06);
  float liquid=sdBox(p-vec2(0.0,0.22),vec2(0.38,0.20));
  float foam=sdCircle(p-vec2(0.0,0.05),0.34);
  float foamInner=sdCircle(p-vec2(0.0,0.05),0.26);
  float steam=sdCapsule(p,vec2(0.0,-0.36),vec2(0.0,-0.60),0.035);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(saucer,   vec3(0.90,0.84,0.72),aa));
  col=blend(col,fill(cup,      vec3(0.94,0.90,0.82),aa));
  col=blend(col,fill(max(-handleIn,handle),vec3(0.94,0.90,0.82),aa));
  col=blend(col,fill(liquid,   vec3(0.36,0.22,0.12),aa));
  col=blend(col,fill(foam,     vec3(0.96,0.90,0.78),aa));
  col=blend(col,fill(foamInner,vec3(0.36,0.22,0.12),aa));
  col=blend(col,fill(steam,    vec3(0.80,0.80,0.80),aa*2.0));
  fragColor=col;
}`,

  cocktail: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  float base=sdCapsule(p,vec2(0.0,0.56),vec2(0.0,0.16),0.05);
  float foot=sdRoundBox(p-vec2(0.0,0.60),vec2(0.20,0.06),0.04);
  // copa martini invertida
  float triangle=sdTriangle(p,vec2(-0.54,-0.10),vec2(0.54,-0.10),vec2(0.0,0.18));
  float liquid=sdTriangle(p-vec2(0.0,0.04),vec2(-0.44,-0.10),vec2(0.44,-0.10),vec2(0.0,0.10));
  float olive=sdCircle(p-vec2(0.0,-0.28),0.10);
  float pick=sdCapsule(p,vec2(-0.24,-0.28),vec2(0.24,-0.28),0.025);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(triangle,vec3(0.90,0.87,0.80),aa));
  col=blend(col,fill(base,    vec3(0.82,0.76,0.62),aa));
  col=blend(col,fill(foot,    vec3(0.82,0.76,0.62),aa));
  col=blend(col,fill(liquid,  vec3(0.96,0.82,0.36),aa));
  col=blend(col,fill(pick,    vec3(0.70,0.50,0.28),aa));
  col=blend(col,fill(olive,   vec3(0.40,0.62,0.26),aa));
  fragColor=col;
}`,

  promo: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // 2 vasos shot
  float g1=sdRoundBox(p-vec2(-0.24,0.0),vec2(0.18,0.40),0.06);
  float g2=sdRoundBox(p-vec2(0.24,0.0), vec2(0.18,0.40),0.06);
  float l1=sdBox(p-vec2(-0.24,0.10),vec2(0.16,0.26));
  float l2=sdBox(p-vec2(0.24, 0.10),vec2(0.16,0.26));
  float spark=sdCircle(p,0.10);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(g1,    vec3(0.92,0.88,0.80),aa));
  col=blend(col,fill(g2,    vec3(0.92,0.88,0.80),aa));
  col=blend(col,fill(l1,    vec3(0.88,0.60,0.18),aa));
  col=blend(col,fill(l2,    vec3(0.88,0.60,0.18),aa));
  col=blend(col,fill(spark, vec3(0.96,0.82,0.22),aa));
  fragColor=col;
}`,

  wine: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // botella
  float body=sdRoundBox(p-vec2(0.0,0.08),vec2(0.26,0.44),0.16);
  float neck=sdRoundBox(p-vec2(0.0,-0.52),vec2(0.10,0.14),0.06);
  float cap=sdRoundBox(p-vec2(0.0,-0.66),vec2(0.12,0.06),0.04);
  float label=sdRoundBox(p-vec2(0.0,0.10),vec2(0.22,0.26),0.06);
  // copa a la derecha
  float stem2=sdCapsule(p,vec2(0.52,0.56),vec2(0.52,0.20),0.04);
  float foot2=sdRoundBox(p-vec2(0.52,0.60),vec2(0.14,0.05),0.03);
  float cup2=sdRoundBox(p-vec2(0.52,-0.04),vec2(0.20,0.28),0.12);
  float liq2=sdBox(p-vec2(0.52,0.08),vec2(0.18,0.14));
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(body,  vec3(0.28,0.16,0.38),aa));
  col=blend(col,fill(neck,  vec3(0.28,0.16,0.38),aa));
  col=blend(col,fill(cap,   vec3(0.70,0.16,0.18),aa));
  col=blend(col,fill(label, vec3(0.95,0.90,0.78),aa));
  col=blend(col,fill(cup2,  vec3(0.88,0.84,0.76),aa));
  col=blend(col,fill(liq2,  vec3(0.70,0.16,0.24),aa));
  col=blend(col,fill(stem2, vec3(0.82,0.76,0.62),aa));
  col=blend(col,fill(foot2, vec3(0.82,0.76,0.62),aa));
  fragColor=col;
}`,

  colacion: /* glsl */ `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 fragColor;
${SDF_HELPERS}
void main(){
  vec2 p=(v_uv-0.5)*2.0;
  float aa=0.04;
  // plato pequeño
  float plate=sdCircle(p-vec2(-0.22,0.0),0.50);
  float plateInner=sdCircle(p-vec2(-0.22,0.0),0.38);
  float rim=max(-plateInner,plate);
  float food=sdRoundBox(p-vec2(-0.22,-0.05),vec2(0.25,0.14),0.08);
  // taza lateral
  float cup=sdRoundBox(p-vec2(0.42,0.04),vec2(0.20,0.28),0.08);
  float liq=sdBox(p-vec2(0.42,0.12),vec2(0.18,0.14));
  float handle=sdCapsule(p,vec2(0.62,0.02),vec2(0.62,0.22),0.07);
  float handleIn=sdCapsule(p,vec2(0.62,0.05),vec2(0.62,0.19),0.045);
  vec4 col=vec4(0.0,0.0,0.0,0.0);
  col=blend(col,fill(plate, vec3(0.86,0.78,0.64),aa));
  col=blend(col,fill(rim,   vec3(0.92,0.88,0.80),aa));
  col=blend(col,fill(plateInner,vec3(0.97,0.94,0.88),aa));
  col=blend(col,fill(food,  vec3(0.92,0.72,0.36),aa));
  col=blend(col,fill(cup,   vec3(0.94,0.90,0.82),aa));
  col=blend(col,fill(liq,   vec3(0.38,0.24,0.14),aa));
  col=blend(col,fill(max(-handleIn,handle),vec3(0.94,0.90,0.82),aa));
  fragColor=col;
}`,
};

/* ─── Componente React ───────────────────────────────────────── */
interface FoodIconProps {
  type: FoodIconType;
  size?: number;
  className?: string;
}

export function FoodIcon({ type, size = 64, className = "" }: FoodIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false,
      antialias: true,
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* Compile helpers */
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER,   VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGS[type] ?? FRAGS.plate);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    /* Full-screen quad */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1, 1,1,
    ]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    /* cleanup */
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  }, [type, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
