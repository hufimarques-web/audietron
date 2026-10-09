import './globals.css';
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://127.0.0.1:3000')),
  title: 'Audi e-tron Sportback 50 quattro S line | 33 000 € · Aveiro',
  description: 'Audi e-tron Sportback 50 quattro S line preto. 07/2022, 30 000 km, 313 cv. Descubra o exterior, o interior e as fotografias reais. Disponível em Aveiro por 33 000 €.',
  openGraph: {title: 'Audi e-tron Sportback. O teu próximo capítulo.',description:'07/2022 · 30 000 km · 33 000 € · Aveiro',images:[{url:'/media/real-front.jpg',width:960,height:1280,alt:'Audi e-tron Sportback preto'}],locale:'pt_PT',type:'website'},
  robots: {index: false, follow: false},
};
export default function RootLayout({ children }) {
  return <html lang="pt-PT"><body>{children}</body></html>;
}
