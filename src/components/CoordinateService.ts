// // CoordinateService.ts
// // Service to handle geocoding and coordinate lookups

// import { getLocationCoordinates, NEPAL_CENTER, Coordinates } from './NepalCoordinates';

// /**
//  * Service for handling geocoding and location coordinate operations
//  */
// export class CoordinateService {
//   // Cache of already geocoded locations to reduce API calls
//   private geocodeCache: Map<string, Coordinates> = new Map();
  
//   /**
//    * Get coordinates for a hospital
//    * @param hospital Hospital data 
//    * @returns Coordinates for the hospital location
//    */
//   async getHospitalCoordinates(hospital: any): Promise<Coordinates> {
//     if (!hospital) return NEPAL_CENTER;
    
//     const cacheKey = `hospital-${hospital.hospitalId}`;
    
//     // Check cache first
//     if (this.geocodeCache.has(cacheKey)) {
//       console.log(`🔄 Using cached hospital coordinates for ${hospital.hospitalName}`);
//       return this.geocodeCache.get(cacheKey)!;
//     }
    
//     const hospitalAddress = `${hospital.municipality}, ${hospital.district}, ${hospital.province}`;
//     console.log(`📍 Getting coordinates for hospital (${hospital.hospitalName}):`, hospitalAddress);
    
//     // Try to geocode via Nominatim first
//     try {
//       const coords = await this.geocodeAddress(hospitalAddress);
//       if (coords) {
//         this.geocodeCache.set(cacheKey, coords);
//         return coords;
//       }
//     } catch (error) {
//       console.error('Error geocoding hospital address:', error);
//     }
    
//     // If geocoding fails, use our location database
//     console.log(`⚠️ Falling back to location database for hospital: ${hospital.hospitalName}`);
//     const fallbackCoords = getLocationCoordinates(
//       hospital.municipality,
//       hospital.district,
//       hospital.province
//     ) || NEPAL_CENTER;
    
//     this.geocodeCache.set(cacheKey, fallbackCoords);
//     return fallbackCoords;
//   }
  
//   /**
//    * Get coordinates for a donor
//    * @param donor Donor data
//    * @returns Coordinates for the donor location
//    */
//   async getDonorCoordinates(donor: any): Promise<Coordinates> {
//     if (!donor) return NEPAL_CENTER;
    
//     const cacheKey = `donor-${donor.donorId}`;
    
//     // Check cache first
//     if (this.geocodeCache.has(cacheKey)) {
//       console.log(`🔄 Using cached donor coordinates for ${donor.donorName}`);
//       return this.geocodeCache.get(cacheKey)!;
//     }
    
//     const donorAddress = `${donor.municipality}, ${donor.district}, ${donor.province}`;
//     console.log(`📍 Getting coordinates for donor (${donor.donorName}):`, donorAddress);
    
//     // Try to geocode via Nominatim first
//     try {
//       const coords = await this.geocodeAddress(donorAddress);
//       if (coords) {
//         this.geocodeCache.set(cacheKey, coords);
//         return coords;
//       }
//     } catch (error) {
//       console.error('Error geocoding donor address:', error);
//     }
    
//     // If geocoding fails, use our location database
//     console.log(`⚠️ Falling back to location database for donor: ${donor.donorName}`);
//     const fallbackCoords = getLocationCoordinates(
//       donor.municipality,
//       donor.district,
//       donor.province
//     ) || NEPAL_CENTER;
    
//     this.geocodeCache.set(cacheKey, fallbackCoords);
//     return fallbackCoords;
//   }
  
//   /**
//    * Get coordinates for a patient
//    * @param patient Patient data
//    * @returns Coordinates for the patient location
//    */
//   async getPatientCoordinates(patient: any): Promise<Coordinates> {
//     if (!patient) return NEPAL_CENTER;
    
//     const patientAddress = `${patient.municipality}, ${patient.district}, ${patient.province}`;
//     console.log(`📍 Getting coordinates for patient location:`, patientAddress);
    
//     // Try to geocode via Nominatim first
//     try {
//       const coords = await this.geocodeAddress(patientAddress);
//       if (coords) {
//         return coords;
//       }
//     } catch (error) {
//       console.error('Error geocoding patient address:', error);
//     }
    
//     // If geocoding fails, use our location database
//     console.log(`⚠️ Falling back to location database for patient`);
//     return getLocationCoordinates(
//       patient.municipality,
//       patient.district,
//       patient.province
//     ) || NEPAL_CENTER;
//   }
  
//   /**
//    * Calculate distance between two points using Haversine formula
//    * @param lat1 Latitude of first point
//    * @param lon1 Longitude of first point
//    * @param lat2 Latitude of second point
//    * @param lon2 Longitude of second point
//    * @returns Distance in kilometers
//    */
//   calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//     const R = 6371; // Radius of the earth in km
//     const dLat = this.deg2rad(lat2 - lat1);
//     const dLon = this.deg2rad(lon2 - lon1);
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     const distance = R * c; // Distance in km
//     return parseFloat(distance.toFixed(1));
//   }
  
//   /**
//    * Convert degrees to radians
//    * @param deg Degrees
//    * @returns Radians
//    */
//   private deg2rad(deg: number): number {
//     return deg * (Math.PI/180);
//   }
  
//   /**
//    * Geocode an address using Nominatim API
//    * @param address Address to geocode
//    * @returns Coordinates or null if geocoding fails
//    */
//   private async geocodeAddress(address: string): Promise<Coordinates | null> {
//     try {
//       if (!address || address.trim().length === 0) {
//         console.error('Empty address provided to geocodeAddress');
//         return null;
//       }
      
//       // Remove province and simplify address for better results
//       const addressParts = address.split(',').map(part => part.trim());
      
