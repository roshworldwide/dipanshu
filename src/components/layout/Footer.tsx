import { footer } from "@/content/site";

export function Footer() {
  return (
    <footer className="hairline-t bg-bg-base">
      <div className="container-x flex flex-col gap-3 py-rhythm-sm md:flex-row md:items-center md:justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-fg-tertiary">
          {footer.copyright}
        </p>
        <ul className="flex items-center text-[11px] uppercase tracking-[0.2em] text-fg-tertiary">
          {footer.links.map((label, i) => (
            <li key={label} className="flex items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mx-3 inline-block h-3 w-px bg-border-strong"
                />
              )}
              <a
                href="#"
                className="transition-colors duration-200 ease-standard hover:text-fg-primary"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
