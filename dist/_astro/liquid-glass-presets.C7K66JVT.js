function g(s,t,e){return e=Math.max(0,Math.min(1,(e-s)/(t-s))),e*e*(3-2*e)}function b(s,t){return Math.sqrt(s*s+t*t)}function w(s,t,e,a,r){const n=Math.abs(s)-e+r,h=Math.abs(t)-a+r;return Math.min(Math.max(n,h),0)+b(Math.max(n,0),Math.max(h,0))-r}function m(s,t){return{type:"t",x:s,y:t}}function v(){return"liquid-glass-"+Math.random().toString(36).substr(2,9)}class A{constructor(t,e={}){t&&(this.container=t,this.fragment=e.fragment||(a=>m(a.x,a.y)),this.canvasDPI=e.canvasDPI||1,this.filterStrength=e.filterStrength||"blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)",this.chromaticAberration=e.chromaticAberration||!1,this.frosted=e.frosted||!1,this.id=v(),this.mouse={x:.5,y:.5},this.mouseUsed=!1,this.measure(),this.createElement(),this.setupEventListeners(),this.updateShader())}measure(){const t=this.container.getBoundingClientRect();this.width=Math.max(1,Math.round(t.width)),this.height=Math.max(1,Math.round(t.height))}updateFilterRegion(){const t=this.frosted?50:0;this.filter.setAttribute("x",(-t).toString()),this.filter.setAttribute("y",(-t).toString()),this.filter.setAttribute("width",(this.width+t*2).toString()),this.filter.setAttribute("height",(this.height+t*2).toString())}createElement(){this.svg=document.createElementNS("http://www.w3.org/2000/svg","svg"),this.svg.setAttribute("xmlns","http://www.w3.org/2000/svg"),this.svg.setAttribute("width","0"),this.svg.setAttribute("height","0"),this.svg.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9998;
    `;const t=document.createElementNS("http://www.w3.org/2000/svg","defs");this.filter=document.createElementNS("http://www.w3.org/2000/svg","filter"),this.filter.setAttribute("id",`${this.id}_filter`),this.filter.setAttribute("filterUnits","userSpaceOnUse"),this.filter.setAttribute("colorInterpolationFilters","sRGB"),this.updateFilterRegion(),this.feImage=document.createElementNS("http://www.w3.org/2000/svg","feImage"),this.feImage.setAttribute("id",`${this.id}_map`),this.feImage.setAttribute("width",this.width.toString()),this.feImage.setAttribute("height",this.height.toString()),this.feDisplacementMap=document.createElementNS("http://www.w3.org/2000/svg","feDisplacementMap"),this.feDisplacementMap.setAttribute("in","SourceGraphic"),this.feDisplacementMap.setAttribute("in2",`${this.id}_map`),this.feDisplacementMap.setAttribute("xChannelSelector","R"),this.feDisplacementMap.setAttribute("yChannelSelector","G"),this.feDisplacementMap.setAttribute("result","displaced"),this.filter.appendChild(this.feImage),this.filter.appendChild(this.feDisplacementMap),this.frosted&&(this.feTurbulence=document.createElementNS("http://www.w3.org/2000/svg","feTurbulence"),this.feTurbulence.setAttribute("type","fractalNoise"),this.feTurbulence.setAttribute("baseFrequency","1.2"),this.feTurbulence.setAttribute("numOctaves","2"),this.feTurbulence.setAttribute("result","noise"),this.feGaussianBlurBase=document.createElementNS("http://www.w3.org/2000/svg","feGaussianBlur"),this.feGaussianBlurBase.setAttribute("in","displaced"),this.feGaussianBlurBase.setAttribute("stdDeviation","6"),this.feGaussianBlurBase.setAttribute("edgeMode","duplicate"),this.feGaussianBlurBase.setAttribute("result","macro_blur"),this.feDisplacementMapFrost=document.createElementNS("http://www.w3.org/2000/svg","feDisplacementMap"),this.feDisplacementMapFrost.setAttribute("in","macro_blur"),this.feDisplacementMapFrost.setAttribute("in2","noise"),this.feDisplacementMapFrost.setAttribute("scale","8"),this.feDisplacementMapFrost.setAttribute("xChannelSelector","R"),this.feDisplacementMapFrost.setAttribute("yChannelSelector","G"),this.feDisplacementMapFrost.setAttribute("result","micro_scatter"),this.feGaussianBlurSoft=document.createElementNS("http://www.w3.org/2000/svg","feGaussianBlur"),this.feGaussianBlurSoft.setAttribute("in","micro_scatter"),this.feGaussianBlurSoft.setAttribute("stdDeviation","0.5"),this.feGaussianBlurSoft.setAttribute("edgeMode","duplicate"),this.feGaussianBlurSoft.setAttribute("result","softened_volume"),this.feColorMatrixSparkle=document.createElementNS("http://www.w3.org/2000/svg","feColorMatrix"),this.feColorMatrixSparkle.setAttribute("in","noise"),this.feColorMatrixSparkle.setAttribute("type","matrix"),this.feColorMatrixSparkle.setAttribute("values",`
        0.33 0.33 0.33 0 0 
        0.33 0.33 0.33 0 0 
        0.33 0.33 0.33 0 0 
        0    0    0    0.08 0
      `),this.feColorMatrixSparkle.setAttribute("result","sparkle_layer"),this.feCompositeGrain=document.createElementNS("http://www.w3.org/2000/svg","feComposite"),this.feCompositeGrain.setAttribute("in","sparkle_layer"),this.feCompositeGrain.setAttribute("in2","softened_volume"),this.feCompositeGrain.setAttribute("operator","over"),this.filter.appendChild(this.feTurbulence),this.filter.appendChild(this.feGaussianBlurBase),this.filter.appendChild(this.feDisplacementMapFrost),this.filter.appendChild(this.feGaussianBlurSoft),this.filter.appendChild(this.feColorMatrixSparkle),this.filter.appendChild(this.feCompositeGrain)),t.appendChild(this.filter),this.svg.appendChild(t),document.body.appendChild(this.svg),this.canvas=document.createElement("canvas"),this.canvas.width=this.width*this.canvasDPI,this.canvas.height=this.height*this.canvasDPI,this.canvas.style.display="none",this.context=this.canvas.getContext("2d"),this.container.style.backdropFilter=`url(#${this.id}_filter) ${this.filterStrength}`,this.container.style.webkitBackdropFilter=`url(#${this.id}_filter) ${this.filterStrength}`,window.getComputedStyle(this.container).position==="static"&&(this.container.style.position="relative"),this.lightingGroup=document.createElement("div"),this.lightingGroup.className="liquid-glass-lighting",this.lightingGroup.style.cssText=`
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 0;
    `,this.ambientEdge=document.createElement("div"),this.ambientEdge.style.cssText=`
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 
        inset 0 0 0 1px rgba(255, 255, 255, 0.2), 
        inset 1.5px 1.5px 6px rgba(255, 255, 255, 0.4), 
        inset -1.5px -1.5px 6px rgba(255, 255, 255, 0.2);
    `,this.directionalEdge=document.createElement("div"),this.directionalEdge.style.cssText=`
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding:1.2px;
      background: 
        radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 70%),
        radial-gradient(120% 120% at 100% 100%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 50%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    `,this.chromaticAberration&&(this.chromaticEdge=document.createElement("div"),this.chromaticEdge.style.cssText=`
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1.1px;
        background:
          radial-gradient(140% 130% at -6% 0%, rgba(255, 122, 122, 0.2) 0%, rgba(255, 122, 122, 0.08) 26%, transparent 54%),
          radial-gradient(140% 130% at 106% 100%, rgba(140, 186, 255, 0.22) 0%, rgba(140, 186, 255, 0.09) 28%, transparent 56%);
        mix-blend-mode: screen;
        opacity: 0.6;
        filter: saturate(1.08) blur(0.35px);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      `),this.innerGlow=document.createElement("div"),this.innerGlow.style.cssText=`
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 90%);
    `,this.lightingGroup.appendChild(this.ambientEdge),this.lightingGroup.appendChild(this.directionalEdge),this.chromaticEdge&&this.lightingGroup.appendChild(this.chromaticEdge),this.lightingGroup.appendChild(this.innerGlow),this.container.appendChild(this.lightingGroup)}resize(){const t=this.width,e=this.height;this.measure(),!(t===this.width&&e===this.height)&&(this.canvas.width=this.width*this.canvasDPI,this.canvas.height=this.height*this.canvasDPI,this.updateFilterRegion(),this.feImage.setAttribute("width",this.width.toString()),this.feImage.setAttribute("height",this.height.toString()),this.updateShader())}setupEventListeners(){typeof ResizeObserver<"u"?(this.resizeObserver=new ResizeObserver(()=>{this.resize()}),this.resizeObserver.observe(this.container)):window.addEventListener("resize",()=>{this.resize()}),this.handleMouseMove=t=>{const e=this.container.getBoundingClientRect();t.clientY>e.bottom+50||(this.mouse.x=(t.clientX-e.left)/e.width,this.mouse.y=(t.clientY-e.top)/e.height,this.mouseUsed&&this.updateShader())},document.addEventListener("mousemove",this.handleMouseMove)}updateShader(){const t=new Proxy(this.mouse,{get:(i,o)=>(this.mouseUsed=!0,i[o])});this.mouseUsed=!1;const e=this.width*this.canvasDPI,a=this.height*this.canvasDPI;if(e<=0||a<=0)return;const r=new Uint8ClampedArray(e*a*4);let n=0;const h=[];for(let i=0;i<r.length;i+=4){const o=i/4%e,u=Math.floor(i/4/e),c=this.fragment({x:o/e,y:u/a},t),d=c.x*e-o,p=c.y*a-u;n=Math.max(n,Math.abs(d),Math.abs(p)),h.push(d,p)}n*=.5;let l=0;for(let i=0;i<r.length;i+=4){const o=h[l++]/n+.5,u=h[l++]/n+.5;r[i]=o*255,r[i+1]=u*255,r[i+2]=0,r[i+3]=255}this.context.putImageData(new ImageData(r,e,a),0,0),this.feImage.setAttributeNS("http://www.w3.org/1999/xlink","href",this.canvas.toDataURL()),this.feDisplacementMap.setAttribute("scale",(n/this.canvasDPI).toString())}destroy(){this.resizeObserver&&this.resizeObserver.disconnect(),this.handleMouseMove&&document.removeEventListener("mousemove",this.handleMouseMove),this.lightingGroup&&this.lightingGroup.remove(),this.svg.remove(),this.canvas.remove()}}const f={x:.3,y:.2,r:.6},x="blur(0.25px) contrast(1.12) brightness(1.15) saturate(1.15)";function S(s=f){const{x:t,y:e,r:a}={...f,...s||{}};return r=>{const n=r.x-.5,h=r.y-.5,l=w(n,h,t,e,a),i=g(.8,0,l-.15),o=g(0,1,i);return m(n*o+.5,h*o+.5)}}function M(s={}){const{xyr:t,...e}=s;return{frosted:!1,chromaticAberration:!0,filterStrength:x,fragment:S(t),...e}}export{A as L,M as g};
