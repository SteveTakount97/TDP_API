// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo / Description */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-2">TDP</h3>
          <p>
            Plateforme moderne pour la gestion sécurisée de vos tontines. Simple, transparente et accessible.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h4 className="text-white font-semibold mb-2">Navigation</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Accueil</Link></li>
            <li><Link href="/auth/login" className="hover:underline">Connexion</Link></li>
            <li><Link href="/auth/register" className="hover:underline">Inscription</Link></li>
          </ul>
        </div>

        {/* Ressources (à adapter plus tard) */}
        <div>
          <h4 className="text-white font-semibold mb-2">Ressources</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Aide</Link></li>
            <li><Link href="#" className="hover:underline">Mentions légales</Link></li>
            <li><Link href="#" className="hover:underline">Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p>Email : contact@tdp.app</p>
          <p>Tél : +33 6 12 34 56 78</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} TDP. Tous droits réservés.
      </div>
    </footer>
  );
}
