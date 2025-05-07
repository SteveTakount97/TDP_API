'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg- border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo ou Titre */}
        <h1 className="text-xl font-bold">TDP</h1>

        {/* Liens Connexion / Inscription */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
            Connexion
          </Link>
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Inscription
          </Link>
        </nav>

        {/* Icone Menu Burger (mobile / dashboard) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700"
          aria-label="Ouvrir le menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu déroulant Dashboard (simple version) */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t px-4 py-3">
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/dashboard" className="block py-2 text-gray-800 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/auth/login/LoginPage" className="block py-2 text-gray-800 hover:text-blue-600">
                Connexion
              </Link>
            </li>
            <li>
              <Link href="/auth/register/registerPage" className="block py-2 text-gray-800 hover:text-blue-600">
                Inscription
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
