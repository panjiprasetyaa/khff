export async function generateStaticParams() {
  const { programs } = await import("@/data/dummy");
  const customIds = ["kompetisi", "non-kompetisi", "non-pemutaran"];
  const programIds = programs.map((p) => p.id);
  const allIds = Array.from(new Set([...customIds, ...programIds]));
  
  return allIds.map((id) => ({
    id: id,
  }));
}

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
