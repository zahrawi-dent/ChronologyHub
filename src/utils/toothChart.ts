import type { ToothData } from "../data/toothData";


export const getToothsByPosition = (
  teeth: ToothData[],
  position: 'maxillary' | 'mandibular'
) => {
  const positionTeeth = teeth.filter(tooth => tooth.position === position);

  // Universal order helper (works for permanent & primary)
  const getUniversalOrder = (tooth: ToothData): number => {
    if (tooth.type === 'permanent') {
      return parseInt(tooth.notation.universal);
    } else {
      // Primary teeth: A=1 … T=20
      return tooth.notation.universal.charCodeAt(0) - 64;
    }
  };

  if (position === 'maxillary') {
    // Maxillary (Upper):  right → left
    const rightSide = positionTeeth
      .filter(t => t.side === 'right')
      .sort((a, b) => getUniversalOrder(a) - getUniversalOrder(b));
    // Permanent: 1→8 | Primary: A→E

    const leftSide = positionTeeth
      .filter(t => t.side === 'left')
      .sort((a, b) => getUniversalOrder(a) - getUniversalOrder(b));
    // Permanent: 9→16 | Primary: F→J

    return [...rightSide, ...leftSide];
  } else {
    // Mandibular (Lower): right → left
    const rightSide = positionTeeth
      .filter(t => t.side === 'right')
      .sort((a, b) => getUniversalOrder(b) - getUniversalOrder(a));
    // Permanent: 32→25 | Primary: O→K

    const leftSide = positionTeeth
      .filter(t => t.side === 'left')
      .sort((a, b) => getUniversalOrder(b) - getUniversalOrder(a));
    // Permanent: 24→17 | Primary: P→T

    return [...rightSide, ...leftSide];
  }
};
