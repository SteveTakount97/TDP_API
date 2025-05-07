//layout principal
import './globals.css';
import type { Metadata } from 'next';
import Header from '@/component/header';

export const metadata: Metadata = {
  title: 'TDP - Gestion de Tontine',
  description: 'Application de gestion de tontine entre membres',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children} </main> 
      </body>
    </html>
  );
}
