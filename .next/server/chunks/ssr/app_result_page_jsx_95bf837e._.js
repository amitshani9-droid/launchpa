module.exports=[3773,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(50944),e=a.i(49808);function f({data:a}){let[d,e]=(0,c.useState)(!0),[f,g]=(0,c.useState)("desktop");if(!a)return null;let h={fontSize:"1.8rem",fontWeight:"700",marginBottom:"15px",letterSpacing:"-0.02em",color:d?"#fff":"#1e293b"},i={fontSize:"1.125rem",lineHeight:"1.75",color:d?"rgba(255,255,255,0.85)":"#334155",fontWeight:"400"};return(0,b.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"},children:[(0,b.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",maxWidth:"900px",marginBottom:"20px"},children:[(0,b.jsxs)("button",{onClick:()=>e(!d),style:{padding:"8px 16px",borderRadius:"10px",background:d?"#2563eb":"#7c3aed",color:"white",fontWeight:"bold",border:"none",cursor:"pointer",transition:"all 0.2s"},children:["מצב ",d?"בהיר ☀️":"כהה 🌙"]}),(0,b.jsxs)("div",{style:{display:"flex",gap:"10px",background:"rgba(255,255,255,0.1)",padding:"5px",borderRadius:"10px"},children:[(0,b.jsx)("button",{onClick:()=>g("desktop"),style:{background:"desktop"===f?"rgba(255,255,255,0.2)":"transparent",border:"none",padding:"5px 10px",borderRadius:"6px",cursor:"pointer",color:"white"},children:"🖥️ דסקטופ"}),(0,b.jsx)("button",{onClick:()=>g("mobile"),style:{background:"mobile"===f?"rgba(255,255,255,0.2)":"transparent",border:"none",padding:"5px 10px",borderRadius:"6px",cursor:"pointer",color:"white"},children:"📱 מובייל"})]})]}),(0,b.jsx)("div",{style:{background:d?"#0f172a":"#ffffff",color:d?"white":"black",borderRadius:"24px",border:"1px solid rgba(255,255,255,0.1)",boxShadow:d?"0 0 50px rgba(0,0,0,0.5)":"0 20px 40px rgba(0,0,0,0.1)",width:"mobile"===f?"375px":"100%",maxWidth:"1000px",margin:"0 auto",transition:"all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",textAlign:"center",overflow:"hidden"},children:a.hero?(0,b.jsxs)("div",{style:{backgroundColor:a.style?.backgroundColor||"#fff",minHeight:"100%",direction:"rtl",borderRadius:"24px",overflow:"hidden"},children:[(0,b.jsxs)("nav",{style:{padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff"},children:[(0,b.jsx)("div",{style:{fontWeight:"bold",color:a.style?.primaryColor||"#6366f1",fontSize:"1.4rem"},children:"LaunchPage"}),(0,b.jsx)("button",{style:{backgroundColor:a.style?.primaryColor||"#6366f1",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:"bold",cursor:"pointer"},children:a.hero.cta})]}),(0,b.jsxs)("header",{style:{padding:"80px 20px",textAlign:"center"},children:[(0,b.jsx)("h1",{style:{fontSize:"3.5rem",fontWeight:"900",color:"#1e293b",marginBottom:"20px",lineHeight:1.1},children:a.hero.title}),(0,b.jsx)("p",{style:{fontSize:"1.3rem",color:"#475569",maxWidth:"700px",margin:"0 auto 30px"},children:a.hero.description})]}),(0,b.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"30px",padding:"0 40px 100px",textAlign:"right"},children:a.features?.map((c,d)=>(0,b.jsxs)("div",{style:{background:"#fff",padding:"30px",borderRadius:"20px",boxShadow:"0 10px 25px rgba(0,0,0,0.05)",border:"1px solid #f1f5f9"},children:[(0,b.jsx)("h3",{style:{color:a.style?.primaryColor||"#6366f1",marginBottom:"10px",fontSize:"1.25rem",fontWeight:"bold"},children:c.title}),(0,b.jsx)("p",{style:{color:"#64748b",lineHeight:1.6},children:c.desc})]},d))})]}):(0,b.jsxs)("div",{style:{padding:"mobile"===f?"40px 20px":"60px"},children:[(0,b.jsxs)("div",{style:{marginBottom:"60px"},children:[(0,b.jsx)("h1",{style:{fontSize:"mobile"===f?"2.5rem":"3.5rem",fontWeight:"800",letterSpacing:"-0.03em",lineHeight:"1.1",marginBottom:"20px",background:"linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 4px 20px rgba(96, 165, 250, 0.2))"},children:a.title}),(0,b.jsx)("p",{style:{fontSize:"mobile"===f?"1.1rem":"1.25rem",opacity:.9,marginBottom:"40px",lineHeight:"1.6",fontWeight:"400",maxWidth:"600px",marginLeft:"auto",marginRight:"auto"},children:a.subtitle}),(0,b.jsx)("button",{style:{padding:"18px 36px",background:"linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",border:"none",borderRadius:"50px",color:"white",fontWeight:"700",fontSize:"1.1rem",cursor:"pointer",boxShadow:"0 10px 25px -5px rgba(37, 99, 235, 0.5)",transition:"transform 0.2s"},children:a.cta_button||"התחל עכשיו"})]}),(0,b.jsx)("div",{style:{display:"grid",gridTemplateColumns:"mobile"===f?"1fr":"repeat(auto-fit, minmax(300px, 1fr))",gap:"30px",textAlign:"right"},children:a.sections?.map((a,c)=>(0,b.jsxs)("div",{style:{padding:"30px",background:d?"rgba(255,255,255,0.03)":"#f8fafc",borderRadius:"20px",border:d?"1px solid rgba(255,255,255,0.05)":"1px solid #e2e8f0"},children:[(0,b.jsx)("h2",{style:h,children:a.title}),(0,b.jsx)("p",{style:i,children:a.text})]},c))}),(0,b.jsxs)("div",{style:{marginTop:"80px",borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:"40px"},children:[(0,b.jsx)("p",{style:{opacity:.7,marginBottom:"15px",fontSize:"1.1rem"},children:a.cta_text}),(0,b.jsx)("button",{style:{padding:"14px 28px",background:d?"rgba(255,255,255,0.1)":"#e2e8f0",color:d?"white":"#0f172a",border:"none",borderRadius:"12px",fontWeight:"600",cursor:"pointer"},children:a.cta_button||"צור קשר"})]})]})})]})}var g=a.i(67836),h=a.i(36383);a.i(30485);var i=a.i(31052);a.i(69387);var j=a.i(60574),k=a.i(32108),l=a.i(7739),m=a.i(70179);function n(){let a=(0,d.useSearchParams)();(0,d.useRouter)();let n=a.get("p"),p=a.get("id"),{isPro:q}=(0,g.useUser)(),[r,s]=(0,c.useState)(null),[t,u]=(0,c.useState)(!0),[v,w]=(0,c.useState)(""),[x,y]=(0,c.useState)(""),[z,A]=(0,c.useState)(!1),[B,C]=(0,c.useState)(!1),[D,E]=(0,c.useState)(null),[F,G]=(0,c.useState)(!1);(0,c.useEffect)(()=>{if(!D)return;let a=(0,j.onSnapshot)((0,j.doc)(h.db,"users",D.uid),a=>{let b=a.data();b?.isPro&&!localStorage.getItem("notifiedPro")&&(G(!0),localStorage.setItem("notifiedPro","true"),alert("מזל טוב! 🎉 החשבון שלך שודרג ל-PRO. כל האתרים פתוחים כעת להורדה!"),setTimeout(()=>G(!1),8e3)),b&&E(a=>({...a,...b}))});return()=>a()},[D?.uid]),(0,c.useEffect)(()=>{let a=(0,i.onAuthStateChanged)(h.auth,async a=>{if(a){let b=await (0,h.handleUserSignIn)(a);E({...a,...b})}else E(null)});return()=>a()},[]);let H=()=>{window.open(`https://wa.me/972533407255?text=${encodeURIComponent("היי עמית, אני רוצה לשדרג ל-PRO באתר LaunchPage! 🚀")}`,"_blank")};function I(a,b){}let J=()=>{"LAUNCH2026"===x.toUpperCase()?(A(!0),alert("קופון הופעל! הנחה של 50% בחיוב מול עמית בוואטסאפ ✨")):alert("קופון לא בתוקף")},K=async a=>{if(D)try{await (0,j.addDoc)((0,j.collection)(h.db,"users",D.uid,"sites"),{title:a.hero?.title||a.title,content:a,createdAt:(0,j.serverTimestamp)()}),console.log("Site saved to Firestore!")}catch(a){console.error("Error saving site: ",a)}};async function L(){if("TEST_SIMULATION"===n){await new Promise(a=>setTimeout(a,800));let b=a.get("description")||a.get("prompt")||"העסק החדש שלי",c=[{primary:"#6366f1",bg:"#f8fafc"},{primary:"#059669",bg:"#f0fdf4"},{primary:"#2563eb",bg:"#eff6ff"},{primary:"#ef4444",bg:"#fef2f2"},{primary:"#f59e0b",bg:"#fffbeb"}],d=c[Math.floor(Math.random()*c.length)],e={hero:{title:b,description:`הפתרון המקצועי ביותר עבור ${b}. אנחנו כאן כדי לעזור לך לצמוח.`,cta:"צור קשר עכשיו"},features:[{title:"שירות אישי",desc:"מותאם בדיוק לצרכים של העסק שלך."},{title:"זמינות גבוהה",desc:"אנחנו כאן בשבילך 24/7 לכל שאלה."},{title:"תוצאות מוכחות",desc:"עוזרים לעסקים להצליח כבר מעל עשור."}],style:{primaryColor:d.primary,backgroundColor:d.bg},title:b,subtitle:`הפתרון המקצועי ביותר עבור ${b}. אנחנו כאן כדי לעזור לך לצמוח.`,sections:[{title:"שירות אישי",text:"מותאם בדיוק לצרכים של העסק שלך."},{title:"זמינות גבוהה",text:"אנחנו כאן בשבילך 24/7 לכל שאלה."}],cta_button:"צור קשר עכשיו",cta_text:"רוצה לשמוע עוד?",color_theme:"custom"};s(e),I("העסק החדש שלי"!==b?b:"סימולציה",e),K(e),u(!1);return}try{let a=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n})}),b=await a.json();if(!a.ok)return void w(b.error||"שגיאה ביצירת הדף");s(b),I(n,b),K(b)}catch(a){w("שגיאה בשרת. נסה שוב.")}finally{u(!1)}}(0,c.useEffect)(()=>{async function b(){if(u(!0),w(""),"true"===a.get("local"))try{let a=localStorage.getItem("generatedSite");if(a){let b=JSON.parse(a);s(b),I(b.hero?.title||"אתר חדש",b),K(b),u(!1);return}}catch(a){console.error("Local load failed",a)}if(p&&D){try{let a=(0,j.doc)(h.db,"users",D.uid,"sites",p),b=await (0,j.getDoc)(a);if(b.exists()){let a=b.data();s(a.content),u(!1);return}w("האתר לא נמצא")}catch(a){console.error("Error loading site:",a),w("שגיאה בטעינת האתר")}u(!1);return}n&&"true"!==a.get("local")&&L()}(D||n||a.get("local"))&&b()},[n,p,D,a]),(0,c.useEffect)(()=>{if(r){let a=setTimeout(()=>{q||C(!0)},3e3);return()=>clearTimeout(a)}},[r,q]);let M=async()=>{var a,b;let c,d,e,f,g,h,i;if(!q)return void C(!0);if(!r)return;let j=new l.default,k=(a=r,c=a.style?.primaryColor||"#2563eb",d=a.style?.backgroundColor||"#ffffff",e=a.hero?a.hero.title:a.title,f=a.hero?a.hero.description:a.subtitle,`
<!DOCTYPE html>
<html lang="he" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${e}</title>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet">
        <style>
            :root {--primary: ${c}; --bg: ${d}; }
            body {background-color: var(--bg); color: #1e293b; font-family: 'Heebo', sans-serif; margin: 0; padding: 0; line-height: 1.6; }
            .hero {padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
            h1 {color: var(--primary); font-size: 3rem; margin-bottom: 20px; font-weight: 900; }
            .features {display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; padding: 60px 20px; max-width: 1000px; margin: 0 auto; }
            .feature-card {background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: right; }
            .cta-btn {background: var(--primary); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; }
            footer { text-align: center; padding: 40px; border-top: 1px solid #e2e8f0; margin-top: 40px; }
        </style>
    </head>
    <body>
        <header class="hero">
            <h1>${e}</h1>
            <p style="font-size: 1.3rem; color: #475569; max-width: 700px; margin: 0 auto 30px;">${f}</p>
            <a href="#" class="cta-btn">${a.hero?a.hero.cta:a.cta_button||"צור קשר"}</a>
        </header>

        <main class="features">
            ${a.features?a.features.map(a=>`
                <div class="feature-card">
                    <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${a.title}</h3>
                    <p style="color: #64748b;">${a.desc}</p>
                </div>
            `).join(""):a.sections?.map(a=>`
                <div class="feature-card">
                    <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${a.title}</h3>
                    <p style="color: #64748b;">${a.text}</p>
                </div>
            `).join("")||""}
        </main>

        <footer>
            <p>Built with LaunchPage AI 🚀</p>
        </footer>
    </body>
</html>`.trim()),n=(b=r,g=b.style?.primaryColor||"#2563eb",h=b.style?.backgroundColor||"#ffffff",i=b.style?.backgroundColor==="#0f172a"?"#ffffff":"#0f172a",`
:root {
    --primary: ${g};
    --secondary: #7c3aed;
    --bg: ${h};
    --text: ${i};
    --surface: ${b.style?.backgroundColor==="#0f172a"?"rgba(255,255,255,0.05)":"#f1f5f9"};
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Heebo', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.hero {
    text-align: center;
    padding: 80px 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-bottom: 1px solid #cbd5e1;
    margin-bottom: 40px;
}

h1 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 20px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 30px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.content-section {
    margin-bottom: 40px;
    padding: 30px;
    background: var(--surface);
    border-radius: 20px;
}

h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: var(--primary);
}

.cta-button {
    display: inline-block;
    padding: 15px 30px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    text-decoration: none;
    font-weight: bold;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    transition: transform 0.2s;
}

.cta-button:hover {
    transform: scale(1.05);
}

.footer {
    text-align: center;
    padding: 60px 20px;
    background: #0f172a;
    color: white;
    margin-top: 60px;
}

.footer p {
    margin-bottom: 20px;
    font-size: 1.2rem;
}

@media (max-width: 600px) {
    h1 { font-size: 2.5rem; }
    .hero { padding: 50px 20px; }
}`.trim());j.file("index.html",k),j.file("style.css",n),j.file("README.txt","תודה שרכשת את האתר שלך דרך LaunchPage AI! 🚀");let o=await j.generateAsync({type:"blob"});(0,m.saveAs)(o,"landing-page.zip")};return t?(0,b.jsx)("div",{className:e.default.className,dir:"rtl",style:{minHeight:"100vh",background:"#05070a",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"},children:"מייצר את הדף שלך... 🚀"}):v?(0,b.jsxs)("div",{className:e.default.className,dir:"rtl",style:{minHeight:"100vh",background:"#05070a",color:"white",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"10px"},children:[(0,b.jsx)("p",{children:v}),(0,b.jsx)("p",{style:{opacity:.7},children:"נסה לחזור אחורה ולמלא שוב את הפרטים."})]}):r?(0,b.jsxs)("div",{className:e.default.className,dir:"rtl",style:{minHeight:"100vh",background:"#05070a",color:"white",display:"flex",flexDirection:"column"},children:[F&&(0,b.jsx)(k.default,{recycle:!1,numberOfPieces:500}),(0,b.jsxs)("div",{style:{display:"flex",flex:1,padding:"20px",gap:"20px"},children:[(0,b.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center"},children:[(0,b.jsx)(f,{data:r}),!q&&(0,b.jsx)("div",{style:{marginTop:"40px",textAlign:"center"},children:(0,b.jsx)("button",{onClick:()=>C(!0),style:{padding:"15px 30px",fontSize:"1.2rem",backgroundColor:"#22c55e",color:"white",borderRadius:"12px",border:"none",cursor:"pointer",fontWeight:"bold",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.4)"},children:"💎 שדרג ל-PRO והורד את הקוד המלא"})})]}),(0,b.jsxs)("div",{style:{width:"300px",background:"rgba(255,255,255,0.05)",borderRadius:"20px",padding:"20px",border:"1px solid rgba(255,255,255,0.1)",height:"fit-content"},children:[(0,b.jsx)("h3",{style:{marginBottom:"15px",fontSize:"1.3rem"},children:"אפשרויות"}),(0,b.jsxs)("button",{onClick:M,style:o,children:["הורדת ZIP (PRO)",!q&&(0,b.jsx)("span",{style:{fontSize:"0.8rem",marginRight:"5px"},children:"🔒"})]}),(0,b.jsx)("button",{onClick:()=>{let a=r.hero?r.hero.title:r.title,b=`תראו את האתר ש-AI בנה לי בשניות עבור: ${a}!`,c=window.location.href;window.open(`https://wa.me/?text=${encodeURIComponent(b+" "+c)}`,"_blank")},style:o,children:"שתף בוואטסאפ 💬"}),(0,b.jsx)("button",{style:o,children:"שמור לדשבורד"}),(0,b.jsx)("button",{style:o,children:"שכפל דף"}),(0,b.jsxs)("div",{style:{marginTop:"20px",borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:"15px"},children:[(0,b.jsx)("p",{style:{fontSize:"0.9rem",marginBottom:"8px"},children:"יש לך קופון?"}),(0,b.jsxs)("div",{style:{display:"flex",gap:"5px"},children:[(0,b.jsx)("input",{type:"text",placeholder:"קוד קופון",value:x,onChange:a=>y(a.target.value),style:{width:"100%",padding:"8px",borderRadius:"8px",border:"none",fontSize:"0.9rem"}}),(0,b.jsx)("button",{onClick:J,style:{background:"#2563eb",color:"white",border:"none",borderRadius:"8px",padding:"0 10px",fontWeight:"bold",cursor:"pointer"},children:"✓"})]}),z&&(0,b.jsx)("p",{style:{color:"#4ade80",fontSize:"0.8rem",marginTop:"5px"},children:"קופון פעיל: 50% הנחה!"})]}),!q&&(0,b.jsx)("button",{onClick:H,style:{width:"100%",marginTop:"20px",padding:"14px",background:"linear-gradient(135deg, #10b981, #059669)",border:"none",borderRadius:"12px",color:"white",fontWeight:"bold",cursor:"pointer",fontSize:"1rem",boxShadow:"0 4px 15px rgba(16, 185, 129, 0.4)"},children:"שדרג לחשבון PRO 🚀"})]}),B&&(0,b.jsx)("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,padding:"20px"},onClick:()=>C(!1),children:(0,b.jsxs)("div",{style:{background:"#1e293b",padding:"30px",borderRadius:"24px",textAlign:"right",color:"white",maxWidth:"500px",width:"100%",border:"2px solid #3b82f6",boxShadow:"0 0 20px rgba(59, 130, 246, 0.5)"},onClick:a=>a.stopPropagation(),children:[(0,b.jsx)("h2",{style:{fontSize:"1.8rem",textAlign:"center",marginBottom:"20px"},children:"🚀 שדרג ל-PRO וקבל את האתר שלך"}),(0,b.jsxs)("div",{style:{marginBottom:"25px",display:"flex",flexDirection:"column",gap:"15px"},children:[(0,b.jsxs)("p",{style:{display:"flex",alignItems:"center",gap:"10px",fontSize:"1.1rem"},children:["✅ ",(0,b.jsx)("b",{children:"קוד מקור מלא:"})," הורדת קובץ ZIP מוכן להעלאה לכל שרת."]}),(0,b.jsxs)("p",{style:{display:"flex",alignItems:"center",gap:"10px",fontSize:"1.1rem"},children:["✅ ",(0,b.jsx)("b",{children:"עיצוב רספונסיבי:"})," התאמה מושלמת למובייל, טאבלט ודסקטופ."]}),(0,b.jsxs)("p",{style:{display:"flex",alignItems:"center",gap:"10px",fontSize:"1.1rem"},children:["✅ ",(0,b.jsx)("b",{children:"עריכה חופשית:"})," אפשרות לשנות טקסטים, צבעים ותמונות בקוד."]}),(0,b.jsxs)("p",{style:{display:"flex",alignItems:"center",gap:"10px",fontSize:"1.1rem"},children:["✅ ",(0,b.jsx)("b",{children:"ללא פרסומות:"})," האתר נקי ממותג LaunchPage-AI."]}),(0,b.jsxs)("p",{style:{display:"flex",alignItems:"center",gap:"10px",fontSize:"1.1rem"},children:["✅ ",(0,b.jsx)("b",{children:"תמיכה אישית:"})," ליווי בוואטסאפ עד שהאתר באוויר."]})]}),(0,b.jsxs)("div",{style:{textAlign:"center",margin:"20px 0",padding:"15px",background:"rgba(34, 197, 94, 0.1)",borderRadius:"16px",border:"1px dashed #22c55e"},children:[(0,b.jsx)("p",{style:{fontSize:"0.9rem",color:"#94a3b8",textDecoration:"line-through",margin:0},children:"מחיר רגיל: ₪200"}),(0,b.jsxs)("div",{style:{display:"flex",alignItems:"baseline",justifyContent:"center",gap:"8px"},children:[(0,b.jsx)("span",{style:{fontSize:"2.5rem",fontWeight:"bold",color:"#22c55e"},children:"₪49"}),(0,b.jsx)("span",{style:{fontSize:"1rem",color:"#22c55e"},children:"בלבד"})]}),(0,b.jsx)("p",{style:{fontSize:"0.8rem",color:"#4ade80",marginTop:"5px",fontWeight:"bold"},children:"🔥 מבצע השקה חד-פעמי: מעל 75% הנחה!"})]}),(0,b.jsxs)("div",{style:{background:"rgba(255,255,255,0.05)",padding:"15px",borderRadius:"15px",marginBottom:"20px"},children:[(0,b.jsx)("p",{style:{fontSize:"0.9rem",color:"#94a3b8",marginBottom:"10px"},children:"יש לך קופון הנחה?"}),(0,b.jsxs)("div",{style:{display:"flex",gap:"10px"},children:[(0,b.jsx)("input",{type:"text",placeholder:"הזן קוד...",value:x,onChange:a=>y(a.target.value),style:{flex:1,padding:"10px",borderRadius:"8px",border:"none",color:"black"}}),(0,b.jsx)("button",{onClick:J,style:{background:"#3b82f6",color:"white",padding:"10px 15px",borderRadius:"8px",border:"none",cursor:"pointer"},children:"הפעל"})]}),z&&(0,b.jsx)("p",{style:{color:"#4ade80",fontSize:"0.8rem",marginTop:"10px",fontWeight:"bold"},children:"קופון פעיל: 50% הנחה!"})]}),(0,b.jsx)("button",{onClick:H,style:{background:"#22c55e",width:"100%",padding:"15px",borderRadius:"12px",border:"none",color:"white",fontWeight:"bold",fontSize:"1.2rem",cursor:"pointer",boxShadow:"0 4px 15px rgba(34, 197, 94, 0.4)"},children:"💬 שדרג עכשיו בוואטסאפ"}),(0,b.jsx)("button",{onClick:()=>C(!1),style:{width:"100%",background:"transparent",border:"none",color:"#64748b",marginTop:"10px",cursor:"pointer"},children:"אולי מאוחר יותר"})]})})]})]}):null}let o={width:"100%",padding:"14px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",color:"white",fontWeight:"bold",marginBottom:"12px",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",gap:"5px"};function p(){return(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)("div",{className:e.default.className,dir:"rtl",style:{minHeight:"100vh",background:"#05070a",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"},children:"טוען... 🚀"}),children:(0,b.jsx)(n,{})})}a.s(["default",()=>p],3773)}];

//# sourceMappingURL=app_result_page_jsx_95bf837e._.js.map