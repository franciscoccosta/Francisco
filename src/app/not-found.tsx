import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col justify-center pt-32 pb-20">
      <p className="eyebrow">404</p>
      <h1 className="display mt-6 text-6xl md:text-8xl">This piece has moved on.</h1>
      <p className="mt-6 max-w-md text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist — but plenty of wood with a past does.</p>
      <div className="mt-10">
        <Link href="/materials" className="btn btn-dark">
          Browse wood
        </Link>
      </div>
    </section>
  );
}
