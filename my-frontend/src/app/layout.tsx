//layout principal
import './globals.css';
import type { Metadata } from 'next';
import Footer from '@/component/footer';

export const metadata: Metadata = {
  title: 'TDP - Gestion de Tontine',
  description: 'Application de gestion de tontine entre membres',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <main>{children} </main> 
        <Footer />
      </body>
    </html>
  );
}
