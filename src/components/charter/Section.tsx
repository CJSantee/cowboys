export default function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-md font-semibold mt-2">
        Section {number} — {title}
      </h3>
      {children}
    </section>
  );
}
