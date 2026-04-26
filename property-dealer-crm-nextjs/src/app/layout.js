import "./globals.css";

export const metadata = {
  title: "Property Dealer CRM",
  description:
    "A CRM system for property dealers to manage leads, agents, follow-ups, and analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}