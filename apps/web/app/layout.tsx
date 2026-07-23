import TopBar from "@/components/top-bar";
import BottomNav from "@/components/bottom-nav";
import PageWrapper from "@/components/page-wrapper";
import StarField from "@/components/star-field";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/toast";
import { ThemeProvider } from "@/lib/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#030310" />
        <style>{`
          :root {
            --bg:#030310; --surface:rgba(14,14,36,0.75); --border:rgba(255,255,255,0.05);
            --gold:#ffd78a; --pink:#ff8ec7; --violet:#8f7cff; --cyan:#78dfff; --emerald:#74e4ae;
            --text:#f0edf6; --muted:#8a87a0; --safe:env(safe-area-inset-bottom,0px);
            --accent:#8f7cff; --accent-light:rgba(143,124,255,0.12);
          }
          @keyframes fadeUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-14px)}}
          @keyframes fadeIn{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
          @keyframes glowPulse{0%,100%{box-shadow:0 0 16px rgba(143,124,255,0.06)}50%{box-shadow:0 0 36px rgba(143,124,255,0.18)}}
          @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
          *{box-sizing:border-box;margin:0;padding:0}
          html,body{min-height:100dvh;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;overflow-x:hidden}
          body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 80% 50% at 20% 15%,rgba(143,124,255,0.06),transparent 50%),radial-gradient(ellipse 60% 40% at 80% 25%,rgba(255,142,199,0.05),transparent 50%),radial-gradient(ellipse 40% 30% at 50% 80%,rgba(120,223,255,0.04),transparent 50%)}
          body[data-char=luoyin]::before{background:radial-gradient(ellipse 60% 40% at 30% 20%,rgba(180,60,80,0.1),transparent 50%),radial-gradient(ellipse 40% 50% at 70% 60%,rgba(120,40,60,0.08),transparent 50%),radial-gradient(ellipse 50% 30% at 50% 90%,rgba(60,20,40,0.06),transparent 50%)!important}
          body[data-char=shenye]::before{background:radial-gradient(ellipse 60% 40% at 25% 25%,rgba(200,160,80,0.1),transparent 50%),radial-gradient(ellipse 40% 50% at 75% 55%,rgba(180,140,60,0.08),transparent 50%),radial-gradient(ellipse 50% 30% at 50% 85%,rgba(100,80,40,0.06),transparent 50%)!important}
          body[data-char=qinhuai]::before{background:radial-gradient(ellipse 60% 40% at 20% 30%,rgba(60,160,200,0.1),transparent 50%),radial-gradient(ellipse 40% 50% at 80% 50%,rgba(40,120,180,0.08),transparent 50%),radial-gradient(ellipse 50% 30% at 50% 80%,rgba(30,80,140,0.06),transparent 50%)!important}
          body[data-char=fuyanzhi]::before{background:radial-gradient(ellipse 60% 40% at 25% 20%,rgba(80,180,160,0.08),transparent 50%),radial-gradient(ellipse 40% 50% at 70% 60%,rgba(60,150,140,0.06),transparent 50%),radial-gradient(ellipse 50% 30% at 45% 85%,rgba(40,100,100,0.04),transparent 50%)!important}
          body[data-char=luoyin]{--accent:#c44a6a;--accent-light:rgba(196,74,106,0.12)}
          body[data-char=shenye]{--accent:#c89850;--accent-light:rgba(200,152,80,0.12)}
          body[data-char=qinhuai]{--accent:#4a9cc4;--accent-light:rgba(74,156,196,0.12)}
          body[data-char=fuyanzhi]{--accent:#50b4a0;--accent-light:rgba(80,180,160,0.12)}
          a{color:inherit;text-decoration:none}
          button,input,textarea{font-family:inherit;font-size:inherit}
          button{border:none;cursor:pointer;background:none;color:inherit;transition:all 0.1s ease}button:active{transform:scale(0.92)!important;opacity:0.7!important}
          input,textarea{outline:none;color:var(--text)}
          ::-webkit-scrollbar{display:none}
          @media(max-width:768px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}.stack-mobile{grid-template-columns:1fr!important}.grid-2-mobile{grid-template-columns:repeat(2,minmax(0,1fr))!important}h1{font-size:22px!important}h2{font-size:18px!important}input,textarea,button{font-size:16px!important}.card{padding:14px!important;border-radius:16px!important}}
        `}</style>
      </head>
      <body>
        <StarField />
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <TopBar />
              <PageWrapper>{children}</PageWrapper>
              <BottomNav />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
