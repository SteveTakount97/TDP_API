export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body className="bg-black min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </body>
      </html>
    );
  }
  