!function(){let e=new MouseFollower;if(e.setText("Drag me"),/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||"ontouchstart"in window||navigator.maxTouchPoints>0||window.matchMedia("(pointer: coarse)").matches){function t(e){let t=new MouseEvent("mousemove",{clientX:e.clientX,clientY:e.clientY,bubbles:!0});document.body.dispatchEvent(t)}t({clientX:500,clientY:340}),document.addEventListener("touchstart",i=>{e.addState("-active"),e.setText("It's not easy though"),t(i.touches[0])},{passive:!1}),document.addEventListener("touchmove",e=>{t(e.touches[0])},{passive:!1}),document.addEventListener("touchend",()=>{e.removeState("-active"),e.removeText()})}else document.addEventListener("mousedown",()=>{e.setText("It's not easy though")}),document.addEventListener("mouseup",()=>{e.removeText()})}(),function(e){let t;let i=0,s=["webkit","moz","ms","o"],n=e.requestAnimationFrame,o=e.cancelAnimationFrame;for(let i=0;i<s.length&&(!n||!o);i++)t=s[i],n=n||e[t+"RequestAnimationFrame"],o=o||e[t+"CancelAnimationFrame"]||e[t+"CancelRequestAnimationFrame"];n&&o||(n=function(t){let s=new Date().getTime(),n=Math.max(0,16-(s-i)),o=e.setTimeout(function(){t(s+n)},n);return i=s+n,o},o=function(t){e.clearTimeout(t)}),e.requestAnimationFrame=n,e.cancelAnimationFrame=o}(window),function(e){let t,i,s,n;let o=e.ParticleEffects={};o.isTouch="ontouchstart"in document.documentElement,o.getTaggedElem=function(e,t){if(!e.dataset.icon)return!1;for(;e&&9!==e.nodeType;){if(e.nodeName&&e.nodeName.toLowerCase()===t)return e;e=e.parentNode}return!1},o.charCount=0,o.charElems=[],o.parseForParticles=function(e){let t=e.textContent.split(" "),i=e.dataset?.icon;for(i&&(t=[" "],e.dataset.icon="");e.firstChild;)e.removeChild(e.firstChild);let s=document.createDocumentFragment(),n=[],a=[];for(let e=0;e<t.length;e++){let r=t[e],h=document.createElement("span");h.className="word",n.push(h);let l=r.split("");for(let e=0;e<l.length;e++){let t=document.createElement("span");t.className="char",t.textContent=l[e],i&&(t.textContent="",t.dataset.icon=i),a.push(t),h.appendChild(t),o.charCount++}s.appendChild(h),s.appendChild(document.createTextNode(" "))}return e.appendChild(s),a};class a{constructor(e){this.element=e,this.chars=e.querySelectorAll(".char"),this.charsLen=this.chars.length,this.charsLen&&(this.endIndex=0,this.startIndex=0,this.hueIndex=Math.floor(360*Math.random()),this.colors=[],this.isHovered=!0,this.isSparkling=!0,this.sparkle(),t=e,document.addEventListener("mouseover",this,!1))}handleEvent(e){let t=e.type+"Handler";this[t]&&this[t](e)}mouseoverHandler(e){this.element.contains(e.target)||(this.isHovered=!1,t=null,document.removeEventListener("mouseover",this,!1))}sparkle(){this.endIndex=Math.min(this.endIndex+1,this.charsLen);let e=10*this.hueIndex%240+120,t=this.isHovered?"hsl("+e+", 70%, 80%)":"white";this.colors.unshift(t);for(let e=this.startIndex;e<this.endIndex;e++)this.chars[e].style.color=this.colors[e];this.isHovered?this.hueIndex++:this.startIndex=Math.min(this.startIndex+1,this.charsLen),this.isSparkling=this.startIndex!==this.charsLen,this.isSparkling&&requestAnimationFrame(this.sparkle.bind(this))}}o.onMouseover=function(e){let i=o.getTaggedElem(e.target,"a");!o.isCursorActive&&i&&i!==t&&new a(i)};let r=2*Math.PI,h=function(e){let t=["","Webkit","Moz","ms","O"],i=document.createElement("div").style;for(let s=0;s<t.length;s++){let n=t[s]?t[s]+e.charAt(0).toUpperCase()+e.slice(1):e;if(n in i)return n}return null}("transform"),l=o.charParticles=[],c=0,d=!0,u=!1,m=function(){let e=document.createElement("div").style;return"transform"in e||"WebkitTransform"in e||"MozTransform"in e||"msTransform"in e||"OTransform"in e}(),f=function(){let e=document.createElement("div");if(e.style.cssText="transform: rotateY(45deg);",""!==e.style.transform)return!0;let t=["Webkit","Moz","ms","O"];for(let i=0;i<t.length;i++)if(e.style.cssText=t[i]+"Transform: rotateY(45deg);",""!==e.style[t[i]+"Transform"])return!0;return!1}();class v{constructor(e){this.index=c++,this.element=e,this.x=0,this.y=0,this.angle=0,this.scale=1,this.velocityX=0,this.velocityY=0,this.velocityR=0,this.isSettled=!0,this.wasSettled=!0,this.updatePosition()}updatePosition(){let e=this.element;this.width=e.offsetWidth,this.height=e.offsetHeight,this.originX=e.offsetLeft+this.width/2,this.originY=e.offsetTop+this.height/2}update(){let e=i-(this.originX+this.x),t=s-(this.originY+this.y),n=Math.sqrt(e*e+t*t),a=0;if(o.isCursorActive&&250>n){let i=1-n/250,s=Math.atan2(t,e),o=Math.abs((a=(s-Math.PI/2)*Math.min(3*i,1))-this.angle);Math.abs(a-r-this.angle)<o?a-=r:Math.abs(a+r-this.angle)<o&&(a+=r),i*=3.5*i,this.velocityX+=-(Math.cos(s)*i),this.velocityY+=-(Math.sin(s)*i)}this.angle=this.angle%r,this.velocityX+=.005*(0-this.x),this.velocityY+=.005*(0-this.y),this.velocityR+=a-this.angle,this.x+=this.velocityX,this.y+=this.velocityY,this.angle+=.01*this.velocityR,this.velocityX*=.95,this.velocityY*=.95,this.velocityR*=.95;let h=Math.sqrt(this.x*this.x+this.y*this.y);this.scale=h/250*2+1;let l=.03>Math.abs(this.x)&&.03>Math.abs(this.y)&&.004>Math.abs(this.angle)&&.03>Math.abs(this.scale-1);this.isSettled=this.wasSettled&&l,d=d&&this.isSettled,this.wasSettled=l,this.render()}render(){m?f?this.element.style[h]=this.isSettled?"none":`translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale}) rotate(${this.angle}rad)`:this.element.style[h]=this.isSettled?"none":`translate(${this.x}px, ${this.y}px) scale(${this.scale}) rotate(${this.angle}rad)`:(this.element.style.left=this.x+"px",this.element.style.top=this.y+"px")}}function g(e){y(e,e)}function p(e){if(!o.isCursorActive){let t=e.changedTouches[0];t&&(n=t.identifier,y(t,e))}}function y(t,n){o.isCursorActive=!0,o.areAllCharParticlesSettled=!1,i=t.pageX,s=t.pageY,n.preventDefault(),o.isTouch?(e.addEventListener("touchmove",E,!1),e.addEventListener("touchend",T,!1)):(e.addEventListener("mousemove",x,!1),e.addEventListener("mouseup",C,!1))}function x(e){M(e)}function E(e){if(o.isCursorActive)for(let t=0;t<e.changedTouches.length;t++){let i=e.changedTouches[t];if(i.identifier===n){M(i);break}}}function T(t){for(let i=0;i<t.changedTouches.length;i++)if(t.changedTouches[i].identifier===n){o.isCursorActive=!1,o.isTouch?(e.removeEventListener("touchmove",E,!1),e.removeEventListener("touchend",T,!1)):(e.removeEventListener("mousemove",x,!1),e.removeEventListener("mouseup",C,!1));break}}function M(e){i=parseInt(e.pageX,10),s=parseInt(e.pageY,10)}function C(){o.isCursorActive=!1,e.removeEventListener("mousemove",x,!1),e.removeEventListener("mouseup",C,!1)}o.addCharParticles=function(e){let t=[];for(let i=0,s=e.length;i<s;i++){let s=new v(e[i]);t.push(s),l.push(s)}return t},o.initCharParticles=function(){if(u)for(let e=0,t=l.length;e<t;e++)l[e].updatePosition();else o.addCharParticles(o.initialParticleElems),o.isTouch?document.addEventListener("touchstart",p,!1):document.addEventListener("mousedown",g,!1),function e(){if(!o.areAllCharParticlesSettled){d=!0;for(let e=0,t=l.length;e<t;e++)l[e].update();o.areAllCharParticlesSettled=d}requestAnimationFrame(e)}(),u=!0},setTimeout(o.initCharParticles,20);let L=!1;function w(){if(!L){let e=document.querySelectorAll(".split");for(let t=0,i=e.length;t<i;t++){let i=o.parseForParticles(e[t]);o.initialParticleElems=o.initialParticleElems.concat(i)}o.isTouch||document.addEventListener("mouseover",o.onMouseover,!1),L=!0}}o.initialParticleElems=[],e.addEventListener("DOMContentLoaded",w,!1),o.isTouch||(e.onload=w)}(window);
//# sourceMappingURL=index.b55e0f7a.js.map
