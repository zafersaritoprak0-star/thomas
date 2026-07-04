export function TurkishFlagBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Field */}
        <rect width="1200" height="800" fill="#e30a17" />

        {/* Crescent: outer white circle minus inner red circle */}
        <circle cx="425" cy="400" r="200" fill="#ffffff" />
        <circle cx="475" cy="400" r="160" fill="#e30a17" />

        {/* Five-pointed star */}
        <polygon
          fill="#ffffff"
          points="752.0,400.0 686.4,421.3 686.4,490.3 645.8,434.5 580.1,455.9 620.7,400.0 580.1,344.1 645.8,365.5 686.4,309.7 686.4,378.7"
        />
      </svg>

      {/* Soft scrim so foreground content stays readable while the flag shows through */}
      <div className="absolute inset-0 bg-background/25" />
    </div>
  )
}
