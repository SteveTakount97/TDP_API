// components/BackLink.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackLink() {
  return (
    <Link
      href="/acceuil"
      className="flex items-center text-black hover:underline absolute top-4 left-4"
    >
      <ArrowLeft className="w-5 h-5 mr-1" />
      Retour
    </Link>
  );
}
