export default function Article({
  number,
  title,
  children,
  ammendment = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  ammendment?: boolean;
}) {
  return (
    <article id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-lg font-bold mt-2">
        {ammendment ? 'Amendment' : 'Article'} {number}: {title}
      </h2>
      {children}
    </article>
  );
}
