(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,78631,(e,t,o)=>{!function(t,o){if("function"==typeof define&&define.amd){let t;void 0!==(t=o())&&e.v(t)}else o()}(e.e,function(){"use strict";function o(e,t,o){var r=new XMLHttpRequest;r.open("GET",e),r.responseType="blob",r.onload=function(){l(r.response,t,o)},r.onerror=function(){console.error("could not download file")},r.send()}function r(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function n(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(o){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var i="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:e.g.global===e.g?e.g:void 0,a=i.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),l=i.saveAs||("object"!=typeof window||window!==i?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(e,t,a){var l=i.URL||i.webkitURL,s=document.createElement("a");s.download=t=t||e.name||"download",s.rel="noopener","string"==typeof e?(s.href=e,s.origin===location.origin?n(s):r(s.href)?o(e,t,a):n(s,s.target="_blank")):(s.href=l.createObjectURL(e),setTimeout(function(){l.revokeObjectURL(s.href)},4e4),setTimeout(function(){n(s)},0))}:"msSaveOrOpenBlob"in navigator?function(e,t,i){if(t=t||e.name||"download","string"!=typeof e){var a;navigator.msSaveOrOpenBlob((void 0===(a=i)?a={autoBom:!1}:"object"!=typeof a&&(console.warn("Deprecated: Expected third argument to be a object"),a={autoBom:!a}),a.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e),t)}else if(r(e))o(e,t,i);else{var l=document.createElement("a");l.href=e,l.target="_blank",setTimeout(function(){n(l)})}}:function(e,t,r,n){if((n=n||open("","_blank"))&&(n.document.title=n.document.body.innerText="downloading..."),"string"==typeof e)return o(e,t,r);var l="application/octet-stream"===e.type,s=/constructor/i.test(i.HTMLElement)||i.safari,d=/CriOS\/[\d]+/.test(navigator.userAgent);if((d||l&&s||a)&&"undefined"!=typeof FileReader){var c=new FileReader;c.onloadend=function(){var e=c.result;e=d?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),n?n.location.href=e:location=e,n=null},c.readAsDataURL(e)}else{var p=i.URL||i.webkitURL,f=p.createObjectURL(e);n?n.location=f:location.href=f,n=null,setTimeout(function(){p.revokeObjectURL(f)},4e4)}});i.saveAs=l.saveAs=l,t.exports=l})},13290,e=>{"use strict";var t=e.i(43476),o=e.i(71645),r=e.i(91557);e.i(36180);var n=e.i(98925);e.i(51718);var i=e.i(18357),a=e.i(18566),l=e.i(71315),s=e.i(78631);function d(){let[e,d]=(0,o.useState)(null),[c,p]=(0,o.useState)(!0),[f,u]=(0,o.useState)([]),[g,h]=(0,o.useState)(!0),x=(0,a.useRouter)();(0,o.useEffect)(()=>{let e=(0,i.onAuthStateChanged)(r.auth,e=>{d(e),p(!1)});return()=>e()},[]),(0,o.useEffect)(()=>{c||(e?(async()=>{try{let t=(0,n.query)((0,n.collection)(r.db,"users",e.uid,"sites"),(0,n.orderBy)("createdAt","desc")),o=(await (0,n.getDocs)(t)).docs.map(e=>({id:e.id,...e.data()}));u(o)}catch(e){console.error("Error fetching sites:",e)}finally{h(!1)}})():x.push("/"))},[e,c,x]);let b=async e=>{var t,o;let r,n,i,a,d,c,p,f=new l.default,u=(t=e.content,r=t.style?.primaryColor||"#3b82f6",n=t.style?.backgroundColor||"#ffffff",i=t.hero?.title||t.title||"My LaunchPage",a=t.hero?.description||t.subtitle||"",`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${i}</title>
                <link rel="stylesheet" href="style.css">
                <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet">
                <style>
                    :root {--primary: ${r}; --bg: ${n}; }
                    body {background-color: var(--bg); color: #1e293b; font-family: 'Heebo', sans-serif; }
                    .hero {padding: 100px 20px; text-align: center; }
                    h1 {color: var(--primary); font-size: 3rem; margin-bottom: 20px; font-weight: 900; }
                    .features {display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; padding: 60px 20px; max-width: 1000px; margin: 0 auto; }
                    .feature-card {background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: right; }
                    .cta-btn {background: var(--primary); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; }
                </style>
            </head>
            <body>
                <header class="hero">
                    <h1>${i}</h1>
                    <p style="font-size: 1.3rem; color: #475569; max-width: 700px; margin: 0 auto 30px;">${a}</p>
                    <a href="#" class="cta-btn">${t.hero?.cta||"צור קשר"}</a>
                </header>
                <main class="features">
                    ${t.features?t.features.map(e=>`
                        <div class="feature-card">
                            <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${e.title}</h3>
                            <p style="color: #64748b;">${e.desc}</p>
                        </div>
                    `).join(""):""}
                </main>
                <footer style="text-align: center; padding: 40px; border-top: 1px solid #e2e8f0; margin-top: 40px;">
                    <p>Built with LaunchPage AI 🚀</p>
                </footer>
            </body>
        </html>
        `.trim()),g=(o=e.content,d=o.style?.primaryColor||"#3b82f6",c=o.style?.backgroundColor||"#ffffff",p=o.style?.backgroundColor==="#0f172a"?"#ffffff":"#0f172a",`
        :root {
            --primary: ${d};
            --bg: ${c};
            --text: ${p};
        }
        * {box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Heebo', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        .hero { text-align: center; padding: 80px 20px; }
        h1 { font-size: 3rem; font-weight: 900; margin-bottom: 20px; color: var(--primary); }
        .cta-button { display: inline-block; padding: 15px 30px; background: var(--primary); color: white; text-decoration: none; border-radius: 12px; font-weight: bold; }
        `.trim());f.file("index.html",u),f.file("style.css",g),f.file("README.txt","תודה שרכשת את האתר שלך דרך LaunchPage AI! 🚀");let h=await f.generateAsync({type:"blob"});(0,s.saveAs)(h,`${e.content?.title||"landing-page"}.zip`)};return c||g?(0,t.jsx)("div",{style:{minHeight:"100vh",background:"#020617",display:"flex",alignItems:"center",justifyContent:"center",color:"#60a5fa"},children:"טוען אתרים..."}):(0,t.jsxs)("div",{style:{minHeight:"100vh",background:"radial-gradient(circle at top, #1e293b 0%, #020617 100%)",padding:"120px 40px 80px",color:"white",direction:"rtl"},children:[(0,t.jsxs)("header",{style:{maxWidth:"1200px",margin:"0 auto 60px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{style:{fontSize:"3rem",fontWeight:"950",marginBottom:"10px"},children:"📂 האתרים שלי"}),(0,t.jsx)("p",{style:{color:"#94a3b8"},children:"ניהול והורדה של דפי הנחיתה שיצרת"})]}),(0,t.jsx)("button",{onClick:()=>x.push("/"),style:{background:"#3b82f6",color:"white",padding:"15px 30px",borderRadius:"16px",border:"none",cursor:"pointer",fontWeight:"bold",boxShadow:"0 10px 20px rgba(59, 130, 246, 0.2)"},children:"+ יצירת אתר חדש"})]}),0===f.length?(0,t.jsxs)("div",{style:{textAlign:"center",marginTop:"100px",color:"#94a3b8"},children:[(0,t.jsx)("div",{style:{fontSize:"4rem",marginBottom:"20px"},children:"📁"}),(0,t.jsx)("p",{style:{fontSize:"1.2rem"},children:"עדיין לא יצרת אתרים. זה הזמן להתחיל! 🚀"})]}):(0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(350px, 1fr))",gap:"30px",maxWidth:"1200px",margin:"0 auto"},children:f.map(e=>(0,t.jsxs)("div",{style:{background:"rgba(30, 41, 59, 0.5)",padding:"30px",borderRadius:"24px",border:"1px solid rgba(255,255,255,0.05)",transition:"transform 0.2s",display:"flex",flexDirection:"column",gap:"20px"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{style:{fontSize:"1.5rem",marginBottom:"8px",color:"#fff"},children:e.content?.title||"אתר ללא שם"}),(0,t.jsx)("p",{style:{fontSize:"0.9rem",color:"#64748b"},children:e.createdAt?.seconds?new Date(1e3*e.createdAt.seconds).toLocaleDateString("he-IL"):"נוצר היום"})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"12px"},children:[(0,t.jsx)("button",{onClick:()=>x.push(`/result?id=${e.id}`),style:{flex:1,padding:"12px",borderRadius:"12px",background:"rgba(255,255,255,0.05)",color:"white",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",fontWeight:"bold"},children:"צפייה"}),(0,t.jsx)("button",{onClick:()=>b(e),style:{flex:1,padding:"12px",borderRadius:"12px",background:"#3b82f6",color:"white",border:"none",cursor:"pointer",fontWeight:"bold"},children:"הורדת ZIP"})]})]},e.id))})]})}e.s(["default",()=>d])}]);