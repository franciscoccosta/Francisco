import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col items-start justify-center px-5 pt-18 md:px-10">
      <p className="eyebrow text-wood">404</p>
      <h1 className="display mt-4 text-6xl md:text-8xl">This page has no past — or future.</h1>
      <ButtonLink href="/materials" className="mt-10">
        Browse reclaimed wood
      </ButtonLink>
    </div>
  );
}
