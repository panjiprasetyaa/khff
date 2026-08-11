export async function generateStaticParams() {
  const { films } = await import("@/data/dummy");
  return Object.keys(films).map((id) => ({
    id: id,
  }));
}

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
