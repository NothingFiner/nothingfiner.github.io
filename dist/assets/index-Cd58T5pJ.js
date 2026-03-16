const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DarkForestGame-BrmwBBkT.js","./vendor-ll3K_fSx.js","./web-llm-DbdMpRpz.js","./DarkForestGame-a-B1h0LB.css"])))=>i.map(i=>d[i]);
import{l as U,R as J,d as g,y as E,q as M,x as X,u as Z,L as ee,A as f,a as S,b as te,P as z,z as ne,M as ie,T as A,c as ae,e as x,k as oe,J as re}from"./vendor-ll3K_fSx.js";import{C as se}from"./web-llm-DbdMpRpz.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();var le=0;function e(t,n,r,a,i,o){n||(n={});var l,s,h=n;if("ref"in h)for(s in h={},n)s=="ref"?l=n[s]:h[s]=n[s];var d={type:t,props:h,key:r,ref:l,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--le,__i:-1,__u:0,__source:i,__self:o};if(typeof t=="function"&&(l=t.defaultProps))for(s in l)h[s]===void 0&&(h[s]=l[s]);return U.vnode&&U.vnode(d),d}const F="portfolio-theme",W=J({theme:"light",setTheme:()=>{},toggleTheme:()=>{}});function ce(){const t=X(W);if(!t)throw new Error("useTheme must be used within ThemeProvider");return t}function de({children:t}){const[n,r]=g(()=>typeof window>"u"?"dark":window.localStorage.getItem(F)||"dark");E(()=>{document.documentElement.classList.toggle("dark",n==="dark"),window.localStorage.setItem(F,n)},[n]);const a=M(o=>{r(l=>typeof o=="function"?o(l):o)},[]),i=M(()=>{r(o=>o==="light"?"dark":"light")},[]);return e(W.Provider,{value:{theme:n,setTheme:a,toggleTheme:i},children:t})}const T={v:[]},O=()=>T.v.forEach(t=>t()),he=t=>(T.v.push(t)===1&&addEventListener("hashchange",O),()=>{T.v=T.v.filter(n=>n!==t),T.v.length||removeEventListener("hashchange",O)}),ue=()=>"/"+location.hash.replace(/^#?\/?/,""),me=(t,{state:n=null,replace:r=!1}={})=>{const a=location.href,[i,o]=t.replace(/^#?\/?/,"").split("?"),l=new URL(location.href);l.hash=`/${i}`,o&&(l.search=o);const s=l.href;r?history.replaceState(n,"",s):history.pushState(n,"",s);const h=typeof HashChangeEvent<"u"?new HashChangeEvent("hashchange",{oldURL:a,newURL:s}):new Event("hashchange",{detail:{oldURL:a,newURL:s}});dispatchEvent(h)},G=({ssrPath:t="/"}={})=>[Z(he,ue,()=>t),me];G.hrefs=t=>"#"+t;function pe({isOpen:t,onClose:n,onNavigate:r}){const a=[{path:"/",label:"Home"},{path:"/projects",label:"Projects"},{path:"/chat",label:"Chat"},{path:"/blog",label:"Blog"},{path:"/games/dark-forest",label:"Game - Dark Forest"},{path:"/resume",label:"Resume"},{path:"/about",label:"About Me"}],i=o=>{r()};return e("div",{class:`fixed left-0 top-0 h-full md:w-1/4 w-full glass transition-transform duration-300 z-[60] ${t?"translate-x-0":"-translate-x-full"}`,children:e("div",{class:"p-4 md:p-8 h-full flex flex-col",children:[e("button",{onClick:n,class:"self-end mb-8 p-2 rounded-xl glass glass-hover transition-colors menu-drawer-close-btn","aria-label":"Close menu",children:e("svg",{class:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 18L18 6M6 6l12 12"})})}),e("nav",{class:"flex-1",children:e("ul",{class:"space-y-4",children:a.map(o=>e("li",{children:e(ee,{href:o.path,onClick:i,class:"block px-4 py-3 rounded-xl glass glass-hover transition-all duration-200 text-theme font-heading font-bold",children:o.label})},o.path))})})]})})}function fe(){const{theme:t,toggleTheme:n}=ce();return e("button",{type:"button",onClick:n,class:"glass glass-hover p-2.5 rounded-xl transition-transform hover:scale-105","aria-label":t==="dark"?"Switch to light mode":"Switch to dark mode",children:t==="dark"?e("svg",{class:"w-5 h-5 text-theme",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"})}):e("svg",{class:"w-5 h-5 text-theme",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})})})}function ge(t){const n=parseInt(t.slice(1,3),16)/255,r=parseInt(t.slice(3,5),16)/255,a=parseInt(t.slice(5,7),16)/255;return{r:n,g:r,b:a}}function H(t,n,r){const a=t.createShader(n);return a?(t.shaderSource(a,r),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS)?a:(console.error("Shader compile error:",t.getShaderInfoLog(a)),t.deleteShader(a),null)):null}function be(t,n,r){const a=t.createProgram();return t.attachShader(a,n),t.attachShader(a,r),t.linkProgram(a),t.getProgramParameter(a,t.LINK_STATUS)?a:(console.error("Program link error:",t.getProgramInfoLog(a)),null)}function ve(t,n){const r=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),a=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,r,t.STATIC_DRAW);const i=t.getAttribLocation(n,"position");t.enableVertexAttribArray(i),t.vertexAttribPointer(i,2,t.FLOAT,!1,0,0)}function we(t,n){return{u_time:t.getUniformLocation(n,"u_time"),u_resolution:t.getUniformLocation(n,"u_resolution"),u_color:t.getUniformLocation(n,"u_color")}}function ye(t,n,r,a,i,o){t.uniform1f(n.u_time,r),t.uniform2f(n.u_resolution,a,i),t.uniform3f(n.u_color,o.r,o.g,o.b)}function xe(t){t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLES,0,6)}const ke=`
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Ie=`

  precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;

const int BLOB_COUNT = 6;

// Distance threshold for two blobs to be considered in the same cluster.
// In aspect-corrected UV space.
const float CLUSTER_RADIUS = 0.35;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 blobPosition(int index, float time) {
  float fIndex = float(index);
  float aspect = u_resolution.x / u_resolution.y;

  float seedX     = rand(vec2(fIndex, 0.0));
  float seedY     = rand(vec2(fIndex, 1.0));
  float seedSpeed = rand(vec2(fIndex, 2.0));
  float seedPhase = rand(vec2(fIndex, 3.0));

  float speed = 0.4 + seedSpeed * 0.6;

  float x = (0.2 + 0.6 * (0.5 + 0.5 * sin(time * speed + seedX * 6.2831 + seedPhase * 6.2831))) * aspect;
  float y =  0.2 + 0.6 * (0.5 + 0.5 * cos(time * speed * 0.7 + seedY * 6.2831 + seedPhase * 6.2831));
  return vec2(x, y);
}

float metaballField(vec2 coord, float time) {
  float field = 0.0;
  for (int i = 0; i < BLOB_COUNT; i++) {
    vec2 center = blobPosition(i, time);
    float dist = distance(coord, center);
    field += 0.012 / (dist * dist);
  }
  return field;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  st.x *= aspect;

  float time = u_time;
  float field = metaballField(st, time);
  float edge = 0.02;
  float surface = smoothstep(1.0 - edge, 1.0 + edge, field);

  if (surface <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // -------------------------------------------------------------------------
  // Pass 1: compute a cluster-weighted centroid
  //
  // For each blob i, we find its "cluster center" by averaging the positions
  // of all blobs j that are within CLUSTER_RADIUS of blob i, weighted by
  // how much each blob j contributes to the current pixel.
  //
  // Then we average all those per-blob cluster centers, weighted again by
  // each blob i's contribution to the current pixel.
  // This means blobs that barely reach this pixel have little influence on
  // where the highlight lands.
  // -------------------------------------------------------------------------

  // Precompute each blob's position and its contribution to this pixel
  vec2  centers[6];
  float contributions[6];
  float totalContribution = 0.0;

  for (int i = 0; i < BLOB_COUNT; i++) {
    centers[i] = blobPosition(i, time);
    float dist = distance(st, centers[i]);
    // Same falloff as the field — blobs close to this pixel contribute more
    contributions[i] = 0.012 / (dist * dist);
    totalContribution += contributions[i];
  }

  // For each blob, find its cluster centroid
  vec2 pixelClusterCenter = vec2(0.0);
  float clusterWeight = 0.0;

  for (int i = 0; i < BLOB_COUNT; i++) {
    // Find the weighted center of blob i's cluster
    vec2  clusterCentroid = vec2(0.0);
    float clusterMass     = 0.0;

    for (int j = 0; j < BLOB_COUNT; j++) {
      float separation = distance(centers[i], centers[j]);

      // Replace the hard if-check with a smooth weight that fades to zero
      // at CLUSTER_RADIUS. Blobs far away contribute almost nothing,
      // blobs close together contribute fully — no snapping.
      float clusterInfluence = 1.0 - smoothstep(0.0, CLUSTER_RADIUS, separation);

      clusterCentroid += centers[j] * contributions[j] * clusterInfluence;
      clusterMass     += contributions[j] * clusterInfluence;
    }

    clusterCentroid /= clusterMass;

    // Accumulate this blob's cluster centroid into the pixel's final centroid,
    // weighted by how much blob i itself contributes to this pixel
    pixelClusterCenter += clusterCentroid * contributions[i];
    clusterWeight      += contributions[i];
  }

  pixelClusterCenter /= clusterWeight;

  // -------------------------------------------------------------------------
  // Pass 2: shade based on distance from the cluster center
  //
  // Close to center  → bright highlight (glow fades outward)
  // Far from center  → slightly darker than base (subsurface shadow)
  // -------------------------------------------------------------------------

  float distFromCenter = distance(st, pixelClusterCenter);

  // Normalize distance — 0.0 at center, 1.0 at a "full blob radius" away.
  // 0.18 is the approximate radius in aspect-corrected UV space — tune this
  // if the highlight feels too wide or too tight.
  float normalizedDist = clamp(distFromCenter / 0.18, 0.0, 1.0);

  // Highlight: strong at center, fades with a smooth curve outward
  // smoothstep gives a more organic falloff than linear
  float highlight = 1.0 - smoothstep(0.0, 1.0, normalizedDist);
  highlight = pow(highlight, 1.8); // shape the falloff curve — higher = tighter

  // Shadow: slight darkening at the far edges
  // Only kicks in past the midpoint of the blob
  float shadow = smoothstep(0.4, 1.0, normalizedDist) * 0.25;

  vec3 baseColor      = u_color;
  vec3 highlightColor = mix(baseColor, vec3(1.0), 0.55); // brightened toward white
   vec3 shadowColor    = baseColor * 0.65;                 // darkened version of base

  // Blend: highlight in center, base in middle, shadow at edges
  vec3 finalColor = mix(baseColor, highlightColor, highlight);
  finalColor      = mix(finalColor, shadowColor, shadow);

  gl_FragColor = vec4(finalColor, surface);
}
`,Ce=`
    @keyframes lava-drift-1 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33%       { transform: translate(15%, -20%) scale(1.1); }
      66%       { transform: translate(-10%, 15%) scale(0.95); }
    }
    @keyframes lava-drift-2 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      33%       { transform: translate(-20%, 10%) scale(0.9); }
      66%       { transform: translate(10%, -15%) scale(1.15); }
    }
    @keyframes lava-drift-3 {
      0%, 100% { transform: translate(0%, 0%) scale(1); }
      50%       { transform: translate(20%, 20%) scale(1.05); }
    }
    .lava-fallback-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.5;
  }
`;function Se({color:t}){return E(()=>{if(document.getElementById("lava-fallback-styles"))return;const n=document.createElement("style");n.id="lava-fallback-styles",n.textContent=Ce,document.head.appendChild(n)},[]),e("div",{style:{position:"fixed",inset:0,zIndex:-10,overflow:"hidden",background:"#FDFFFC"},children:[e("div",{class:"lava-fallback-blob",style:{width:"60vw",height:"60vw",background:t,top:"10%",left:"20%",animation:"lava-drift-1 14s ease-in-out infinite"}}),e("div",{class:"lava-fallback-blob",style:{width:"50vw",height:"50vw",background:t,top:"40%",left:"50%",animation:"lava-drift-2 18s ease-in-out infinite"}}),e("div",{class:"lava-fallback-blob",style:{width:"40vw",height:"40vw",background:t,top:"60%",left:"10%",animation:"lava-drift-3 12s ease-in-out infinite"}})]})}function Le({color:t="#637561",split:n=!1}){const r=f(null);f(null),f(null);const a=f(0),i=f(null),o=f(null),l=f(null);f(null);const s=f(!0);return E(()=>{const h=r.current;if(!h)return;const d=document.createElement("canvas");d.width=h.clientWidth,d.height=h.clientHeight,h.appendChild(d);const c=d.getContext("webgl",{alpha:!0,premultipliedAlpha:!1});if(!c){s.current=!1,h.removeChild(d);return}l.current=c,c.enable(c.BLEND),c.blendFunc(c.SRC_ALPHA,c.ONE_MINUS_SRC_ALPHA);const m=H(c,c.VERTEX_SHADER,ke),b=H(c,c.FRAGMENT_SHADER,Ie);if(!m||!b)return;const u=be(c,m,b);if(!u)return;c.useProgram(u),ve(c,u);const p=we(c,u);i.current=p,o.current=performance.now();function v(){a.current=requestAnimationFrame(v);const j=(performance.now()-o.current)/1e3*.18,B=ge(t);c.viewport(0,0,d.width,d.height),ye(c,p,j,d.width,d.height,B),xe(c)}v();function L(){d.width=h.clientWidth,d.height=h.clientHeight,c.viewport(0,0,d.width,d.height)}return window.addEventListener("resize",L),()=>{window.removeEventListener("resize",L),cancelAnimationFrame(a.current),h&&d&&h.contains(d)&&h.removeChild(d)}},[t]),s.current?e("div",{ref:r,style:{position:"fixed",inset:0,zIndex:-10,overflow:"hidden"},"aria-hidden":"true"}):e(Se,{color:t})}function q(){const[,t]=S();return e("div",{children:[e("div",{class:"mb-4 md:mb-12",children:[e("h1",{class:"text-3xl md:text-6xl font-heading mb-2 text-left",style:{letterSpacing:"-0.02em"},children:"Hello, I'm Elie"}),e("h2",{class:"text-xl md:text-2xl text-theme/80 text-left",children:"I'm a developer"})]}),e("button",{onClick:()=>t("/chat"),class:"px-8 py-4 rounded-xl btn-accent transition-all duration-200 font-medium text-lg hover:scale-105",children:"Learn More"})]})}const k=[{id:"1",title:"Dark Forest",image:"./assets/darkforest.png",description:"Dark Forest is a simple game, inspired by Katamari Damacy and Liu Cixin's Rememberance of Earth's past trilogy, built with paper.js and css."},{id:"2",title:"Gospodin",image:"./assets/gospodin.png",description:"Gospodin is a single player roguelike game, built with the löve2d framework. Original art and music by Me. Inspired the works of the Strugatsky brothers and Warhammer 40,000. You play as an agent of an advanced starfaring society infiltrating a primitive planet. When you discover that many of its residents are suffering from a mysterious illness, you must navigate the planet's dangerous terrain and uncover the truth about the illness have been infected by Alien parasites, you must fight your way to the creature's lair and defeat it."},{id:"3",title:"Resume Chatbot",image:"./assets/chatbot.png",description:"Using WebLLM library, I load a model directly into the brower and use a machine's VRAM to run a chatbot locally that can answer questions about my resume. I have gone through a few approaches and you can read more about my process here."}];function Ee(){const[,t]=S(),[n,r]=g(null),a=i=>{const o=k.find(l=>l.id===i);r(o||null),setTimeout(()=>{t(`/projects/${i}`),setTimeout(()=>r(null),100)},400)};return e("div",{class:"min-h-screen p-8 relative",children:[n&&e("div",{class:"fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-400",children:e("div",{class:"relative w-full h-full flex items-center justify-center",children:e("img",{src:n.image,alt:n.title,class:"max-w-4xl max-h-[80vh] object-contain rounded-2xl glass",style:{transform:"scale(1.2)"}})})}),e("div",{class:`max-w-7xl mx-auto transition-opacity duration-300 ${n?"opacity-0":"opacity-100"}`,children:e("div",{class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children:k.map(i=>e("div",{onClick:()=>a(i.id),class:`group cursor-pointer rounded-2xl overflow-hidden glass glass-hover transition-all duration-300 hover:scale-105 ${n&&n.id!==i.id?"opacity-0":"opacity-100"}`,children:[e("div",{class:"relative overflow-hidden",children:[e("img",{src:i.image,alt:i.title,class:"w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"}),e("div",{class:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",style:{boxShadow:"inset 0 0 40px rgba(139, 149, 86, 0.3), 0 0 30px rgba(139, 149, 86, 0.2)"}})]}),e("div",{class:"p-6",children:e("h3",{class:"text-xl font-semibold text-theme",children:i.title})})]},i.id))})})]})}function Te(){const[t,n]=te("/projects/:id"),[,r]=S(),a=n==null?void 0:n.id,i=a?k.findIndex(u=>u.id===a):-1,o=k[i]||k[0],[l,s]=g(!0);E(()=>{s(!0);const u=setTimeout(()=>s(!1),600);return()=>clearTimeout(u)},[a]);const h=()=>k[(i+1)%k.length],d=()=>k[(i-1+k.length)%k.length],c=u=>r(`/projects/${u}`),m=h(),b=d();return e("div",{class:"min-h-screen bg-page relative",children:[e("button",{onClick:()=>r("/projects"),class:"fixed top-8 right-16 z-50 px-6 py-3 rounded-xl glass glass-hover transition-all duration-200 text-theme font-medium","aria-label":"Back to projects list",children:"← Back"}),e("div",{class:"container mx-auto px-4 md:px-8 py-8 md:py-16",children:e("div",{class:"flex flex-col lg:flex-row gap-8 items-start",children:[e("div",{class:"hidden lg:flex flex-col items-center justify-center w-1/5 sticky top-1/2 -translate-y-1/2 h-screen",children:e("button",{onClick:()=>c(b.id),class:"group relative w-full max-w-xs","aria-label":`View previous project: ${b.title}`,children:[e("div",{class:"absolute inset-0 flex items-center justify-center z-10",children:e("div",{class:"w-12 h-12 rounded-full glass flex items-center justify-center",children:e("svg",{class:"w-6 h-6 text-theme",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M15 19l-7-7 7-7"})})})}),e("img",{src:b.image,alt:b.title,class:"w-full rounded-2xl opacity-40 blur-sm transition-all duration-300 group-hover:opacity-60 group-hover:blur-none"})]})}),e("div",{class:"flex-1 lg:w-3/5",children:e("div",{class:`transition-all duration-500 ${l?"opacity-0 scale-95":"opacity-100 scale-100"}`,children:[e("div",{class:"rounded-2xl overflow-hidden glass mb-8",children:e("img",{src:o.image,alt:o.title,class:"w-full h-auto"})}),e("h1",{class:"text-4xl font-heading font-heading mb-6 text-theme",style:{textShadow:"3px 3px 0px var(--color-accent-green)"},children:o.title}),e("div",{class:"rounded-2xl glass p-8 max-h-[60vh] overflow-y-auto",children:e("div",{class:"prose prose-lg max-w-none text-theme font-body whitespace-pre-line",children:o.description})})]})}),e("div",{class:"hidden lg:flex flex-col items-center justify-center w-1/5 sticky top-1/2 -translate-y-1/2 h-screen",children:e("button",{onClick:()=>c(m.id),class:"group relative w-full max-w-xs","aria-label":`View next project: ${m.title}`,children:[e("div",{class:"absolute inset-0 flex items-center justify-center z-10",children:e("div",{class:"w-12 h-12 rounded-full glass flex items-center justify-center",children:e("svg",{class:"w-6 h-6 text-theme",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 5l7 7-7 7"})})})}),e("img",{src:m.image,alt:m.title,class:"w-full rounded-2xl opacity-40 blur-sm transition-all duration-300 group-hover:opacity-60 group-hover:blur-none"})]})})]})})]})}function je(){return e("div",{class:"min-h-screen p-8",children:e("div",{class:"max-w-4xl mx-auto",children:e("div",{class:"rounded-2xl glass p-8",children:e("div",{class:"prose prose-lg max-w-none text-theme font-body",children:[e("p",{class:"mb-4",children:"I'm Elie. I've been coding since I was a kid. The first thing I ever coded was an attempt at an asteroid clone on a casio graphing calculator. I never could get it past enemy rendering: it got too slow. I'm sure I had a fundimental misunderstanding of how to institute a game loop."}),e("p",{class:"mb-4",children:"I've been coding professionally since 2013. First as a contractor. I went to appacademy in 2017 and spent more than 8 years working at a consulting agency. I built everything from webstores to custom web apps. I'm looking for my next challenge in the product space."})]})})})})}function Pe(){return e("div",{class:"min-h-screen p-8",children:e("div",{class:"max-w-4xl mx-auto",children:e("div",{class:"rounded-2xl glass p-8 overflow-hidden",children:e("iframe",{src:"/assets/resume.pdf",class:"w-full h-[80vh] rounded-lg border border-[var(--glass-border)]",style:{boxShadow:"inset 0 2px 8px rgba(0, 0, 0, 0.1)"},children:e("p",{class:"text-theme",children:["Your browser does not support PDFs.",e("a",{href:"/assets/resume.pdf",target:"_blank",class:"text-accent-green underline",children:"Download the PDF instead"}),"."]})})})})})}const Re="modulepreload",_e=function(t,n){return new URL(t,n).href},N={},Ae=function(n,r,a){let i=Promise.resolve();if(r&&r.length>0){const l=document.getElementsByTagName("link"),s=document.querySelector("meta[property=csp-nonce]"),h=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));i=Promise.allSettled(r.map(d=>{if(d=_e(d,a),d in N)return;N[d]=!0;const c=d.endsWith(".css"),m=c?'[rel="stylesheet"]':"";if(!!a)for(let p=l.length-1;p>=0;p--){const v=l[p];if(v.href===d&&(!c||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const u=document.createElement("link");if(u.rel=c?"stylesheet":Re,c||(u.as="script"),u.crossOrigin="",u.href=d,h&&u.setAttribute("nonce",h),document.head.appendChild(u),c)return new Promise((p,v)=>{u.addEventListener("load",p),u.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(l){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=l,window.dispatchEvent(s),!s.defaultPrevented)throw l}return i.then(l=>{for(const s of l||[])s.status==="rejected"&&o(s.reason);return n().catch(o)})},Me=ne(()=>Ae(()=>import("./DarkForestGame-BrmwBBkT.js"),__vite__mapDeps([0,1,2,3]),import.meta.url));function Be(){return e(z,{fallback:e("div",{class:"min-h-screen flex items-center justify-center text-theme",children:"Loading game..."}),children:e(Me,{})})}var C=(t=>(t.Assistant="assistant",t.User="user",t))(C||{}),w=(t=>(t[t.Loading=0]="Loading",t[t.Ready=1]="Ready",t[t.Idle=2]="Idle",t[t.Error=3]="Error",t))(w||{});const De=`
WORK EXPERIENCE:
Defined and enforced code standards and adopted BEM styling methodology, improving maintainability and scalability for project with cross-functional teams, utilizing CSS methodologies and code review practices
Translated business requirements into actionable development tickets, supporting agile adoption for project team of 5+ and aligning deliverables with client needs through stakeholder collaboration and requirements analysis
Facilitated cross-team learning by leveraging limited internal SiteGenesis expertise and partnering with backend and design, accelerating onboarding and issue resolution using technical documentation synthesis and team knowledge sharing
Led end-to-end integration between third-party CMS and Salesforce Commerce Cloud, enabling marketing team independence and more robust scheduling features, for UK-based ecommerce relaunch, leveraging REST APIs and stakeholder collaboration
Authored technical guides and delivered live presentations to internal developers and client marketing team, ensuring seamless CMS adoption and self-sufficient module scheduling, applying technical writing and cross-functional training skills
Independently planned and prototyped new CMS module functionality from Figma designs and user stories, optimizing reusable content components and menus for client requirements, using Jira, diagramming, and UX-focused front-end development
Authored comprehensive documentation and coding standards guide, improving code quality and maintainability for distributed development teams across agency and client side, utilizing TypeScript best practices and clear technical communication
Collaborated with project manager and senior technical client stakeholders, securing buy-in for architectural recommendations and design documentation, supporting long-term migration planning for a medium-sized ISP with 6.5 million served locations
Advised on integration of Next.js image optimization and discussed implementation of Redis caching solutions, driving performance enhancement discussions and influencing frontend architecture decisions with practical experience in web performance optimization
Mentored designer transitioning from print to digital by providing daily feedback on responsive design best practices, reducing implementation bottlenecks during development and improving alignment of delivered artifacts, leveraging cross-functional collaboration and coaching skills
Spearheaded collaborative solutioning for undocumented Adobe Scene 7 image hosting integration, overcoming major technical challenges and ensuring project requirements were met, applying problem-solving and technical research abilities within a lean front-end team
Instituted developer sign-off process for design approval to prevent misaligned or unfeasible deliverables, minimizing project rework and supporting budget adherence, utilizing process improvement and proactive risk management skills
Designed and implemented custom reusable hook for mass price editing feature, increasing reliability for updates affecting potentially thousands of products, leveraging advanced state management and asynchronous data handling in React
Introduced and championed new 'pending' state in price list workflow, resolving critical logic gaps and reducing feature bugs during QA phase, collaborating with backend team to align API and state logic
Mentored and delegated tasks to two junior developers, resulting in smoother development process and fewer bug reports, applying leadership, mentorship, and task prioritization skills
Designed and implemented custom reusable hook for mass price editing feature, increasing reliability for updates affecting potentially thousands of products, leveraging advanced state management and asynchronous data handling in React
Introduced and championed new 'pending' state in price list workflow, resolving critical logic gaps and reducing feature bugs during QA phase, collaborating with backend team to align API and state logic
Mentored and delegated tasks to two junior developers, resulting in smoother development process and fewer bug reports, applying leadership, mentorship, and task prioritization skills
Led front-end development for e-commerce clients including Reformation, Brooks Brothers & Forever 21, delivering responsive, performant user experiences using React, Next.js, and Tailwind CSS
Engineered Next.js 14 to 15 migration POC for ISP plan selection portal, achieving 1-8 second page load improvements and identifying additional optimization opportunities for subscription flow enhancement
Architected batch price update solution handling thousands of SKUs by implementing job-based UI with in-progress state tracking, preventing duplicate submissions and enabling efficient bulk catalog operations
Championed adoption of React and Vue for new projects, modernizing front-end architecture and improving code maintainability across multiple client initiatives
Collaborated with stakeholders to refine requirements and scope MVPs through iterative feedback cycles, translating complex business needs into clean, maintainable code
Consistently exceeded team velocity by ~20% in ticket resolution, known for rapid debugging and reliable delivery across front-end features
Redesigned build process for legacy framework, enabling seamless integration with additional plugins and enhancing developer workflow for internal software package, leveraging build automation and cross-team collaboration skills
Drafted comprehensive design system proposal and created documentation, laying groundwork for future scalable UI component libraries, directly engaging with design and management stakeholders, demonstrating product vision and stakeholder management
Established proof of concept for reusable component system using Storybook, advancing internal UI consistency initiatives and expanding hands-on knowledge with modern JavaScript tooling
Centralized TypeScript interfaces, types, and enums into shared modules, reducing code duplication and inconsistencies for team of 30+ developers, by auditing and migrating data models
Eliminated use of 'any' typing and resolved all TypeScript warnings in build process, improving application reliability and maintainability across critical onboarding workflows, applying TypeScript best practices and static type analysis
Authored comprehensive TypeScript usage documentation for client development team, streamlining onboarding and encouraging consistent code standards, receiving direct positive feedback from technical stakeholders
Collaborated with backend architects to define, refine, and implement new REST API endpoints for evolving business requirements, preventing frontend-origin bugs and expediting stakeholder feature delivery for a high-volume manufacturing application, leveraging requirements analysis, cross-team communication, and rapid prototyping
Identified and resolved legacy logic errors in backend controller actions while expanding API functionality for customer-facing features, resulting in immediate ticket acceptance and elimination of multiple non-critical user-facing bugs, demonstrating full stack troubleshooting, bug fixing, and backend API integration
Mentored two offshore frontend developers on React best practices and code ownership, redistributing responsibilities to maximize team productivity and code reliability within a multiteam agile environment, applying leadership, technical coaching, and code review
Refactored event listener implementation by attaching listeners to page and swatch containers rather than individual elements, reducing redundant event bindings from thousands to a minimal number and enhancing page stability and responsiveness, leveraging advanced DOM manipulation and front-end performance tuning
Collaborated with QA testers, project managers, and developers across an 8-person team to address a high-impact client issue prior to acceptance testing, ensuring site launch readiness for a major retailer, employing cross-functional communication and agile problem solving
Enabled successful progression into acceptance testing by delivering a production-ready fix within tight deadlines, earning recognition from team members and project management, applying time management and effective stakeholder engagement
Optimized image assets by coordinating migration to efficient hosting and compressing images up to 10MB, reducing overall payload for all site visitors using front-end tooling and CMS integration expertise
Refactored build process to implement code splitting, eliminating unnecessary 300KB of plugin bundles on most pages, enhancing load performance leveraging modern JavaScript build tools and dependency management
Delivered rapid performance improvements within 3 work days, meeting client and project manager expectations and strengthening trust, using agile problem-solving and stakeholder communication

EDUCATION:
AppAcademy	New York, NY
Coding Bootcamp	2016-2017
Rollins College	Winter Park, FL
Bachelor of Arts, Cum Laude	2007-2011

EMPLOYMENT HISTORY:
Born Group - Digital Agency
Senior Frontend Developer	2017-2025

WeDidIt - Startup for Non-Profits
Junior Rails Developer	2014-2016

Vinous Media - Online Wine Magazine
Rails Contractor	2013-2014

SKILLS:
Languages: TypeScript, JavaScript, HTML5, CSS3, SCSS, Ruby, Python
Frameworks/Libraries: React, Vue, Redux, Next.js, Tailwind CSS, TanStack Query, MUI, PrimeReact, Ruby on Rails, React Native,  Zustand, Node.js, GraphQL
Tools: Git, Webpack, NPM, Yarn, Vite
Testing: TDD, BDD, Jest, Capybara, Rspec
`,ze="Qwen2.5-0.5B-Instruct-q4f16_1-MLC",Ue=`You are an assistant answering questions about Elie's background and experience.
Use the resume data below to answer accurately. Be concise and specific.

RULES:
1. Only answer based on the resume data below
2. If the answer is not explicitly in the resume, say exactly: "I don't have that information in the resume"
3. Do not invent companies, projects, dates, or roles
4. Do not combine or infer information
5. Quote directly from the resume when possible
6. Elie uses she/her pronouns

EXAMPLES:
Q: "Where did Elie work?"
A: "Elie worked on e-commerce clients including Reformation, Brooks Brothers & Forever 21"

Q: "Did Elie work at Google?"
A: "I don't have that information in the resume"

Q: "What's Elie's favorite color?"
A: "I don't have that information in the resume"

RESUME DATA:
${De}
`,Fe=()=>{const t=f(null),n=f(!1),[r,a]=g(w.Idle),[i,o]=g(0),[l,s]=g(""),h=M(async()=>{if(!(t.current||n.current)){n.current=!0,a(w.Loading);try{t.current=await se(ze,{initProgressCallback:c=>{o(Math.round((c.progress||0)*100))}}),a(w.Ready)}catch(c){throw a(w.Error),n.current=!1,c}}},[]);return{stream:M(async function*(c,m={}){var p,v;if(await h(),!t.current)return;const b=[{role:"system",content:Ue},...c],u=await t.current.chat.completions.create({messages:b,stream:!0,max_tokens:500,temperature:.3,...m});for await(const L of u)yield((v=(p=L.choices[0])==null?void 0:p.delta)==null?void 0:v.content)||""},[h]),text:l,progress:i,status:r}},Oe=ie(({conversation:t,isStreaming:n})=>{const r=i=>i===C.User?"mb-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--glass-border)] shadow-lg ml-auto max-w-[85%]":"mb-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--glass-border)] shadow-lg mr-auto max-w-[85%]",a=i=>i===C.User?"text-sm text-[var(--color-accent-green)] mb-2 font-semibold":"text-sm text-[var(--color-accent-purple)] mb-2 font-semibold";return e("div",{"aria-live":"polite","aria-busy":n,children:[t.map((i,o)=>e("div",{class:r(i.role),children:[e("div",{class:a(i.role),children:i.role===C.User?"You":"Assistant"}),e("div",{class:"text-theme whitespace-pre-wrap",children:i.content})]},o)),n&&e("div",{class:"mb-4 p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--glass-border)] shadow-lg mr-auto max-w-[85%]",role:"status",children:[e("div",{class:"text-sm text-[var(--color-accent-purple)] mb-2 font-semibold",children:"Assistant"}),e("div",{class:"flex items-center gap-2 text-theme/70",children:["Thinking",e("span",{class:"animate-pulse",children:"."}),e("span",{class:"animate-pulse",style:{animationDelay:"150ms"},children:"."}),e("span",{class:"animate-pulse",style:{animationDelay:"300ms"},children:"."})]})]})]})}),He=({status:t,progress:n})=>t===w.Loading?e("div",{class:"rounded-t-xl glass p-4 pb-6",children:[e("div",{class:"flex items-center gap-3 text-theme",children:[e("svg",{class:"animate-spin h-5 w-5",fill:"none",viewBox:"0 0 24 24",children:[e("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"}),e("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e("span",{class:"text-sm",children:["Loading model... ",n,"%"]})]}),e("div",{class:"mt-2 h-2 bg-[var(--glass-border)] rounded-full overflow-hidden",children:e("div",{class:"h-full bg-[var(--color-accent-green)] transition-all duration-300",style:{width:`${n}%`}})})]}):t===w.Ready?e("div",{class:"rounded-t-xl glass p-4 pb-6",children:e("div",{class:"flex items-center gap-2 text-[var(--color-accent-green)]",children:[e("svg",{class:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M5 13l4 4L19 7"})}),e("span",{class:"text-sm",children:"Model ready"})]})}):t===w.Error?e("div",{class:"rounded-t-xl glass p-4 pb-6 border-t border-x border-red-500/30 rounded-b-none",children:e("div",{class:"flex items-center gap-2 text-red-400",children:[e("svg",{class:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e("span",{class:"text-sm",children:"Model failed to load"})]})}):e("div",{class:"rounded-t-xl glass p-4 pb-6",children:e("div",{class:"flex items-center gap-2 text-theme/50",children:e("span",{class:"text-sm",children:"Initializing..."})})}),qe=()=>{S();const{stream:t,status:n,progress:r}=Fe(),[a,i]=g(""),[o,l]=g(!1),[s,h]=g([]),[d,c]=g(!1),[m,b]=g(!1),u=f(null),p=f(null),v=A(()=>n===w.Loading,[n]),L=A(()=>n===w.Loading,[n]);A(()=>n===w.Ready,[n]),A(()=>n===w.Error,[n]);const j=async()=>{const y=a.trim();if(!y||d)return;b(!0),c(!0),i(""),u.current&&(u.current.textContent="");const P={role:C.User,content:y};h(I=>[...I,P]),h(I=>[...I,{role:C.Assistant,content:""}]);try{const I=[...s,P].map(_=>({role:_.role,content:_.content}));let R="";for await(const _ of t(I))R+=_,h(K=>{const D=[...K];return D[D.length-1]={role:C.Assistant,content:R},D})}catch(I){console.error("Streaming failed:",I),h(R=>R.slice(0,-1))}finally{c(!1)}},B=()=>{l(!0)},Y=y=>{const P=y.target;i(P.textContent||"")},Q=y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),a.trim()&&!d&&j())};return E(()=>{p.current&&s.length>0&&requestAnimationFrame(()=>{p.current.scrollTop=p.current.scrollHeight})},[s]),e("div",{class:"w-full max-w-6xl mx-auto",children:[e("div",{class:`rounded-2xl glass overflow-hidden flex flex-col transition-all duration-500 ease-out ${m?"min-h-[400px] mb-4 max-h-[60vh] opacity-100 translate-y-0":"min-h-0 max-h-0 opacity-0 -translate-y-4"}`,children:e("div",{ref:p,class:"flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin h-full",children:s.length===0?e("div",{class:"h-full flex items-center justify-center text-theme/50",children:e("p",{class:"text-lg",children:"Start a conversation..."})}):e(Oe,{isStreaming:v,conversation:s})})}),e("div",{class:`transition-all duration-500 -mb-4 ease-out overflow-hidden ${m?"max-h-32 opacity-100 translate-y-0":"max-h-0 opacity-0 mb-0 translate-y-4"}`,children:e(He,{status:n,progress:r})}),e("form",{class:"rounded-2xl glass overflow-hidden relative",onSubmit:y=>{y.preventDefault(),j()},children:[e("div",{ref:u,contentEditable:!0,role:"textbox",class:"w-full px-6 py-4 bg-transparent text-theme placeholder-[var(--color-fg)]/50 focus:outline-none text-lg font-body before:empty:text-gray-400 before:empty:[content:attr(data-placeholder)]",onFocus:B,onInput:Y,onKeyDown:Q,"data-placeholder":"ask about Elie...."}),e("button",{type:"submit",disabled:d||L,class:"absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl glass transition-transform hover:scale-105 transition-colors text-theme disabled:opacity-50 disabled:hover:scale-100","aria-label":"Submit",children:e("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M13 7l5 5m0 0l-5 5m5-5H6"})})})]}),e("div",{class:"text-center text-xs text-theme/40 mt-3 max-w-2xl mx-auto",children:"Using the chatbot will download a quantized model onto your device to run on your GPU. The initial download will be north of half a GB."})]})};function Ne(){return e("div",{class:"min-h-screen flex flex-col items-center justify-center p-8",children:e("div",{class:"w-full max-w-3xl",children:e("main",{class:"mb-4",children:e(qe,{})})})})}const $=[{id:"1",date:"2024-03-16",title:"Running a Local LLM in the Browser with WebGL",content:`
      <p>When I was messing around with WebGL to add some visual interest to my portfolio site, a thought occurred to me: this is an interface from the browser to the system's GPU. Models run on GPUs. So I wondered: could I use WebGL to run a small chatbot using a visitor's physical hardware? It would be pretty cool to have a tiny RAG chatbot on my site that answers questions about my resume.</p>

      <p>After doing a little research I discovered that the answer was yes. Running a small, quantized model like this was theoretically possible. Then I discovered that someone had already built a library to do this very thing: <a href="https://github.com/mlc-ai/web-llm" target="_blank" rel="noopener noreferrer">WebLLM</a>.</p>

      <p>I now knew I could leverage WebGL to run a tiny model through the browser and I had a library that would let me do it. After reading the docs, I wrote a prompt for Qwen code to build a custom hook that would download the model and initiate the chat. A bit of back and forth debugging later, I had a working chatbot on my portfolio site (after a sizable download).</p>

      <p>Getting answers about dinosaurs and birds through an LLM (or maybe SLM?) running locally on your computer's hardware, through a browser is cool, but not really my vision for the portfolio; I wanted a visitor to be able to ask questions about me and my qualifications. With that in mind, I set out to train an unquantized version of one of these tiny models to answer those questions.</p>

      <p>First I had to pick a model to start training. WebLLM provides a convenient reference to several quantized versions of models from various groups inside the library itself. I had started with a small version of Meta's Llama, but that required a download north of half a gigabyte. I wanted to see if I could go smaller. Several minutes of scrolling later, I found Qwen2.5-0.5B-Instruct. It wasn't the absolute smallest, but, at less than three hundred megabytes, it was noticeably smaller than the model I was using, and it was related to a model with which I had experience.</p>

      <p>I was already familiar with the basic idea of training a model: you need to construct training data and show it to the model. However, I had to do some research about how to actually accomplish this. I ran a series of searches before landing on Haystack. It was open-source and used widely.</p>

      <p>Getting Haystack working ended up being the first big roadblock of this project. My local machine was missing several libraries it required. Qwen code really struggled to resolve dependencies for it. It kept trying to downgrade versions of certain plugins and then spitting out different versions of "this plugin requires at least this version of that plugin." At one point it tried to switch to a completely different training library. I had no interest in picking another one, just to see it fail to install the dependencies for that one. I ended up having to do some old school developing and manually configure dependencies. A few hours later, though, I had it working.</p>

      <p>I'd had Qwen write me a python script to generate training data from plaintext versions of my resume. It ended up spitting out some JSONL with questions about my qualifications, but no answers.</p>

      <p>I completed the questions and I ran the training program. The good news: it answered questions about me. The bad news: it was making a lot of stuff up!</p>

      <p>Another issue was answering as if it were me - I didn't want that, so I redid the questions to reflect that and added a little context.</p>

      <p>In order to correct the issues with hallucination, I began adding more training data. To start, I asked Claude to interview me pretending to be a CTO for a company and then as someone who would ask questions about culture fit.</p>

      <p>I added more plain text from resume variations. I constructed honesty questions. I added specific question and answer sets about the subjects of its hallucinations. Unfortunately, it seemed like even after I had added 15 different questions about how I don't know C# or any C-family languages, it still occasionally said that I did.</p>

      <p>That's to say nothing of it deciding to say I have a boyfriend, a wife, and a husband at different points, instead of saying it didn't know - I tried both training data that directed it to say it didn't know, as well as data that told it to answer that I was single (just to see if that would work). Nothing seemed to fix it.</p>

      <p>I did a little more research. I started from a fresh model. I lowered the inference temperature (this ended up helping the most). The model still would not stop hallucinating and I hadn't even quantized it.</p>

      <p>It is at this point a cliche that the definition of insanity is trying the same thing repeatedly and expecting different results, but I didn't think it was wise to spend a lot of time trying to train a separate model for what was essentially a parlor trick, when I wasn't getting significant improvements. I learned a lot about how training works and the different parameters, but training a model takes time and I wanted to get my website up sooner rather than later, so I decided to take a different approach.</p>

      <p>Instead of training a new model from an existing one, I would try using my resume and information as context for the chatbot I already had working. I always knew this was an option, but it seemed less cool to me, so I had pursued the training approach. As I have learned throughout my life, sometimes the less exciting option is the better one, all things considered.</p>

      <p>Using a chat context proved immediately better. While I still was getting some hallucinations, the model was following restrictions a lot better than the custom one did in testing. It also had the added benefit of already being on the local version of my site. This let me see changes to my parameters a lot faster than when I had to wait for the model to finish training.</p>

      <p>At the moment, this ended up being little more than a parlor trick to show off on my portfolio website. One might even say that it's not a very good one! However, I did learn a lot about how models are trained and how to run a model locally in a user's browser. Right now, there isn't a clear use case for doing that, but I believe there is a lot of potential in smaller, more efficient models. In the future, we may see a technological breakthrough in memory production, which lets more and more everyday people run models locally instead of paying for a service.</p>
    `}];function We(t){return $.find(n=>n.id===t)}function Ge(){const[,t]=S();return e("div",{class:"min-h-screen p-8",children:e("div",{class:"max-w-3xl mx-auto",children:e("div",{class:"space-y-8",children:$.map(n=>e("article",{onClick:()=>t(`/blog/${n.id}`),class:"glass-blog rounded-2xl p-6 cursor-pointer glass-hover transition-all duration-200 hover:scale-[1.02]",role:"article",tabIndex:0,onKeyDown:r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),t(`/blog/${n.id}`))},children:[e("div",{class:"flex items-center gap-4 mb-3",children:e("time",{class:"text-sm text-theme/60 font-mono",children:new Date(n.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})}),e("h2",{class:"text-2xl font-heading font-bold text-theme mb-3",children:n.title}),e("div",{class:"text-theme/80 prose prose-sm max-w-none",dangerouslySetInnerHTML:{__html:n.content.replace(/<[^>]*>/g,"").trim().slice(0,300)+"..."}}),e("div",{class:"mt-4",children:e("span",{class:"text-accent-green text-sm font-medium",children:"Read more →"})})]},n.id))})})})}function $e(){const[t,n]=S(),r=t.split("/").pop()||"",a=We(r);return a?e("div",{class:"min-h-screen p-8",children:e("div",{class:"max-w-3xl mx-auto",children:[e("button",{onClick:()=>n("/blog"),class:"mb-8 px-4 py-2 rounded-xl glass glass-hover transition-all text-theme text-sm","aria-label":"Back to blog list",children:"← Back to Blog"}),e("article",{class:"glass-blog rounded-2xl p-8",children:[e("time",{class:"text-sm text-theme/60 font-mono block mb-4",children:new Date(a.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}),e("h1",{class:"text-3xl font-heading font-bold text-theme mb-6",children:a.title}),e("div",{class:"prose prose-lg max-w-none text-theme/80 blog-content",dangerouslySetInnerHTML:{__html:a.content}})]}),e("div",{class:"mt-8 flex justify-between",children:e("button",{onClick:()=>n("/blog"),class:"px-6 py-3 rounded-xl glass glass-hover transition-all text-theme","aria-label":"Back to blog list",children:"← Back to Blog"})})]})}):e("div",{class:"min-h-screen p-8 flex items-center justify-center",children:e("div",{class:"text-center",children:[e("h1",{class:"text-2xl font-heading font-bold text-theme mb-4",children:"Post not found"}),e("button",{onClick:()=>n("/blog"),class:"px-6 py-3 rounded-xl glass glass-hover transition-all text-theme",children:"← Back to Blog"})]})})}const Ve={"/":"","/projects":"Projects","/chat":"Chat","/about":"About Me","/resume":"Resume","/blog":"Blog"};function V(t){return t.startsWith("/projects/")?"Project Detail":t.startsWith("/blog/")?"Blog Post":Ve[t]??""}function Ye(t){return t==="/"||t===""}function Qe(t){const n=V(t);return n===""?"Eliot Gaspar-Finer":`Eliot Gaspar-Finer - ${n}`}function Ke(){const[t,n]=g(!1),[r,a]=g(""),[i]=S();E(()=>{a(i),i.startsWith("/projects/")&&i!=="/projects"&&n(!1)},[i]);const o=m=>{n(m)},l=r.startsWith("/games/dark-forest"),d=Ye(r)&&!(r==="/chat");V(r);const c=Qe(r);return e("div",{class:"flex min-h-screen relative",children:[!l&&e("div",{class:"fixed inset-0 z-0",children:e(Le,{})}),!l&&e(pe,{isOpen:t,onClose:()=>o(!1),onNavigate:()=>o(!1)}),!l&&e("div",{class:"fixed top-4 right-4 z-50",children:e(fe,{})}),d&&!l?e("div",{class:`flex w-full h-screen split-layout-mobile ${t?"menu-open-animate":""}`,children:[e("div",{class:"w-1/4 h-full relative z-10 flex flex-col justify-end",style:{padding:"1.4rem"},children:[e("div",{class:"lava-left-overlay absolute inset-0"}),e("div",{class:"relative z-20 flex items-center gap-4 mb-auto",children:[!t&&e("button",{onClick:()=>n(!0),class:"p-3 glass glass-hover rounded-xl transition-all menu-open-btn","aria-label":"Open menu",children:e("svg",{class:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 6h16M4 12h16M4 18h16"})})}),e("h2",{class:"text-lg font-heading font-bold left-panel-text leading-tight",children:"Eliot Asenoth Gaspar-Finer"})]}),e("div",{class:"relative z-20 flex justify-center gap-4 pb-8 animate-fade-in-up mobile-icons-bottom",style:{animationDelay:"0.2s"},children:[e("a",{href:"https://www.linkedin.com/in/efiner",target:"_blank",rel:"noopener noreferrer",class:"p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon","aria-label":"LinkedIn",children:e("svg",{class:"w-6 h-6 transition-transform duration-300",fill:"currentColor",viewBox:"0 0 24 24",children:e("path",{d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"})})}),e("a",{href:"https://github.com/nothingfiner",target:"_blank",rel:"noopener noreferrer",class:"p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon","aria-label":"GitHub",children:e("svg",{class:"w-6 h-6 transition-transform duration-300",fill:"currentColor",viewBox:"0 0 24 24",children:e("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"})})}),e("a",{href:"mailto:e.a.finer@gmail.com",class:"p-3 rounded-xl glass glass-hover transition-all duration-300 left-panel-icon","aria-label":"Email",children:e("svg",{class:"w-6 h-6 transition-transform duration-300",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"})})})]})]}),e("div",{class:"portrait-wrapper absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-scale",children:e("div",{class:"portrait-container",children:e("img",{src:"./assets/porfolio_portrait.jpeg",alt:"Elie",class:"portrait-image"})})}),e("div",{class:"w-3/4 h-full relative z-40",children:[e("div",{class:"lava-right-overlay absolute inset-0 transition-opacity duration-700"}),e("main",{id:"main-content",class:"relative z-20 h-full flex items-center justify-center p-8 md:p-16",children:e("div",{class:"w-full max-w-2xl text-left animate-fade-in-up",style:{animationDelay:"0.3s"},children:e(z,{fallback:e("div",{class:"min-h-screen flex items-center justify-center text-theme",children:"Loading..."}),children:e(x,{path:"/",component:q})})})})]})]}):e(oe,{children:e("main",{id:"main-content",class:`relative z-10 flex-1 transition-all duration-300 ${!l&&t?"md:ml-80 ml-0":"ml-0"}`,children:[!l&&e("header",{class:"fixed left-0 top-0 right-0 z-20 flex items-center gap-4 p-4 md:p-4 ml-4",children:[!t&&e("button",{onClick:()=>o(!0),class:"p-3 glass glass-hover rounded-xl transition-all header-menu-btn flex-shrink-0","aria-label":"Open menu",children:e("svg",{class:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 6h16M4 12h16M4 18h16"})})}),e("div",{class:"flex items-center gap-2 flex-wrap",children:e("h1",{class:"text-lg font-heading font-bold left-panel-text leading-tight header-page-text",children:c})})]}),e("div",{class:l?"":"pt-20",children:e(z,{fallback:e("div",{class:"min-h-screen flex items-center justify-center text-theme",children:"Loading..."}),children:[e(x,{path:"/",component:q}),e(x,{path:"/projects",component:Ee}),e(x,{path:"/projects/:id",component:Te}),e(x,{path:"/chat",component:Ne}),e(x,{path:"/blog",component:Ge}),e(x,{path:"/blog/:id",component:$e}),e(x,{path:"/games/dark-forest",component:Be}),e(x,{path:"/about",component:je}),e(x,{path:"/resume",component:Pe})]})})]})})]})}function Je(){return e(ae,{hook:G,children:e(Ke,{})})}re(e(de,{children:e(Je,{})}),document.getElementById("app"));export{Ae as _,e as u};
