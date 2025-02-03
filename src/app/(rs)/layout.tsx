import Header from "@/components/Header";

export default async function RSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="animate-slide mx-auto max-w-7xl w-full">
      <Header />
      <div className="px-4 px-2">{children}</div>
    </div>
  );
}
