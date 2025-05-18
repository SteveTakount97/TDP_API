'use client'

import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'


const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // directement au montage du composant
  useEffect(() => {
    const token = localStorage.getItem('token') 
    setIsAuthenticated(!!token)
  }, [])

  const logout = () => {
    localStorage.removeItem('token') 
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    router.push('/');
  }

  return { isAuthenticated, logout }
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-gray-900 border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Image
          src="/Tdp.png"
          alt="logo TDP"
          width={50}
          height={50}
        />

        {/* Navigation principale (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link href="/acceuil" className="text-white hover:text-blue-600">
                Mon espace
              </Link>
              <button onClick={logout} className="text-white hover:text-red-500">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white hover:text-blue-600">
                Connexion
              </Link>
              <Link href="/auth/register" className="text-white hover:underline">
                Inscription
              </Link>
            </>
          )}
        </nav>

        {/* Bouton menu burger (mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Ouvrir le menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t px-4 py-3">
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/dashboard" className="block py-2 text-gray-800 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 text-gray-800 hover:text-red-500"
                >
                  Déconnexion
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/auth/login" className="block py-2 text-gray-800 hover:text-blue-600">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="block py-2 text-gray-800 hover:text-blue-600">
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
