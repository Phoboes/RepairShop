// Rerenders every time
export default async function RSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="animate-appear">{children}</div>;
}
