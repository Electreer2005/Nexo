export default function PageIntro({ eyebrow, title, children }) {
  return <section className="page-intro"><span className="kicker">{eyebrow}</span><h1>{title}</h1>{children && <p>{children}</p>}</section>;
}
