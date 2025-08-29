import type { ToothData } from "../data/toothData";

export const getToothsByPosition = (
  teeth: ToothData[],
  position: 'maxillary' | 'mandibular'
) => {
  const positionTeeth = teeth.filter(tooth => tooth.position === position);

  // Anatomical position mapping for proper dental arch placement
  // This ensures teeth are positioned correctly during mixed dentition
  const getAnatomicalPosition = (tooth: ToothData): number => {
    const { type, category, side } = tooth;
    
    // Base position based on tooth category and side
    let basePosition = 0;
    
    if (position === 'maxillary') {
      // Maxillary (Upper) arch
      if (side === 'right') {
        // Right side: Central Incisor (1) at midline to Third Molar (8) at far right
        switch (category) {
          case 'incisor':
            if (tooth.name.includes('Central')) basePosition = 1;
            else if (tooth.name.includes('Lateral')) basePosition = 2;
            break;
          case 'canine': basePosition = 3; break;
          case 'premolar':
            if (tooth.name.includes('First')) basePosition = 4;
            else if (tooth.name.includes('Second')) basePosition = 5;
            break;
          case 'molar':
            if (tooth.name.includes('First')) basePosition = 6;
            else if (tooth.name.includes('Second')) basePosition = 7;
            else if (tooth.name.includes('Third')) basePosition = 8;
            break;
        }
      } else {
        // Left side: Central Incisor (9) at midline to Third Molar (16) at far left
        switch (category) {
          case 'incisor':
            if (tooth.name.includes('Central')) basePosition = 9;
            else if (tooth.name.includes('Lateral')) basePosition = 10;
            break;
          case 'canine': basePosition = 11; break;
          case 'premolar':
            if (tooth.name.includes('First')) basePosition = 12;
            else if (tooth.name.includes('Second')) basePosition = 13;
            break;
          case 'molar':
            if (tooth.name.includes('First')) basePosition = 14;
            else if (tooth.name.includes('Second')) basePosition = 15;
            else if (tooth.name.includes('Third')) basePosition = 16;
            break;
        }
      }
    } else {
      // Mandibular (Lower) arch
      if (side === 'right') {
        // Right side: Central Incisor (25) at midline to Third Molar (32) at far right
        switch (category) {
          case 'incisor':
            if (tooth.name.includes('Central')) basePosition = 25;
            else if (tooth.name.includes('Lateral')) basePosition = 26;
            break;
          case 'canine': basePosition = 27; break;
          case 'premolar':
            if (tooth.name.includes('First')) basePosition = 28;
            else if (tooth.name.includes('Second')) basePosition = 29;
            break;
          case 'molar':
            if (tooth.name.includes('First')) basePosition = 30;
            else if (tooth.name.includes('Second')) basePosition = 31;
            else if (tooth.name.includes('Third')) basePosition = 32;
            break;
        }
      } else {
        // Left side: Central Incisor (24) at midline to Third Molar (17) at far left
        // Use relative positions (1-8) that increase from midline outward
        switch (category) {
          case 'incisor':
            if (tooth.name.includes('Central')) basePosition = 1; // Corresponds to 24
            else if (tooth.name.includes('Lateral')) basePosition = 2; // Corresponds to 23
            break;
          case 'canine': basePosition = 3; // Corresponds to 22
            break;
          case 'premolar':
            if (tooth.name.includes('First')) basePosition = 4; // Corresponds to 21
            else if (tooth.name.includes('Second')) basePosition = 5; // Corresponds to 20
            break;
          case 'molar':
            if (tooth.name.includes('First')) basePosition = 6; // Corresponds to 19
            else if (tooth.name.includes('Second')) basePosition = 7; // Corresponds to 18
            else if (tooth.name.includes('Third')) basePosition = 8; // Corresponds to 17
            break;
        }
      }
    }
    
    // Handle primary vs permanent tooth positioning
    if (type === 'primary') {
      // Primary teeth get their normal position
      // No offset needed - they occupy their natural position
    } else {
      // Permanent teeth positioning
      if (category === 'molar') {
        // Permanent molars erupt behind primary molars
        // Add a large offset to position them behind
        basePosition += 100;
      } else if (category === 'premolar') {
        // Permanent premolars replace primary molars in the same position
        // Add a small offset to ensure they appear after primary molars
        basePosition += 0.1;
      } else {
        // Permanent incisors and canines replace primary ones in the same position
        // Add a small offset to ensure they appear after primary teeth
        basePosition += 0.1;
      }
    }
    
    return basePosition;
  };

  if (position === 'maxillary') {
    // Maxillary (Upper): right → left
    // Right side: Central Incisor (1) at midline to Third Molar (8) at far right
    const rightSide = positionTeeth
      .filter(t => t.side === 'right')
      .sort((a, b) => getAnatomicalPosition(a) - getAnatomicalPosition(b));

    // Left side: Central Incisor (9) at midline to Third Molar (16) at far left  
    const leftSide = positionTeeth
      .filter(t => t.side === 'left')
      .sort((a, b) => getAnatomicalPosition(a) - getAnatomicalPosition(b));

    return [...rightSide, ...leftSide];
  } else {
    // Mandibular (Lower): right → left
    const rightSide = positionTeeth
      .filter(t => t.side === 'right')
      .sort((a, b) => getAnatomicalPosition(b) - getAnatomicalPosition(a));

    const leftSide = positionTeeth
      .filter(t => t.side === 'left')
      .sort((a, b) => getAnatomicalPosition(a) - getAnatomicalPosition(b));

    return [...rightSide, ...leftSide];
  }
};
