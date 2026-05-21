"use client";

import React from "react";
import styles from "./ZodiacWheel.module.css";

export default function ZodiacWheel() {
  // 12 zodiac symbols mapped to their exact center angles (in degrees, 0 = 3 o'clock)
  // Ordered to match the counter-clockwise layout in the reference image
  const symbols = [
    { char: "♊", angle: 15, name: "gemini" },
    { char: "♉", angle: 45, name: "taurus" },
    { char: "♈", angle: 75, name: "aries" },
    { char: "♓", angle: 105, name: "pisces" },
    { char: "♒", angle: 135, name: "aquarius" },
    { char: "♑", angle: 165, name: "capricorn" },
    { char: "♐", angle: 195, name: "sagittarius" },
    { char: "♏", angle: 225, name: "scorpio" },
    { char: "♎", angle: 255, name: "libra" },
    { char: "♍", angle: 285, name: "virgo" },
    { char: "♌", angle: 315, name: "leo" },
    { char: "♋", angle: 345, name: "cancer" }
  ];

  // Coordinates for the 6 outer nodes of the hexagram (radius = 120)
  const hexRadius = 120;
  const hexNodes = Array.from({ length: 6 }).map((_, i) => {
    const angle = i * 60; // 0, 60, 120, 180, 240, 300
    const rad = (angle * Math.PI) / 180;
    return {
      x: 250 + hexRadius * Math.cos(rad),
      y: 250 + hexRadius * Math.sin(rad),
      angle
    };
  });

  // Calculate spokes (zodiac dividers) - going from r=165 to r=220
  const spokes = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30; // 0, 30, 60, ...
    const rad = (angle * Math.PI) / 180;
    return {
      x1: 250 + 165 * Math.cos(rad),
      y1: 250 + 165 * Math.sin(rad),
      x2: 250 + 220 * Math.cos(rad),
      y2: 250 + 220 * Math.sin(rad)
    };
  });

  // Generate all connection lines for Metatron's Cube (connect every node to every other node)
  const cubeLines = [];
  for (let i = 0; i < hexNodes.length; i++) {
    for (let j = i + 1; j < hexNodes.length; j++) {
      cubeLines.push({
        x1: hexNodes[i].x,
        y1: hexNodes[i].y,
        x2: hexNodes[j].x,
        y2: hexNodes[j].y
      });
    }
    // Also connect to center
    cubeLines.push({
      x1: hexNodes[i].x,
      y1: hexNodes[i].y,
      x2: 250,
      y2: 250
    });
  }

  // Tiny text decorations positioned along lines for esotericism detail
  const annotations = [
    { text: "ASCENDANT", x: 250, y: 155, rotate: 0 },
    { text: "DESCENDANT", x: 250, y: 345, rotate: 0 },
    { text: "MEDIUM COELI", x: 155, y: 250, rotate: 90 },
    { text: "IMUM COELI", x: 345, y: 250, rotate: 90 },
    { text: "KARMA", x: 190, y: 190, rotate: 45 },
    { text: "DESTINY", x: 310, y: 310, rotate: 45 }
  ];

  return (
    <div className={styles.wheelWrapper}>
      <svg
        viewBox="0 0 500 500"
        className={styles.wheelSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Dotted Outer Ring */}
        <circle cx="250" cy="250" r="235" className={styles.dottedOuter} />
        
        {/* 2. Double Solid Outer Ring */}
        <circle cx="250" cy="250" r="225" className={styles.outerRim} />
        <circle cx="250" cy="250" r="220" className={styles.outerRimSecondary} />
        
        {/* 3. Inner Zodiac Boundary Ring */}
        <circle cx="250" cy="250" r="165" className={styles.innerRim} />

        {/* 4. Division Spokes ( terminate at boundaries, do not enter center ) */}
        {spokes.map((spoke, idx) => (
          <line
            key={idx}
            x1={spoke.x1}
            y1={spoke.y1}
            x2={spoke.x2}
            y2={spoke.y2}
            className={styles.spoke}
          />
        ))}

        {/* 5. Concentric Guideline Rings Inside */}
        <circle cx="250" cy="250" r="145" className={styles.guideline} />
        <circle cx="250" cy="250" r="95" className={styles.guideline} />
        <circle cx="250" cy="250" r="45" className={styles.centerRim} />

        {/* 6. Metatron's Cube Geometry Lines */}
        {cubeLines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className={styles.sacredLine}
          />
        ))}

        {/* 7. Symmetrical Overlapping Circles centered at hexagram points */}
        {hexNodes.map((node, idx) => (
          <circle
            key={idx}
            cx={node.x}
            cy={node.y}
            r="38"
            className={styles.nodeCircle}
          />
        ))}

        {/* Center core decoration */}
        <circle cx="250" cy="250" r="18" className={styles.guideline} />
        <circle cx="250" cy="250" r="3" className={styles.centerDot} />

        {/* 8. Esoteric Annotation text */}
        {annotations.map((ann, idx) => (
          <text
            key={idx}
            x={ann.x}
            y={ann.y}
            transform={`rotate(${ann.rotate}, ${ann.x}, ${ann.y})`}
            className={styles.annotationText}
            textAnchor="middle"
          >
            {ann.text}
          </text>
        ))}

        {/* 9. Tangent-Aligned Outward Facing Zodiac Glyphs */}
        {symbols.map((sym, idx) => {
          const rad = (sym.angle * Math.PI) / 180;
          const r = 192.5; // center of the band (165 to 220)
          const x = 250 + r * Math.cos(rad);
          const y = 250 + r * Math.sin(rad);

          // Rotate by (angle + 90) so characters align tangent to the circle path
          // We apply the rotation around the specific (x, y) point of the character
          const rotationAngle = sym.angle + 90;

          return (
            <g
              key={idx}
              transform={`translate(${x}, ${y}) rotate(${rotationAngle})`}
            >
              <text
                x="0"
                y="6" // Offset baseline for perfect vertical centering in the band
                className={styles.zodiacChar}
                textAnchor="middle"
              >
                {sym.char}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
