import './globals.css';

export const metadata = {
  title: 'Feature Flag Client App',
  description: 'Sample client consuming feature flag system'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
