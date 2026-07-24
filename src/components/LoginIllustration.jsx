export default function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 600 640"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
      role="img"
      aria-label="Ilustración de una escuela bajo un cielo soleado"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FC2F5" />
          <stop offset="100%" stopColor="#DDEEFE" />
        </linearGradient>
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FD187" />
          <stop offset="100%" stopColor="#2ECC71" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="600" height="640" fill="url(#sky)" />

      {/* sol */}
      <circle cx="500" cy="90" r="46" fill="#F1C40F" opacity="0.95" />

      {/* arcoíris */}
      <g fill="none" strokeLinecap="round">
        <path d="M40 260 A160 160 0 0 1 360 260" stroke="#FF6B9D" strokeWidth="10" />
        <path d="M55 260 A145 145 0 0 1 345 260" stroke="#F1C40F" strokeWidth="10" />
        <path d="M70 260 A130 130 0 0 1 330 260" stroke="#4A90E2" strokeWidth="10" />
      </g>

      {/* nubes */}
      <g fill="#FFFFFF" opacity="0.9">
        <ellipse cx="120" cy="120" rx="46" ry="26" />
        <ellipse cx="155" cy="108" rx="34" ry="22" />
        <ellipse cx="90" cy="108" rx="28" ry="18" />

        <ellipse cx="430" cy="200" rx="38" ry="20" />
        <ellipse cx="460" cy="190" rx="26" ry="16" />
      </g>

      {/* colina */}
      <path d="M0 480 Q300 400 600 480 L600 640 L0 640 Z" fill="url(#hill)" />

      {/* escuela */}
      <g transform="translate(180,300)">
        <rect x="0" y="80" width="240" height="150" rx="6" fill="#FFFFFF" />
        <polygon points="-10,80 250,80 120,10" fill="#FF6B9D" />
        <rect x="105" y="140" width="30" height="90" rx="4" fill="#4A90E2" />
        <circle cx="128" cy="185" r="3" fill="#F1C40F" />

        <rect x="24" y="120" width="42" height="42" rx="6" fill="#9EE6C4" stroke="#2ECC71" strokeWidth="4" />
        <rect x="174" y="120" width="42" height="42" rx="6" fill="#9EE6C4" stroke="#2ECC71" strokeWidth="4" />
        <rect x="24" y="176" width="42" height="34" rx="6" fill="#BBD8FA" stroke="#4A90E2" strokeWidth="4" />
        <rect x="174" y="176" width="42" height="34" rx="6" fill="#BBD8FA" stroke="#4A90E2" strokeWidth="4" />

        <rect x="112" y="-6" width="16" height="30" fill="#9B59B6" />
        <polygon points="128,-6 128,14 158,4" fill="#FF8C42" />
      </g>

      {/* arbolitos */}
      <g>
        <circle cx="90" cy="470" r="34" fill="#2ECC71" />
        <rect x="83" y="490" width="14" height="34" fill="#B07A46" />
        <circle cx="520" cy="480" r="30" fill="#2ECC71" />
        <rect x="514" y="498" width="12" height="30" fill="#B07A46" />
      </g>

      {/* estrellitas decorativas */}
      <g fill="#F1C40F">
        <circle cx="260" cy="150" r="4" />
        <circle cx="300" cy="180" r="3" />
        <circle cx="240" cy="200" r="3" />
      </g>
    </svg>
  )
}
