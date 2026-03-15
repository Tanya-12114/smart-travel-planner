export default function PageHeader({ eyebrow, title }) {
  return (
    <div className="mb-10">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1
        className="page-title"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
}