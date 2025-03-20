// NepalCoordinates.ts
// A database of coordinates for Nepal's administrative divisions

export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface LocationData {
    coordinates: Coordinates;
    type: 'province' | 'district' | 'municipality' | 'rural_municipality' | 'ward';
    parent?: string; // Reference to parent (e.g., district for a municipality)
  }
  
  // Main database of coordinates
  const NEPAL_LOCATIONS: Record<string, LocationData> = {
    // ===== PROVINCES =====
    'KARNALI PROVINCE': { coordinates: { latitude: 29.2815, longitude: 82.1843 }, type: 'province' },
    'PROVINCE 1': { coordinates: { latitude: 27.1625, longitude: 87.0718 }, type: 'province' },
    'PROVINCE 2': { coordinates: { latitude: 26.7909, longitude: 85.9000 }, type: 'province' },
    'BAGMATI PROVINCE': { coordinates: { latitude: 27.7172, longitude: 85.3240 }, type: 'province' },
    'GANDAKI PROVINCE': { coordinates: { latitude: 28.2622, longitude: 83.9729 }, type: 'province' },
    'LUMBINI PROVINCE': { coordinates: { latitude: 27.8318, longitude: 83.2993 }, type: 'province' },
    'SUDURPASHCHIM PROVINCE': { coordinates: { latitude: 29.3017, longitude: 80.9386 }, type: 'province' },
    'MADHESH PROVINCE': { coordinates: { latitude: 26.7909, longitude: 85.9000 }, type: 'province' },
    'KOSHI PROVINCE': { coordinates: { latitude: 27.1625, longitude: 87.0718 }, type: 'province' },
    
    // ===== DISTRICTS =====
    // Koshi Province Districts
    'TAPLEJUNG': { coordinates: { latitude: 27.3539, longitude: 87.6717 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'SANKHUWASABHA': { coordinates: { latitude: 27.6141, longitude: 87.1403 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'SOLUKHUMBU': { coordinates: { latitude: 27.7909, longitude: 86.7130 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'OKHALDHUNGA': { coordinates: { latitude: 27.3209, longitude: 86.5045 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'KHOTANG': { coordinates: { latitude: 27.0309, longitude: 86.8309 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'BHOJPUR': { coordinates: { latitude: 27.1750, longitude: 87.0511 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'DHANKUTA': { coordinates: { latitude: 26.9835, longitude: 87.3214 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'TERHATHUM': { coordinates: { latitude: 27.1326, longitude: 87.5400 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'PANCHTHAR': { coordinates: { latitude: 27.2036, longitude: 87.8156 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'ILAM': { coordinates: { latitude: 26.9091, longitude: 87.9298 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'JHAPA': { coordinates: { latitude: 26.6452, longitude: 87.8942 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'MORANG': { coordinates: { latitude: 26.6799, longitude: 87.4604 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'SUNSARI': { coordinates: { latitude: 26.6276, longitude: 87.1600 }, type: 'district', parent: 'KOSHI PROVINCE' },
    'UDAYAPUR': { coordinates: { latitude: 26.9492, longitude: 86.7679 }, type: 'district', parent: 'KOSHI PROVINCE' },
    
    // Madhesh Province Districts
    'SAPTARI': { coordinates: { latitude: 26.6192, longitude: 86.7489 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'SIRAHA': { coordinates: { latitude: 26.7024, longitude: 86.2123 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'DHANUSHA': { coordinates: { latitude: 26.8350, longitude: 86.0122 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'MAHOTTARI': { coordinates: { latitude: 26.8761, longitude: 85.8102 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'SARLAHI': { coordinates: { latitude: 26.9627, longitude: 85.5612 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'RAUTAHAT': { coordinates: { latitude: 27.0466, longitude: 85.3110 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'BARA': { coordinates: { latitude: 27.1516, longitude: 85.0513 }, type: 'district', parent: 'MADHESH PROVINCE' },
    'PARSA': { coordinates: { latitude: 27.1750, longitude: 84.8760 }, type: 'district', parent: 'MADHESH PROVINCE' },
    
    // Bagmati Province Districts
    'DOLAKHA': { coordinates: { latitude: 27.7784, longitude: 86.1652 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'SINDHUPALCHOK': { coordinates: { latitude: 27.9512, longitude: 85.6846 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'RASUWA': { coordinates: { latitude: 28.1808, longitude: 85.3967 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'DHADING': { coordinates: { latitude: 27.9711, longitude: 84.8985 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'NUWAKOT': { coordinates: { latitude: 27.9189, longitude: 85.1662 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'KATHMANDU': { coordinates: { latitude: 27.7172, longitude: 85.3240 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'BHAKTAPUR': { coordinates: { latitude: 27.6710, longitude: 85.4298 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'LALITPUR': { coordinates: { latitude: 27.6588, longitude: 85.3247 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'KAVREPALANCHOK': { coordinates: { latitude: 27.5285, longitude: 85.5621 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'RAMECHHAP': { coordinates: { latitude: 27.3335, longitude: 86.0879 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'SINDHULI': { coordinates: { latitude: 27.2569, longitude: 85.9710 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'MAKWANPUR': { coordinates: { latitude: 27.4843, longitude: 85.0230 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    'CHITWAN': { coordinates: { latitude: 27.5291, longitude: 84.3542 }, type: 'district', parent: 'BAGMATI PROVINCE' },
    
    // Gandaki Province Districts
    'GORKHA': { coordinates: { latitude: 28.0000, longitude: 84.6166 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'MANANG': { coordinates: { latitude: 28.6667, longitude: 84.0166 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'MUSTANG': { coordinates: { latitude: 28.9985, longitude: 83.8473 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'MYAGDI': { coordinates: { latitude: 28.6037, longitude: 83.3362 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'KASKI': { coordinates: { latitude: 28.2622, longitude: 83.9729 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'LAMJUNG': { coordinates: { latitude: 28.2765, longitude: 84.3542 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'TANAHU': { coordinates: { latitude: 27.9447, longitude: 84.2279 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'NAWALPARASI EAST': { coordinates: { latitude: 27.6498, longitude: 84.1234 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'SYANGJA': { coordinates: { latitude: 28.0196, longitude: 83.8040 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'PARBAT': { coordinates: { latitude: 28.2287, longitude: 83.6967 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    'BAGLUNG': { coordinates: { latitude: 28.2765, longitude: 83.5969 }, type: 'district', parent: 'GANDAKI PROVINCE' },
    
    // Lumbini Province Districts
    'RUKUM EAST': { coordinates: { latitude: 28.6430, longitude: 82.4900 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'ROLPA': { coordinates: { latitude: 28.3815, longitude: 82.6483 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'PYUTHAN': { coordinates: { latitude: 28.0840, longitude: 82.8546 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'GULMI': { coordinates: { latitude: 28.0726, longitude: 83.2548 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'ARGHAKHANCHI': { coordinates: { latitude: 27.9315, longitude: 83.1204 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'PALPA': { coordinates: { latitude: 27.8665, longitude: 83.5466 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'NAWALPARASI WEST': { coordinates: { latitude: 27.5525, longitude: 83.6386 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'RUPANDEHI': { coordinates: { latitude: 27.6264, longitude: 83.3789 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'KAPILVASTU': { coordinates: { latitude: 27.6498, longitude: 83.0275 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'DANG': { coordinates: { latitude: 28.1500, longitude: 82.3000 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'BANKE': { coordinates: { latitude: 28.0513, longitude: 81.6868 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    'BARDIYA': { coordinates: { latitude: 28.3102, longitude: 81.4279 }, type: 'district', parent: 'LUMBINI PROVINCE' },
    
    // Karnali Province Districts
    'DOLPA': { coordinates: { latitude: 29.2539, longitude: 83.0000 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'MUGU': { coordinates: { latitude: 29.5058, longitude: 82.1995 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'HUMLA': { coordinates: { latitude: 29.9680, longitude: 81.8180 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'JUMLA': { coordinates: { latitude: 29.2787, longitude: 82.1838 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'KALIKOT': { coordinates: { latitude: 29.1491, longitude: 81.7342 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'DAILEKH': { coordinates: { latitude: 28.9447, longitude: 81.7282 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'JAJARKOT': { coordinates: { latitude: 28.8623, longitude: 82.2099 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'RUKUM WEST': { coordinates: { latitude: 28.6872, longitude: 82.6335 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'SALYAN': { coordinates: { latitude: 28.3517, longitude: 82.1528 }, type: 'district', parent: 'KARNALI PROVINCE' },
    'SURKHET': { coordinates: { latitude: 28.6023, longitude: 81.6339 }, type: 'district', parent: 'KARNALI PROVINCE' },
    
    // Sudurpashchim Province Districts
    'BAJURA': { coordinates: { latitude: 29.6025, longitude: 81.5912 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'BAJHANG': { coordinates: { latitude: 29.7766, longitude: 81.2519 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'DARCHULA': { coordinates: { latitude: 29.8500, longitude: 80.7686 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'BAITADI': { coordinates: { latitude: 29.5188, longitude: 80.4745 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'DADELDHURA': { coordinates: { latitude: 29.2992, longitude: 80.5799 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'DOTI': { coordinates: { latitude: 29.2500, longitude: 80.9833 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'ACHHAM': { coordinates: { latitude: 29.1041, longitude: 81.2900 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'KAILALI': { coordinates: { latitude: 28.8301, longitude: 80.8986 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    'KANCHANPUR': { coordinates: { latitude: 28.8372, longitude: 80.3213 }, type: 'district', parent: 'SUDURPASHCHIM PROVINCE' },
    
    // ===== METROPOLITAN CITIES (6) =====
    'KATHMANDU METROPOLITAN CITY': { coordinates: { latitude: 27.7172, longitude: 85.3240 }, type: 'municipality', parent: 'KATHMANDU' },
    'LALITPUR METROPOLITAN CITY': { coordinates: { latitude: 27.6588, longitude: 85.3247 }, type: 'municipality', parent: 'LALITPUR' },
    'BHARATPUR METROPOLITAN CITY': { coordinates: { latitude: 27.6800, longitude: 84.4300 }, type: 'municipality', parent: 'CHITWAN' },
    'BIRATNAGAR METROPOLITAN CITY': { coordinates: { latitude: 26.4550, longitude: 87.2722 }, type: 'municipality', parent: 'MORANG' },
    'BIRGUNJ METROPOLITAN CITY': { coordinates: { latitude: 27.0128, longitude: 84.8770 }, type: 'municipality', parent: 'PARSA' },
    'POKHARA METROPOLITAN CITY': { coordinates: { latitude: 28.2096, longitude: 83.9856 }, type: 'municipality', parent: 'KASKI' },
    
  // ===== SUB-METROPOLITAN CITIES (11) =====
  'DHARAN SUB-METROPOLITAN CITY': { coordinates: { latitude: 26.8125, longitude: 87.2835 }, type: 'municipality', parent: 'SUNSARI' },
  'ITAHARI SUB-METROPOLITAN CITY': { coordinates: { latitude: 26.6559, longitude: 87.2773 }, type: 'municipality', parent: 'SUNSARI' },
  'JANAKPUR SUB-METROPOLITAN CITY': { coordinates: { latitude: 26.7183, longitude: 85.9055 }, type: 'municipality', parent: 'DHANUSHA' },
  'HETAUDA SUB-METROPOLITAN CITY': { coordinates: { latitude: 27.4284, longitude: 85.0322 }, type: 'municipality', parent: 'MAKWANPUR' },
  'BUTWAL SUB-METROPOLITAN CITY': { coordinates: { latitude: 27.6866, longitude: 83.4633 }, type: 'municipality', parent: 'RUPANDEHI' },
  'GHORAHI SUB-METROPOLITAN CITY': { coordinates: { latitude: 28.0608, longitude: 82.4850 }, type: 'municipality', parent: 'DANG' },
  'TULSIPUR SUB-METROPOLITAN CITY': { coordinates: { latitude: 28.1310, longitude: 82.2973 }, type: 'municipality', parent: 'DANG' },
  'NEPALGUNJ SUB-METROPOLITAN CITY': { coordinates: { latitude: 28.0500, longitude: 81.6167 }, type: 'municipality', parent: 'BANKE' },
  'BIRENDRANAGAR SUB-METROPOLITAN CITY': { coordinates: { latitude: 28.6019, longitude: 81.6336 }, type: 'municipality', parent: 'SURKHET' },
  'DHANGADHI SUB-METROPOLITAN CITY': { coordinates: { latitude: 28.7079, longitude: 80.5986 }, type: 'municipality', parent: 'KAILALI' },
  'BHAKTAPUR SUB-METROPOLITAN CITY': { coordinates: { latitude: 27.6710, longitude: 85.4298 }, type: 'municipality', parent: 'BHAKTAPUR' },

  // ===== MUNICIPALITIES (Sample of 20 out of 276) =====
  'MECHINAGAR MUNICIPALITY': { coordinates: { latitude: 26.6430, longitude: 88.0960 }, type: 'municipality', parent: 'JHAPA' },
  'DAMAK MUNICIPALITY': { coordinates: { latitude: 26.6728, longitude: 87.7031 }, type: 'municipality', parent: 'JHAPA' },
  'BHADRAPUR MUNICIPALITY': { coordinates: { latitude: 26.5440, longitude: 88.0945 }, type: 'municipality', parent: 'JHAPA' },
  'URLABARI MUNICIPALITY': { coordinates: { latitude: 26.6582, longitude: 87.6077 }, type: 'municipality', parent: 'MORANG' },
  'INARUWA MUNICIPALITY': { coordinates: { latitude: 26.6091, longitude: 87.1476 }, type: 'municipality', parent: 'SUNSARI' },
  'RAJBIRAJ MUNICIPALITY': { coordinates: { latitude: 26.5362, longitude: 86.7498 }, type: 'municipality', parent: 'SAPTARI' },
  'LAHAN MUNICIPALITY': { coordinates: { latitude: 26.7244, longitude: 86.4868 }, type: 'municipality', parent: 'SIRAHA' },
  'GAUR MUNICIPALITY': { coordinates: { latitude: 26.7741, longitude: 85.2809 }, type: 'municipality', parent: 'RAUTAHAT' },
  'KALAIYA MUNICIPALITY': { coordinates: { latitude: 27.0418, longitude: 85.0002 }, type: 'municipality', parent: 'BARA' },
  'DHULIKHEL MUNICIPALITY': { coordinates: { latitude: 27.6195, longitude: 85.5500 }, type: 'municipality', parent: 'KAVREPALANCHOK' },
  'BIDUR MUNICIPALITY': { coordinates: { latitude: 27.8806, longitude: 85.1444 }, type: 'municipality', parent: 'NUWAKOT' },
  'BHIMAD MUNICIPALITY': { coordinates: { latitude: 27.8753, longitude: 84.4068 }, type: 'municipality', parent: 'TANAHU' },
  'WALING MUNICIPALITY': { coordinates: { latitude: 27.9833, longitude: 83.7667 }, type: 'municipality', parent: 'SYANGJA' },
  'BAGLUNG MUNICIPALITY': { coordinates: { latitude: 28.2743, longitude: 83.5898 }, type: 'municipality', parent: 'BAGLUNG' },
  'TANSEN MUNICIPALITY': { coordinates: { latitude: 27.8673, longitude: 83.5474 }, type: 'municipality', parent: 'PALPA' },
  'TILOTTAMA MUNICIPALITY': { coordinates: { latitude: 27.5821, longitude: 83.4516 }, type: 'municipality', parent: 'RUPANDEHI' },
  'KAPILVASTU MUNICIPALITY': { coordinates: { latitude: 27.5505, longitude: 83.0153 }, type: 'municipality', parent: 'KAPILVASTU' },
  'DULLU MUNICIPALITY': { coordinates: { latitude: 28.8548, longitude: 81.5779 }, type: 'municipality', parent: 'DAILEKH' },
  'AMARGADHI MUNICIPALITY': { coordinates: { latitude: 29.3110, longitude: 80.6000 }, type: 'municipality', parent: 'DADELDHURA' },
  'BHIMDATTA MUNICIPALITY': { coordinates: { latitude: 28.9655, longitude: 80.1844 }, type: 'municipality', parent: 'KANCHANPUR' },
  
  // ===== RURAL MUNICIPALITIES (Sample of 20 out of 460) =====
  'RONG RURAL MUNICIPALITY': { coordinates: { latitude: 27.2013, longitude: 87.8874 }, type: 'municipality', parent: 'ILAM' },
  'MIKLAJUNG RURAL MUNICIPALITY': { coordinates: { latitude: 26.9837, longitude: 87.8562 }, type: 'municipality', parent: 'PANCHTHAR' },
  'JHOKRAHA RURAL MUNICIPALITY': { coordinates: { latitude: 26.6200, longitude: 87.1300 }, type: 'municipality', parent: 'SUNSARI' },
  'BELAKA RURAL MUNICIPALITY': { coordinates: { latitude: 26.8742, longitude: 86.9137 }, type: 'municipality', parent: 'UDAYAPUR' },
  'SAPTAKOSHI RURAL MUNICIPALITY': { coordinates: { latitude: 26.6498, longitude: 86.9145 }, type: 'municipality', parent: 'SAPTARI' },
  'AURAHI RURAL MUNICIPALITY': { coordinates: { latitude: 26.6667, longitude: 86.3667 }, type: 'municipality', parent: 'SIRAHA' },
  'EKDARA RURAL MUNICIPALITY': { coordinates: { latitude: 26.8761, longitude: 85.8102 }, type: 'municipality', parent: 'MAHOTTARI' },
  'BAGMATI RURAL MUNICIPALITY': { coordinates: { latitude: 27.1022, longitude: 85.3844 }, type: 'municipality', parent: 'SARLAHI' },
  'PARWANIPUR RURAL MUNICIPALITY': { coordinates: { latitude: 27.0768, longitude: 84.9342 }, type: 'municipality', parent: 'BARA' },
  'KAKANI RURAL MUNICIPALITY': { coordinates: { latitude: 27.8250, longitude: 85.2500 }, type: 'municipality', parent: 'NUWAKOT' },
  'DALOME RURAL MUNICIPALITY': { coordinates: { latitude: 28.9985, longitude: 83.8473 }, type: 'municipality', parent: 'MUSTANG' },
  'ANNAPURNA RURAL MUNICIPALITY': { coordinates: { latitude: 28.3560, longitude: 83.7931 }, type: 'municipality', parent: 'KASKI' },
  'GANDAKI RURAL MUNICIPALITY': { coordinates: { latitude: 28.0967, longitude: 84.4192 }, type: 'municipality', parent: 'GORKHA' },
  'RAINADEVI CHHAHARA RURAL MUNICIPALITY': { coordinates: { latitude: 27.7614, longitude: 83.5458 }, type: 'municipality', parent: 'PALPA' },
  'MARCHAWARI RURAL MUNICIPALITY': { coordinates: { latitude: 27.5031, longitude: 83.0595 }, type: 'municipality', parent: 'RUPANDEHI' },
  'CHAMUNDA BINDRASAINI RURAL MUNICIPALITY': { coordinates: { latitude: 28.7792, longitude: 81.6744 }, type: 'municipality', parent: 'DAILEKH' },
  'NARHARINATH RURAL MUNICIPALITY': { coordinates: { latitude: 29.2140, longitude: 81.7710 }, type: 'municipality', parent: 'KALIKOT' },
  'SIMTA RURAL MUNICIPALITY': { coordinates: { latitude: 28.5525, longitude: 81.7727 }, type: 'municipality', parent: 'SURKHET' },
  'SHIVALAYA RURAL MUNICIPALITY': { coordinates: { latitude: 29.5440, longitude: 81.2300 }, type: 'municipality', parent: 'JAJARKOT' },
  'CHAURPATI RURAL MUNICIPALITY': { coordinates: { latitude: 29.0438, longitude: 81.3520 }, type: 'municipality', parent: 'ACHHAM' }
};

  
  // Default center coordinates of Nepal for ultimate fallback
  export const NEPAL_CENTER: Coordinates = {
    latitude: 28.3949,
    longitude: 84.124
  };
  
  /**
   * Get coordinates for a location with hierarchical fallback
   * @param locationName Name of the location (municipality, district, or province)
   * @param district Optional district name for additional context
   * @param province Optional province name for additional context
   * @returns Coordinates or null if not found
   */
  export function getLocationCoordinates(
    locationName: string,
    district?: string,
    province?: string
  ): Coordinates | null {
    // Normalize inputs by trimming and converting to uppercase
    const normalizedLocation = locationName?.trim() || '';
    const normalizedDistrict = district?.trim() || '';
    const normalizedProvince = province?.trim() || '';
    
    console.log(`🔍 Looking up coordinates for: ${normalizedLocation}, ${normalizedDistrict}, ${normalizedProvince}`);
    
    // Direct lookup - try the exact location name first
    if (NEPAL_LOCATIONS[normalizedLocation]) {
      console.log(`✅ Found direct match for: ${normalizedLocation}`);
      return NEPAL_LOCATIONS[normalizedLocation].coordinates;
    }
    
    // Try some variations of the location name (common naming patterns)
    const variations = [
      normalizedLocation,
      `${normalizedLocation} Municipality`,
      `${normalizedLocation} Metropolitan City`,
      `${normalizedLocation} Rural Municipality`
    ];
    
    for (const variation of variations) {
      if (NEPAL_LOCATIONS[variation]) {
        console.log(`✅ Found match for variation: ${variation}`);
        return NEPAL_LOCATIONS[variation].coordinates;
      }
    }
    
    // If district is provided, try to find a municipality in that district
    if (normalizedDistrict) {
      // Find all municipalities in this district
      const municipalitiesInDistrict = Object.entries(NEPAL_LOCATIONS)
        .filter(([_, data]) => 
          (data.type === 'municipality' || data.type === 'rural_municipality') && 
          data.parent?.toLowerCase() === normalizedDistrict.toLowerCase()
        );
      
      if (municipalitiesInDistrict.length > 0) {
        console.log(`⚠️ Using district's first municipality as fallback: ${municipalitiesInDistrict[0][0]}`);
        return municipalitiesInDistrict[0][1].coordinates;
      }
      
      // If no municipalities found, try the district itself
      if (NEPAL_LOCATIONS[normalizedDistrict]) {
        console.log(`⚠️ Using district center as fallback: ${normalizedDistrict}`);
        return NEPAL_LOCATIONS[normalizedDistrict].coordinates;
      }
    }
    
    // If province is provided, try to use province coordinates
    if (normalizedProvince && NEPAL_LOCATIONS[normalizedProvince]) {
      console.log(`⚠️ Using province center as fallback: ${normalizedProvince}`);
      return NEPAL_LOCATIONS[normalizedProvince].coordinates;
    }
    
    // Final fallback: return Nepal's center coordinates
    console.log(`⚠️ No match found, using Nepal center coordinates`);
    return NEPAL_CENTER;
  }
  
  export default NEPAL_LOCATIONS;