//       // Try with different address formats in sequence
//       const addressFormats = [
//         // 1. Try with the original address but ensure "Nepal" is appended
//         address.toLowerCase().includes('nepal') ? address : `${address}, Nepal`,
        
//         // 2. Try with municipality + district (simplify to first two parts)
//         `${addressParts.slice(0, Math.min(2, addressParts.length)).join(', ')}, Nepal`,
        
//         // 3. Try just municipality (first part) + Nepal
//         addressParts.length > 0 ? `${addressParts[0]}, Nepal` : null
//       ].filter(Boolean) as string[];
      
//       // Try each address format in sequence
//       for (const addressFormat of addressFormats) {
//         const encodedAddress = encodeURIComponent(addressFormat);
//         console.log(`🔍 Trying geocoding with: ${addressFormat}`);
        
//         // Add delay to prevent rate limiting
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         // Add additional parameters to improve results
//         const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=np&addressdetails=1`;
        
//         const response = await fetch(url, { 
//           headers: { 
//             'Accept-Language': 'en-US,en;q=0.9',
//             'User-Agent': 'BloodDonationApp/1.0',
//             'Referer': 'https://blooddonation.app/' // Adding referer helps with rate limiting
//           } 
//         });
        
//         if (!response.ok) {
//           console.error(`❌ Geocoding failed with status: ${response.status}`);
//           continue; // Try next format
//         }
        
//         const data = await response.json();
        
//         if (data && data.length > 0) {
//           const coords = {
//             latitude: parseFloat(data[0].lat),
//             longitude: parseFloat(data[0].lon)
//           };
          
//           console.log(`✅ Successfully geocoded "${addressFormat}" to:`, coords);
//           return coords;
//         }
        
//         console.log(`⚠️ No results found for address: ${addressFormat}`);
//       }
      
//       return null;
//     } catch (error) {
//       console.error('❌ Geocoding error:', error);
//       return null;
//     }
//   }
// }

// // Create and export a singleton instance
// export const coordinateService = new CoordinateService();

// export default coordinateService;




// CoordinateService.ts
// Service to handle coordinate lookups using local database only

import { getLocationCoordinates, NEPAL_CENTER, Coordinates } from './NepalCoordinates';

/**
 * Service for handling location coordinate operations
 */
export class CoordinateService {
  // Cache of already looked up locations to improve performance
  private coordinateCache: Map<string, Coordinates> = new Map();
  
  /**
   * Get coordinates for a hospital
   * @param hospital Hospital data 
   * @returns Coordinates for the hospital location
   */
  getHospitalCoordinates(hospital: any): Coordinates {
    if (!hospital) return NEPAL_CENTER;
    
    const cacheKey = `hospital-${hospital.hospitalId}`;
    
    // Check cache first
    if (this.coordinateCache.has(cacheKey)) {
      console.log(`🔄 Using cached hospital coordinates for ${hospital.hospitalName}`);
      return this.coordinateCache.get(cacheKey)!;
    }
    
    console.log(`📍 Getting coordinates for hospital (${hospital.hospitalName}): ${hospital.municipality}, ${hospital.district}, ${hospital.province}`);
    
    // Use our location database
    const coords = getLocationCoordinates(
      hospital.municipality,
      hospital.district,
      hospital.province
    ) || NEPAL_CENTER;
    
    // Store in cache for future use
    this.coordinateCache.set(cacheKey, coords);
    return coords;
  }
  
  /**
   * Get coordinates for a donor
   * @param donor Donor data
   * @returns Coordinates for the donor location
   */
  getDonorCoordinates(donor: any): Coordinates {
    if (!donor) return NEPAL_CENTER;
    
    const cacheKey = `donor-${donor.donorId}`;
    
    // Check cache first
    if (this.coordinateCache.has(cacheKey)) {
      console.log(`🔄 Using cached donor coordinates for ${donor.donorName}`);
      return this.coordinateCache.get(cacheKey)!;
    }
    
    console.log(`📍 Getting coordinates for donor (${donor.donorName}): ${donor.municipality}, ${donor.district}, ${donor.province}`);
    
    // Use our location database
    const coords = getLocationCoordinates(
      donor.municipality,
      donor.district,
      donor.province
    ) || NEPAL_CENTER;
    
    // Store in cache for future use
    this.coordinateCache.set(cacheKey, coords);
    return coords;
  }
  
  /**
   * Get coordinates for a patient
   * @param patient Patient data
   * @returns Coordinates for the patient location
   */
  getPatientCoordinates(patient: any): Coordinates {
    if (!patient) return NEPAL_CENTER;
    
    const patientKey = `patient-${patient.patientId || Math.random().toString(36).substring(7)}`;
    
    // Check cache first
    if (this.coordinateCache.has(patientKey)) {
      console.log(`🔄 Using cached patient coordinates`);
      return this.coordinateCache.get(patientKey)!;
    }
    
    console.log(`📍 Getting coordinates for patient location: ${patient.municipality}, ${patient.district}, ${patient.province}`);
    
    // Use our location database
    const coords = getLocationCoordinates(
      patient.municipality,
      patient.district,
      patient.province
    ) || NEPAL_CENTER;
    
    // Store in cache for future use
    this.coordinateCache.set(patientKey, coords);
    return coords;
  }
  
  /**
   * Calculate distance between two points using Haversine formula
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(1));
  }
  
  /**
   * Convert degrees to radians
   * @param deg Degrees
   * @returns Radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  /**
   * Clear the coordinate cache
   */
  clearCache(): void {
    this.coordinateCache.clear();
    console.log('🧹 Coordinate cache cleared');
  }
}

// Create and export a singleton instance
export const coordinateService = new CoordinateService();

export default coordinateService;