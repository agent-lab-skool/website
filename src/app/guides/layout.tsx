export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-x-hidden bg-background">
        <div className="mx-auto max-w-3xl px-6 pt-12 pb-20">
          {children}
        </div>
      </div>
    </main>
  );
}
