import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono, Space_Mono } from 'next/font/google';
import '../index.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#F8F6F8',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: '[AETHER // 01] Cloud to Silicon Portfolio',
  description:
    'Software Engineer × Applied AI/ML Specialist. Orchestrating hyper-scale distributed infrastructure, low-level hardware optimization, and foundational neural networks with architectural clarity.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☀️</text></svg>",
  },
  openGraph: {
    title: '[AETHER // 01] Cloud to Silicon Portfolio',
    description: 'Architecting Systems from Cloud to Silicon.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${spaceMono.variable}`}
    >
      <body className="bg-alabaster text-obsidian font-sans antialiased overflow-x-hidden selection:bg-sun-gold selection:text-white">
        {children}
      </body>
    </html>
  );
}
