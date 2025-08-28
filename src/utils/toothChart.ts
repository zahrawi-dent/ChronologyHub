import type { ToothData } from "../data/toothData";

// export const getToothsByPosition = (teeth: ToothData[], position: 'maxillary' | 'mandibular') => {
//   const positionTeeth = teeth.filter(tooth => tooth.position === position);
//
//   if (position === 'maxillary') {
//     // already correct
//     const rightSide = positionTeeth
//       .filter(tooth => tooth.side === 'right')
//       .sort((a, b) => parseInt(a.notation.universal) - parseInt(b.notation.universal));
//
//     const leftSide = positionTeeth
//       .filter(tooth => tooth.side === 'left')
//       .sort((a, b) => parseInt(a.notation.universal) - parseInt(b.notation.universal));
//
//     return [...rightSide, ...leftSide];
//   } else {
//     // Mandibular (Lower): mirror so 32→25 | 24→17
//     const order = (t: ToothData) =>
//       t.type === 'permanent'
//         ? parseInt(t.notation.universal)
//         : t.notation.universal.charCodeAt(0);
//
//     const rightSide = positionTeeth
//       .filter(t => t.side === 'right')
//       .sort((a, b) => order(b) - order(a)); // 32 → 25
//
//     const leftSide = positionTeeth
//       .filter(t => t.side === 'left')
//       .sort((a, b) => order(b) - order(a)); // 24 → 17
//
//     return [...rightSide, ...leftSide];
//   }
// };

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
