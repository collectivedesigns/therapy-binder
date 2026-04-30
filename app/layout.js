export const metadata = {
  title: "Therapy Binder",
  description: "AI-generated therapy materials for children ages 6-11",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
