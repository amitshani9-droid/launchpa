module.exports=[70179,(a,b,c)=>{!function(b,c){if("function"==typeof define&&define.amd){let b;void 0!==(b=c())&&a.v(b)}else c()}(a.e,function(){"use strict";var c="object"==typeof self&&self.self===self?self:a.g.global===a.g?a.g:void 0,d=(c.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&/Safari/.test(navigator.userAgent),c.saveAs||function(){});c.saveAs=d.saveAs=d,b.exports=d})},17452,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(36383);a.i(69387);var e=a.i(60574);a.i(30485);var f=a.i(31052),g=a.i(50944),h=a.i(7739),i=a.i(70179);function j(){let[a,j]=(0,c.useState)(null),[k,l]=(0,c.useState)(!0),[m,n]=(0,c.useState)([]),[o,p]=(0,c.useState)(!0),q=(0,g.useRouter)();(0,c.useEffect)(()=>{let a=(0,f.onAuthStateChanged)(d.auth,a=>{j(a),l(!1)});return()=>a()},[]),(0,c.useEffect)(()=>{k||(a?(async()=>{try{let b=(0,e.query)((0,e.collection)(d.db,"users",a.uid,"sites"),(0,e.orderBy)("createdAt","desc")),c=(await (0,e.getDocs)(b)).docs.map(a=>({id:a.id,...a.data()}));n(c)}catch(a){console.error("Error fetching sites:",a)}finally{p(!1)}})():q.push("/"))},[a,k,q]);let r=async a=>{var b,c;let d,e,f,g,j,k,l,m=new h.default,n=(b=a.content,d=b.style?.primaryColor||"#3b82f6",e=b.style?.backgroundColor||"#ffffff",f=b.hero?.title||b.title||"My LaunchPage",g=b.hero?.description||b.subtitle||"",`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${f}</title>
                <link rel="stylesheet" href="style.css">
                <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet">
                <style>
                    :root {--primary: ${d}; --bg: ${e}; }
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
                    <h1>${f}</h1>
                    <p style="font-size: 1.3rem; color: #475569; max-width: 700px; margin: 0 auto 30px;">${g}</p>
                    <a href="#" class="cta-btn">${b.hero?.cta||"צור קשר"}</a>
                </header>
                <main class="features">
                    ${b.features?b.features.map(a=>`
                        <div class="feature-card">
                            <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${a.title}</h3>
                            <p style="color: #64748b;">${a.desc}</p>
                        </div>
                    `).join(""):""}
                </main>
                <footer style="text-align: center; padding: 40px; border-top: 1px solid #e2e8f0; margin-top: 40px;">
                    <p>Built with LaunchPage AI 🚀</p>
                </footer>
            </body>
        </html>
        `.trim()),o=(c=a.content,j=c.style?.primaryColor||"#3b82f6",k=c.style?.backgroundColor||"#ffffff",l=c.style?.backgroundColor==="#0f172a"?"#ffffff":"#0f172a",`
        :root {
            --primary: ${j};
            --bg: ${k};
            --text: ${l};
        }
        * {box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Heebo', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        .hero { text-align: center; padding: 80px 20px; }
        h1 { font-size: 3rem; font-weight: 900; margin-bottom: 20px; color: var(--primary); }
        .cta-button { display: inline-block; padding: 15px 30px; background: var(--primary); color: white; text-decoration: none; border-radius: 12px; font-weight: bold; }
        `.trim());m.file("index.html",n),m.file("style.css",o),m.file("README.txt","תודה שרכשת את האתר שלך דרך LaunchPage AI! 🚀");let p=await m.generateAsync({type:"blob"});(0,i.saveAs)(p,`${a.content?.title||"landing-page"}.zip`)};return k||o?(0,b.jsx)("div",{style:{minHeight:"100vh",background:"#020617",display:"flex",alignItems:"center",justifyContent:"center",color:"#60a5fa"},children:"טוען אתרים..."}):(0,b.jsxs)("div",{style:{minHeight:"100vh",background:"radial-gradient(circle at top, #1e293b 0%, #020617 100%)",padding:"120px 40px 80px",color:"white",direction:"rtl"},children:[(0,b.jsxs)("header",{style:{maxWidth:"1200px",margin:"0 auto 60px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{style:{fontSize:"3rem",fontWeight:"950",marginBottom:"10px"},children:"📂 האתרים שלי"}),(0,b.jsx)("p",{style:{color:"#94a3b8"},children:"ניהול והורדה של דפי הנחיתה שיצרת"})]}),(0,b.jsx)("button",{onClick:()=>q.push("/"),style:{background:"#3b82f6",color:"white",padding:"15px 30px",borderRadius:"16px",border:"none",cursor:"pointer",fontWeight:"bold",boxShadow:"0 10px 20px rgba(59, 130, 246, 0.2)"},children:"+ יצירת אתר חדש"})]}),0===m.length?(0,b.jsxs)("div",{style:{textAlign:"center",marginTop:"100px",color:"#94a3b8"},children:[(0,b.jsx)("div",{style:{fontSize:"4rem",marginBottom:"20px"},children:"📁"}),(0,b.jsx)("p",{style:{fontSize:"1.2rem"},children:"עדיין לא יצרת אתרים. זה הזמן להתחיל! 🚀"})]}):(0,b.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(350px, 1fr))",gap:"30px",maxWidth:"1200px",margin:"0 auto"},children:m.map(a=>(0,b.jsxs)("div",{style:{background:"rgba(30, 41, 59, 0.5)",padding:"30px",borderRadius:"24px",border:"1px solid rgba(255,255,255,0.05)",transition:"transform 0.2s",display:"flex",flexDirection:"column",gap:"20px"},children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{style:{fontSize:"1.5rem",marginBottom:"8px",color:"#fff"},children:a.content?.title||"אתר ללא שם"}),(0,b.jsx)("p",{style:{fontSize:"0.9rem",color:"#64748b"},children:a.createdAt?.seconds?new Date(1e3*a.createdAt.seconds).toLocaleDateString("he-IL"):"נוצר היום"})]}),(0,b.jsxs)("div",{style:{display:"flex",gap:"12px"},children:[(0,b.jsx)("button",{onClick:()=>q.push(`/result?id=${a.id}`),style:{flex:1,padding:"12px",borderRadius:"12px",background:"rgba(255,255,255,0.05)",color:"white",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",fontWeight:"bold"},children:"צפייה"}),(0,b.jsx)("button",{onClick:()=>r(a),style:{flex:1,padding:"12px",borderRadius:"12px",background:"#3b82f6",color:"white",border:"none",cursor:"pointer",fontWeight:"bold"},children:"הורדת ZIP"})]})]},a.id))})]})}a.s(["default",()=>j])}];

//# sourceMappingURL=_606e69da._.js.map