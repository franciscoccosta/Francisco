/**
 * Shared SVG filter/gradient primitives used by MaterialSwatch and FurnitureArt
 * to build procedurally-lit textures (real feTurbulence/feDiffuseLighting noise,
 * not hand-drawn stripes). Mounted once in the root layout so every swatch on a
 * page reuses the same <defs> instead of re-declaring filters per instance.
 */
export function MaterialFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {/* Fibrous, lit texture — wood grain and (with a different base rect) brushed metal.
            Final feComposite clips the lit noise to the filtered element's own shape, so
            these can be applied to an arbitrary furniture-part path, not just a full rect. */}
        <filter id="mat-fiber-lit" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.32" numOctaves={4} seed={7} result="n" />
          <feDiffuseLighting in="n" surfaceScale="2.6" diffuseConstant="1.15" lightingColor="#ffffff" result="lit">
            <feDistantLight azimuth="235" elevation="48" />
          </feDiffuseLighting>
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        <filter id="mat-brushed-lit" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.015" numOctaves={2} seed={3} result="n" />
          <feDiffuseLighting in="n" surfaceScale="1.6" diffuseConstant="1.2" lightingColor="#ffffff" result="lit">
            <feDistantLight azimuth="100" elevation="62" />
          </feDiffuseLighting>
          <feComposite in="lit" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Mottled grayscale noise for glaze / fired-clay variation, two grain sizes */}
        <filter id="mat-mottle-fine" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={3} seed={11} result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
            result="gray"
          />
          <feComponentTransfer in="gray" result="contrasted">
            <feFuncR type="gamma" amplitude={1} exponent={2.1} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={2.1} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={2.1} offset={0} />
          </feComponentTransfer>
          <feComposite in="contrasted" in2="SourceGraphic" operator="in" />
        </filter>

        <filter id="mat-mottle-coarse" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={4} seed={19} result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
            result="gray"
          />
          <feComponentTransfer in="gray" result="contrasted">
            <feFuncR type="gamma" amplitude={1} exponent={1.6} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={1.6} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={1.6} offset={0} />
          </feComponentTransfer>
          <feComposite in="contrasted" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Thin swirling veins for natural stone */}
        <filter id="mat-veins" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.018 0.05" numOctaves={2} seed={4} result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"
            result="gray"
          />
          <feComponentTransfer in="gray" result="contrasted">
            <feFuncR type="gamma" amplitude={1} exponent={3.4} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={3.4} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={3.4} offset={0} />
          </feComponentTransfer>
          <feComposite in="contrasted" in2="SourceGraphic" operator="in" />
        </filter>

        <radialGradient id="mat-vignette" cx="50%" cy="42%" r="75%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </radialGradient>

        <linearGradient id="mat-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="mat-shadow-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
    </svg>
  );
}
