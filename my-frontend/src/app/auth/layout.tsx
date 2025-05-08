

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body>
          <div >{children}</div>
        </body>
      </html>
    );
  }
  