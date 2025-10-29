
import Navigation from '@/components/Navigation';
import Providers from '@/components/Providers';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // `params` may be a Promise in some Next.js versions; await it before accessing properties
  const resolved = await params;
  const { locale } = resolved as { locale: string };
  // Load locale messages on the server and pass them to the client provider
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages}>
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}