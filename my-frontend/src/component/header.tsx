'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-gray-900 border-b shadow-sm sticky">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo ou Titre */}
       <Image
         src="/Tdp.png"
         alt='logo TDP'
         width={50}
         height={50}
       />

        {/* Liens Connexion / Inscription */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/auth/login" className="text-white hover:text-blue-600">
            Connexion
          </Link>
          <Link href="/auth/register" className="text-white hover:underline">
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
