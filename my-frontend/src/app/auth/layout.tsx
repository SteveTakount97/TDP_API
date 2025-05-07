

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body className="to-purple-600 bg-gradient-to-r ">
          <div >{children}</div>
        </body>
      </html>
    );
  }
  