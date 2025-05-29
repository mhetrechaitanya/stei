"use client"

export default function RotatingLogoSvg() {
  return (
    <div className="inline-block">
      <svg width="150" height="150" viewBox="0 0 150 150" className="animate-spin-slow">
        {/* Outer circle */}
        <circle cx="75" cy="75" r="70" fill="transparent" stroke="#D40F14" strokeWidth="3" />

        {/* STEI text in center */}
        <text
          x="75"
          y="75"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fontWeight="bold"
          fontFamily="serif"
        >
          STEI
        </text>

        {/* Circular text */}
        <text fontSize="10" fontWeight="bold" fontFamily="sans-serif" fill="black">
          <textPath href="#textCircle" textLength="430">
            EMPOWERING INDIVIDUALS
          </textPath>
        </text>

        {/* Hidden circle path for text to follow */}
        <circle id="textCircle" cx="75" cy="75" r="60" fill="none" stroke="none" />
      </svg>
    </div>
  )
}
