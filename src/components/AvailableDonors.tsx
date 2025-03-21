// import { toast } from 'react-toastify';
// import { EditDonors, ShowAvailableData } from '../models/datamodels';
// import { useReadRequestQuery } from '../api/apiHandler';

// const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
//   const copyToClipboard = (text: number) => {
//     navigator.clipboard
//       .writeText(text.toString())
//       .then(() => {
//         toast.success('Phone Number copied to clipboard');
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error('Could not copy to clipboard');
//       });
//   };

//   const { data: newDonors, isLoading: loading } = useReadRequestQuery(
//     `/filtereddonors/${clickedRowData?.bloodGroup.bloodGroupName}/${clickedRowData?.municipality}/${clickedRowData?.wardNo}`
//   );

//   return (
//     <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
//       <div className="w-3/4 flex items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
//         <span className="text-[#008080] w-full font-semibold text-xl mb-2">
//           Available Donors
//         </span>
//         <div className="w-full flex items-center gap-4">
//           <span className="text-lg text-[#008080]">
//             Ward No: {clickedRowData?.wardNo}
//           </span>
//           <span className="text-lg text-[#008080] cursor-pointer hover:underline">
//             Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
//           </span>
//         </div>
//       </div>
//       <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
//         {loading && (
//           <p className="text-[#008080] text-lg">Loading Available Donors...</p>
//         )}
//         {!loading && newDonors?.length === 0 ? (
//           <p className="text-[#008080] text-lg w-full text-center m-2">
//             Oops, There are no available donors in your ward.
//           </p>
//         ) : (
//           newDonors?.map((oneDonor: EditDonors) => (
//             <div
//               key={oneDonor.donorId}
//               className="w-full  flex justify-between items-center p-2"
//             >
//               <span className="w-full text-lg text-[#008080]">
//                 {oneDonor.donorName} :
//               </span>
//               <span
//                 className=" w-full cursor-pointer hover:underline ml-2 text-lg font-semibold text-[#008080]"
//                 onClick={() => copyToClipboard(oneDonor.phoneNumber)}
//               >
//                 {oneDonor.phoneNumber}
//               </span>
//               <span className="w-full text-lg text-[#008080]">
//                 {oneDonor.municipality} - {oneDonor.wardNo}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableDonors;



//--------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { useReadRequestQuery } from '../api/apiHandler';
// import { useSelector } from 'react-redux';
// import { InitialState, ShowAvailableData, EditDonors } from '../models/datamodels';
// import { LinearProgress } from '@mui/material';
// import { toast } from 'react-toastify';

// // Define types for coordinates and locations
// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// // Type for donor with distance
// interface DonorWithDistance extends EditDonors {
//   distance?: number;
// }

// // Function to calculate distance between two points using Haversine formula
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Radius of the earth in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   const distance = R * c; // Distance in km
//   return distance;
// };

// const deg2rad = (deg: number): number => {
//   return deg * (Math.PI/180);
// };

// // Mock function to get coordinates from municipality and ward
// const getCoordinates = (municipality: string | undefined, wardNo: number | undefined): Coordinates => {
//   // Kathmandu coordinates: approximately 27.7172° N, 85.3240° E
//   const baseLatitude = 27.7172;
//   const baseLongitude = 85.3240;
  
//   // Default to 0 if municipality or wardNo is undefined
//   const municipalityStr = municipality || '';
//   const wardNumber = wardNo || 0;
  
//   // Generate a "unique" but consistent offset based on municipality and ward
//   const municipalityHash = municipalityStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100 / 1000;
//   const wardHash = parseInt(String(wardNumber)) % 10 / 100;
  
//   return {
//     latitude: baseLatitude + municipalityHash + wardHash,
//     longitude: baseLongitude + municipalityHash - wardHash
//   };
// };

// const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
//   const [availableDonors, setAvailableDonors] = useState<DonorWithDistance[]>([]);
//   const [hospitalLocation, setHospitalLocation] = useState<Coordinates | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
  
//   // *** FOR TESTING: Force Hospital Admin mode ***
//   const [forceAdmin, setForceAdmin] = useState<boolean>(false);

//   // Get Redux state
//   const state = useSelector((state: any) => state);
  
//   // Safely get user information with logging and null checks
//   let user = '';
//   let userId = '';
  
//   try {
//     console.log("Redux state:", state);
    
//     // Try different paths to find user type based on your Redux structure
//     if (state?.auth?.userType?.userTypeName) {
//       user = state.auth.userType.userTypeName;
//       console.log("Found user type at state.auth.userType.userTypeName:", user);
//     } else if (state?.auth?.user?.userType) {
//       user = state.auth.user.userType;
//       console.log("Found user type at state.auth.user.userType:", user);
//     } else {
//       console.log("Could not find user type in Redux state");
//     }
    
//     // Try different paths to find user ID
//     if (state?.auth?.user?.userId) {
//       userId = state.auth.user.userId;
//       console.log("Found user ID at state.auth.user.userId:", userId);
//     } else if (state?.auth?.userId) {
//       userId = state.auth.userId;
//       console.log("Found user ID at state.auth.userId:", userId);
//     } else {
//       console.log("Could not find user ID in Redux state");
//     }
//   } catch (error) {
//     console.error("Error accessing Redux state:", error);
//   }
  
//   // Check for various hospital admin type strings
//   const isHospitalAdmin = user === 'Hospital Admin' || user === 'HospitalAdmin' || user === 'hospital_admin' || forceAdmin;
//   console.log("Is hospital admin:", isHospitalAdmin);

//   const copyToClipboard = (text: number) => {
//     navigator.clipboard
//       .writeText(text.toString())
//       .then(() => {
//         toast.success('Phone Number copied to clipboard');
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error('Could not copy to clipboard');
//       });
//   };

//   // Fetch donors with matching blood group, municipality, and ward
//   const { data: newDonors, isLoading: donorsLoading } = useReadRequestQuery(
//     `/filtereddonors/${clickedRowData?.bloodGroup.bloodGroupName}/${clickedRowData?.municipality}/${clickedRowData?.wardNo}`
//   );

//   useEffect(() => {
//     setLoading(true);
    
//     if (newDonors && !donorsLoading) {
//       let processedDonors: DonorWithDistance[] = [...newDonors];
      
//       // Even if not logged in as Hospital Admin, calculate fake distances for testing
//       // This will allow us to see if the calculation logic works
//       console.log("Calculating distances for all users (for testing)");
      
//       // Use the clicked patient's location as the reference point for distance calculation
//       const referenceCoords = getCoordinates(clickedRowData?.municipality, clickedRowData?.wardNo);
//       setHospitalLocation(referenceCoords);
      
//       console.log("Reference coordinates (patient location):", referenceCoords);
      
//       // Calculate distance for each donor and add it to the donor object
//       processedDonors = processedDonors.map(donor => {
//         const donorCoords = getCoordinates(donor.municipality, donor.wardNo);
//         console.log("Donor coordinates for", donor.donorName, ":", donorCoords);
        
//         const distance = calculateDistance(
//           referenceCoords.latitude, 
//           referenceCoords.longitude, 
//           donorCoords.latitude, 
//           donorCoords.longitude
//         );
        
//         console.log("Distance for", donor.donorName, ":", distance.toFixed(1), "km");
        
//         return {
//           ...donor,
//           distance: parseFloat(distance.toFixed(1))
//         };
//       });
      
//       // Sort by distance (closest first)
//       processedDonors.sort((a, b) => (a.distance || 0) - (b.distance || 0));
//       console.log("Sorted donors:", processedDonors.map(d => `${d.donorName}: ${d.distance}km`));
      
//       setAvailableDonors(processedDonors);
//       setLoading(false);
//     }
//   }, [newDonors, donorsLoading, clickedRowData]);

//   if (loading || donorsLoading) {
//     return <LinearProgress />;
//   }

//   return (
//     <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
//       <div className="w-3/4 flex flex-col md:flex-row items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
//         <span className="text-[#008080] w-full font-semibold text-xl mb-2">
//           Available Donors
//         </span>
//         <div className="w-full flex items-center gap-4">
//           <span className="text-lg text-[#008080]">
//             Ward No: {clickedRowData?.wardNo}
//           </span>
//           <span className="text-lg text-[#008080] cursor-pointer hover:underline">
//             Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
//           </span>
//           {/* Testing toggle button */}
//           <button 
//             className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//             onClick={() => setForceAdmin(!forceAdmin)}
//           >
//             {forceAdmin ? "Disable" : "Enable"} Distance View
//           </button>
//         </div>
//       </div>
      
//       <div className="w-3/4 bg-green-50 p-2 text-center border-b border-green-200">
//         <p className="text-green-700">Donors are sorted by distance from {isHospitalAdmin ? "your hospital" : "patient location"}</p>
//       </div>
      
//       <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
//         {loading && (
//           <p className="text-[#008080] text-lg">Loading Available Donors...</p>
//         )}
//         {!loading && availableDonors?.length === 0 ? (
//           <p className="text-[#008080] text-lg w-full text-center m-2">
//             Oops, There are no available donors in your ward.
//           </p>
//         ) : (
//           <div className="w-full">
//             {/* Header row for column titles */}
//             <div className="w-full flex justify-between items-center p-2 border-b border-gray-200 font-semibold">
//               <span className="w-full text-lg text-[#008080]">Donor Name</span>
//               <span className="w-full text-lg text-[#008080]">Phone</span>
//               <span className="w-full text-lg text-[#008080]">Location</span>
//               {/* Always show the distance column for testing */}
//               <span className="w-full text-lg text-[#008080]">Distance</span>
//             </div>
            
//             {/* Donor rows */}
//             {availableDonors?.map((oneDonor: DonorWithDistance) => (
//               <div
//                 key={oneDonor.donorId}
//                 className="w-full flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50"
//               >
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.donorName}
//                 </span>
//                 <span
//                   className="w-full cursor-pointer hover:underline ml-2 text-lg font-semibold text-[#008080]"
//                   onClick={() => copyToClipboard(oneDonor.phoneNumber)}
//                 >
//                   {oneDonor.phoneNumber}
//                 </span>
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.municipality} - {oneDonor.wardNo}
//                 </span>
//                 {/* Always show the distance for testing */}
//                 <span className="w-full text-lg text-[#008080] font-semibold">
//                   {oneDonor.distance !== undefined ? `${oneDonor.distance} km` : 'N/A'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableDonors;


// ----------------- this owkrs for patient data coordinates

// import React, { useState, useEffect, useRef } from 'react';
// import { useReadRequestQuery } from '../api/apiHandler';
// import { useSelector } from 'react-redux';
// import { InitialState, ShowAvailableData, EditDonors } from '../models/datamodels';
// import { LinearProgress } from '@mui/material';
// import { toast } from 'react-toastify';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Define types for coordinates and locations
// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// // Type for donor with distance
// interface DonorWithDistance extends EditDonors {
//   distance?: number;
//   coordinates?: Coordinates;
// }

// // Function to calculate distance between two points using Haversine formula
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Radius of the earth in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   const distance = R * c; // Distance in km
//   return distance;
// };

// const deg2rad = (deg: number): number => {
//   return deg * (Math.PI/180);
// };

// // Nepal's default center coordinates
// const NEPAL_CENTER = {
//   latitude: 28.3949,
//   longitude: 84.124
// };

// // District fallback coordinates for when geocoding fails
// const DISTRICT_COORDINATES: Record<string, Coordinates> = {
//   'KARNALI PROVINCE': { latitude: 29.2815, longitude: 82.1843 },
//   'Rukum West': { latitude: 28.6872, longitude: 82.6335 },
//   'Kathmandu': { latitude: 27.7172, longitude: 85.3240 },
//   // Add more districts as needed
// };

// // Function to get fallback coordinates for a district
// const getDistrictFallbackCoordinates = (district: string): Coordinates | null => {
//   return DISTRICT_COORDINATES[district] || null;
// };

// // Function to geocode an address using Nominatim API directly with improved error handling
// const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
//   try {
//     // Remove province and simplify address for better results
//     const addressParts = address.split(',').map(part => part.trim());
//     // Use only the first two parts (municipality and district)
//     const simplifiedAddress = addressParts.slice(0, Math.min(2, addressParts.length)).join(', ');
//     const fullAddress = encodeURIComponent(`${simplifiedAddress}, Nepal`);
//     console.log(`Geocoding simplified address: ${simplifiedAddress}, Nepal`);
    
//     // Add delay to prevent rate limiting
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     // Use direct Nominatim API with better headers
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/search?q=${fullAddress}&format=json&limit=1`,
//       { 
//         headers: { 
//           'Accept-Language': 'en-US,en;q=0.9',
//           'User-Agent': 'BloodDonationApp/1.0' // Adding user-agent helps with rate limiting
//         } 
//       }
//     );
    
//     if (!response.ok) {
//       console.error(`Geocoding failed with status: ${response.status}`);
//       return null;
//     }
    
//     const data = await response.json();
    
//     if (data && data.length > 0) {
//       console.log(`Geocoded ${simplifiedAddress} to:`, {
//         lat: parseFloat(data[0].lat),
//         lon: parseFloat(data[0].lon)
//       });
      
//       return {
//         latitude: parseFloat(data[0].lat),
//         longitude: parseFloat(data[0].lon)
//       };
//     }
    
//     console.log(`No results found for address: ${simplifiedAddress}`);
    
//     // Try with even more simplified address (just the municipality)
//     if (addressParts.length > 0) {
//       const verySimpleAddress = encodeURIComponent(`${addressParts[0]}, Nepal`);
//       console.log(`Trying with very simple address: ${addressParts[0]}, Nepal`);
      
//       const retryResponse = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${verySimpleAddress}&format=json&limit=1`,
//         { 
//           headers: { 
//             'Accept-Language': 'en-US,en;q=0.9',
//             'User-Agent': 'BloodDonationApp/1.0'
//           } 
//         }
//       );
      
//       if (retryResponse.ok) {
//         const retryData = await retryResponse.json();
        
//         if (retryData && retryData.length > 0) {
//           console.log(`Geocoded simple address ${addressParts[0]} to:`, {
//             lat: parseFloat(retryData[0].lat),
//             lon: parseFloat(retryData[0].lon)
//           });
          
//           return {
//             latitude: parseFloat(retryData[0].lat),
//             longitude: parseFloat(retryData[0].lon)
//           };
//         }
//       }
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Geocoding error:', error);
//     return null;
//   }
// };

// const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
//   const [availableDonors, setAvailableDonors] = useState<DonorWithDistance[]>([]);
//   const [referenceCoordinates, setReferenceCoordinates] = useState<Coordinates | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showMap, setShowMap] = useState<boolean>(false);
//   const [geocodingFailed, setGeocodingFailed] = useState<boolean>(false);
//   const mapRef = useRef<HTMLDivElement>(null);
//   const leafletMap = useRef<L.Map | null>(null);
  
//   // Get only the user type from Redux state, not the entire state
//   const userType = useSelector((state: any) => 
//     state?.auth?.userType?.userTypeName || 
//     state?.auth?.user?.userType || 
//     ''
//   );
  
//   // Determine if user is a hospital admin
//   const isHospitalAdmin = userType === 'Hospital Admin' || 
//                          userType === 'HospitalAdmin' || 
//                          userType === 'hospital_admin';
  
//   console.log("User Type:", userType);
//   console.log("Is Hospital Admin:", isHospitalAdmin);
  
//   // Fetch user profile data with proper error handling
//   const { 
//     data: userProfile, 
//     isLoading: userProfileLoading,
//     error: userProfileError 
//   } = useReadRequestQuery('/userprofile', {
//     // Skip if we're not a hospital admin to reduce unnecessary API calls
//     skip: !isHospitalAdmin
//   });
  
//   // Log errors for debugging
//   useEffect(() => {
//     if (userProfileError) {
//       console.error("Error fetching user profile:", userProfileError);
//     }
//   }, [userProfileError]);
  
//   // Fetch user's hospital data (if available)
//   const { 
//     data: userHospital, 
//     isLoading: userHospitalLoading,
//     error: userHospitalError 
//   } = useReadRequestQuery(
//     userProfile?.hospitalId ? `/hospitals/${userProfile.hospitalId}` : undefined,
//     { 
//       skip: !userProfile?.hospitalId || !isHospitalAdmin
//     }
//   );
  
//   // Log hospital data errors
//   useEffect(() => {
//     if (userHospitalError) {
//       console.error("Error fetching hospital data:", userHospitalError);
//     }
//   }, [userHospitalError]);

//   // Initialize Leaflet map
//   useEffect(() => {
//     if (showMap && mapRef.current) {
//       // Check if map already exists, if so, remove it
//       if (leafletMap.current) {
//         leafletMap.current.remove();
//         leafletMap.current = null;
//       }
      
//       try {
//         // Initialize the map with default Nepal center
//         leafletMap.current = L.map(mapRef.current).setView(
//           [NEPAL_CENTER.latitude, NEPAL_CENTER.longitude], 
//           8
//         );
        
//         // Add OpenStreetMap tile layer
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(leafletMap.current);
        
//         console.log("Map initialized");
//       } catch (error) {
//         console.error("Error initializing map:", error);
//       }
//     }
    
//     return () => {
//       if (leafletMap.current) {
//         leafletMap.current.remove();
//         leafletMap.current = null;
//       }
//     };
//   }, [showMap]);

//   // Update map markers when donor data changes
//   useEffect(() => {
//     if (showMap && leafletMap.current && referenceCoordinates) {
//       try {
//         // Clear existing markers
//         leafletMap.current.eachLayer(layer => {
//           if (layer instanceof L.Marker) {
//             leafletMap.current?.removeLayer(layer);
//           }
//         });
        
//         // Add reference marker (hospital or patient)
//         const redIcon = new L.Icon({
//           iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//           shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//           iconSize: [25, 41],
//           iconAnchor: [12, 41],
//           popupAnchor: [1, -34],
//           shadowSize: [41, 41]
//         });
        
//         const referenceMarker = L.marker(
//           [referenceCoordinates.latitude, referenceCoordinates.longitude],
//           { icon: redIcon }
//         ).addTo(leafletMap.current);
        
//         const locationName = isHospitalAdmin && userHospital 
//           ? userHospital.hospitalName 
//           : 'Patient Location';
        
//         referenceMarker.bindPopup(
//           `<b>${locationName}</b><br>
//           ${isHospitalAdmin && userHospital 
//             ? `${userHospital.municipality}, ${userHospital.district}` 
//             : `${clickedRowData?.municipality} - Ward ${clickedRowData?.wardNo}`}`
//         );
        
//         const markers = [referenceMarker];
        
//         // Add donor markers
//         availableDonors.forEach(donor => {
//           if (donor.coordinates) {
//             const donorMarker = L.marker([
//               donor.coordinates.latitude,
//               donor.coordinates.longitude
//             ]).addTo(leafletMap.current!);
            
//             donorMarker.bindPopup(
//               `<b>${donor.donorName}</b><br>
//               Phone: ${donor.phoneNumber}<br>
//               Location: ${donor.municipality} - Ward ${donor.wardNo}<br>
//               Distance: ${donor.distance?.toFixed(1)} km`
//             );
            
//             markers.push(donorMarker);
//           }
//         });
        
//         // Set view to include all markers
//         if (markers.length > 1) {
//           const group = L.featureGroup(markers);
//           leafletMap.current.fitBounds(group.getBounds(), {
//             padding: [50, 50]
//           });
//         } else {
//           leafletMap.current.setView(
//             [referenceCoordinates.latitude, referenceCoordinates.longitude], 
//             12
//           );
//         }
//       } catch (error) {
//         console.error("Error updating map markers:", error);
//       }
//     }
//   }, [showMap, availableDonors, referenceCoordinates, isHospitalAdmin, userHospital, clickedRowData]);

//   const copyToClipboard = (text: number) => {
//     navigator.clipboard
//       .writeText(text.toString())
//       .then(() => {
//         toast.success('Phone Number copied to clipboard');
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error('Could not copy to clipboard');
//       });
//   };

//   // Fetch donors with matching blood group, municipality, and ward
//   // Using a more robust approach with error handling
//   const { 
//     data: newDonors, 
//     isLoading: donorsLoading,
//     error: donorsError 
//   } = useReadRequestQuery(
//     clickedRowData?.bloodGroup?.bloodGroupName && clickedRowData?.municipality && clickedRowData?.wardNo
//       ? `/filtereddonors/${clickedRowData.bloodGroup.bloodGroupName}/${clickedRowData.municipality}/${clickedRowData.wardNo}`
//       : undefined,
//     {
//       skip: !clickedRowData?.bloodGroup?.bloodGroupName || !clickedRowData?.municipality || !clickedRowData?.wardNo
//     }
//   );
  
//   // Log errors for donor data
//   useEffect(() => {
//     if (donorsError) {
//       console.error("Error fetching donors data:", donorsError);
//     }
//   }, [donorsError]);

//   // Process donors and calculate distances with improved error handling
//   useEffect(() => {
//     const processData = async () => {
//       if (!newDonors || donorsLoading || !clickedRowData) {
//         return;
//       }
      
//       setLoading(true);
//       setGeocodingFailed(false);
      
//       // Determine reference address for geocoding
//       let referenceAddress = '';
//       let referenceName = '';
      
//       if (isHospitalAdmin && userHospital && !userHospitalLoading) {
//         // Use hospital address
//         referenceAddress = `${userHospital.municipality}, ${userHospital.district}, ${userHospital.province}`;
//         referenceName = userHospital.hospitalName;
//         console.log("Using hospital as reference:", referenceAddress);
//       } else {
//         // Use patient address
//         referenceAddress = `${clickedRowData.municipality}, ${clickedRowData.district}, ${clickedRowData.province}`;
//         referenceName = `${clickedRowData.municipality} - Ward ${clickedRowData.wardNo}`;
//         console.log("Using patient as reference:", referenceAddress);
//       }
      
//       // Geocode reference location
//       const coords = await geocodeAddress(referenceAddress);
      
//       if (!coords) {
//         console.warn("Could not geocode reference address:", referenceAddress);
        
//         // Try to get fallback coordinates for this district
//         const fallbackCoords = getDistrictFallbackCoordinates(clickedRowData.district) || NEPAL_CENTER;
//         console.log(`Using fallback coordinates for ${referenceName}:`, fallbackCoords);
        
//         setReferenceCoordinates(fallbackCoords);
//         setGeocodingFailed(true);
        
//         // Sort donors alphabetically since we can't calculate distances
//         const processedDonors = [...newDonors].sort((a, b) => 
//           a.donorName.localeCompare(b.donorName)
//         );
        
//         setAvailableDonors(processedDonors);
//         setLoading(false);
//         return;
//       }
      
//       console.log(`Geocoded reference (${referenceName}):`, coords);
//       setReferenceCoordinates(coords);
      
//       // Process and geocode each donor
//       const processedDonors: DonorWithDistance[] = [];
//       const geocodingPromises: Promise<void>[] = [];
      
//       // Create a map of already geocoded locations to reuse results and reduce API calls
//       const geocodedLocations = new Map<string, Coordinates>();
      
//       for (const donor of newDonors) {
//         // Construct donor address
//         const donorAddress = `${donor.municipality}, ${donor.district}, ${donor.province}`;
//         const locationKey = `${donor.municipality}-${donor.district}-${donor.province}`;
        
//         // Create a promise for geocoding this donor
//         const geocodingPromise = (async () => {
//           let donorCoords: Coordinates | null = null;
          
//           // Check if we've already geocoded this location
//           if (geocodedLocations.has(locationKey)) {
//             donorCoords = geocodedLocations.get(locationKey)!;
//             console.log(`Using cached geocoding for ${donor.donorName} at ${donorAddress}`);
//           } else {
//             // Geocode donor address
//             donorCoords = await geocodeAddress(donorAddress);
            
//             // Cache the result if successful
//             if (donorCoords) {
//               geocodedLocations.set(locationKey, donorCoords);
//             }
//           }
          
//           if (donorCoords) {
//             // Calculate distance
//             const distance = calculateDistance(
//               coords.latitude,
//               coords.longitude,
//               donorCoords.latitude,
//               donorCoords.longitude
//             );
            
//             processedDonors.push({
//               ...donor,
//               coordinates: donorCoords,
//               distance: parseFloat(distance.toFixed(1))
//             });
            
//             console.log(`Donor ${donor.donorName} distance: ${distance.toFixed(1)} km`);
//           } else {
//             // Use fallback coordinates for this district
//             const districtCoords = getDistrictFallbackCoordinates(donor.district);
            
//             if (districtCoords) {
//               const distance = calculateDistance(
//                 coords.latitude,
//                 coords.longitude,
//                 districtCoords.latitude,
//                 districtCoords.longitude
//               );
              
//               processedDonors.push({
//                 ...donor,
//                 coordinates: districtCoords,
//                 distance: parseFloat(distance.toFixed(1))
//               });
              
//               console.log(`Using district fallback for ${donor.donorName}, distance: ${distance.toFixed(1)} km`);
//             } else {
//               // No coordinates available
//               processedDonors.push(donor);
//               console.warn(`Could not geocode donor address: ${donorAddress}`);
//             }
//           }
//         })();
        
//         geocodingPromises.push(geocodingPromise);
        
//         // Add a small delay between API calls to avoid rate limiting
//         await new Promise(resolve => setTimeout(resolve, 300));
//       }
      
//       // Wait for all geocoding promises to complete
//       await Promise.all(geocodingPromises);
      
//       // Sort donors by distance
//       processedDonors.sort((a, b) => {
//         if (a.distance === undefined) return 1;
//         if (b.distance === undefined) return -1;
//         return a.distance - b.distance;
//       });
      
//       setAvailableDonors(processedDonors);
//       setLoading(false);
//     };
    
//     processData();
//   }, [
//     newDonors, 
//     donorsLoading, 
//     clickedRowData, 
//     userHospital, 
//     userHospitalLoading, 
//     isHospitalAdmin
//   ]);

//   // Show loading state when necessary
//   if ((loading && !availableDonors.length) || donorsLoading || userProfileLoading || 
//       (isHospitalAdmin && userProfile?.hospitalId && userHospitalLoading)) {
//     return <LinearProgress color="primary" />;
//   }

//   // Determine reference location name for display
//   const referenceLocationName = isHospitalAdmin && userHospital 
//     ? userHospital.hospitalName 
//     : `${clickedRowData?.municipality} - Ward ${clickedRowData?.wardNo}`;

//   return (
//     <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
//       <div className="w-3/4 flex flex-col md:flex-row items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
//         <span className="text-[#008080] w-full font-semibold text-xl mb-2">
//           Available Donors
//         </span>
//         <div className="w-full flex items-center gap-4">
//           <span className="text-lg text-[#008080]">
//             Ward No: {clickedRowData?.wardNo}
//           </span>
//           <span className="text-lg text-[#008080] cursor-pointer hover:underline">
//             Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
//           </span>
//           <button 
//             className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//             onClick={() => setShowMap(!showMap)}
//           >
//             {showMap ? "Hide Map" : "Show Map"}
//           </button>
//         </div>
//       </div>
      
//       <div className="w-3/4 bg-green-50 p-2 text-center border-b border-green-200">
//         {geocodingFailed ? (
//           <p className="text-amber-700">
//             Exact location data could not be found. Distances may be approximate.
//           </p>
//         ) : (
//           <p className="text-green-700">
//             Donors are sorted by distance from {referenceLocationName}
//           </p>
//         )}
//       </div>
      
//       {showMap && (
//         <div className="w-3/4 h-96 my-4 border border-gray-300 rounded-md shadow-sm">
//           <div ref={mapRef} className="w-full h-full"></div>
//         </div>
//       )}
      
//       <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
//         {loading && (
//           <p className="text-[#008080] text-lg w-full text-center my-2">Loading Available Donors...</p>
//         )}
//         {!loading && availableDonors?.length === 0 ? (
//           <p className="text-[#008080] text-lg w-full text-center m-2">
//             Oops, There are no available donors in your ward.
//           </p>
//         ) : (
//           <div className="w-full">
//             {/* Header row for column titles */}
//             <div className="w-full flex justify-between items-center p-2 border-b border-gray-200 font-semibold">
//               <span className="w-full text-lg text-[#008080]">Donor Name</span>
//               <span className="w-full text-lg text-[#008080]">Phone</span>
//               <span className="w-full text-lg text-[#008080]">Location</span>
//               <span className="w-full text-lg text-[#008080]">Distance</span>
//             </div>
            
//             {/* Donor rows */}
//             {availableDonors?.map((oneDonor: DonorWithDistance) => (
//               <div
//                 key={oneDonor.donorId}
//                 className="w-full flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50"
//               >
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.donorName}
//                 </span>
//                 <span
//                   className="w-full cursor-pointer hover:underline ml-2 text-lg font-semibold text-[#008080]"
//                   onClick={() => copyToClipboard(oneDonor.phoneNumber)}
//                   title="Click to copy"
//                 >
//                   {oneDonor.phoneNumber}
//                 </span>
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.municipality} - {oneDonor.wardNo}
//                 </span>
//                 <span className="w-full text-lg text-[#008080] font-semibold">
//                   {oneDonor.distance !== undefined ? `${oneDonor.distance} km` : 'N/A'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableDonors;


// first working (submit to sudip sir kcmit)


// import React, { useState, useEffect, useRef } from 'react';
// import { useReadRequestQuery } from '../api/apiHandler';
// import { useSelector } from 'react-redux';
// import { InitialState, ShowAvailableData, EditDonors } from '../models/datamodels';
// import { LinearProgress } from '@mui/material';
// import { toast } from 'react-toastify';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { coordinateService } from './CoordinateService';
// import { Coordinates, NEPAL_CENTER } from './NepalCoordinates';

// // Type for donor with distance
// interface DonorWithDistance extends EditDonors {
//   distance?: number;
//   coordinates?: Coordinates;
// }

// const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
//   const [availableDonors, setAvailableDonors] = useState<DonorWithDistance[]>([]);
//   const [referenceCoordinates, setReferenceCoordinates] = useState<Coordinates | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showMap, setShowMap] = useState<boolean>(false);
//   const [geocodingFailed, setGeocodingFailed] = useState<boolean>(false);
//   const mapRef = useRef<HTMLDivElement>(null);
//   const leafletMap = useRef<L.Map | null>(null);
  
//   // Get only the user type from Redux state, not the entire state
//   const userType = useSelector((state: any) => 
//     state?.auth?.userType?.userTypeName || 
//     state?.auth?.user?.userType || 
//     ''
//   );
  
//   // Determine if user is a hospital admin
//   const isHospitalAdmin = userType === 'Hospital Admin' || 
//                          userType === 'HospitalAdmin' || 
//                          userType === 'hospital_admin';
  
//   console.log("User Type:", userType);
//   console.log("Is Hospital Admin:", isHospitalAdmin);
  
//   // Fetch user profile data with proper error handling
//   const { 
//     data: userProfile, 
//     isLoading: userProfileLoading,
//     error: userProfileError 
//   } = useReadRequestQuery('/userprofile', {
//     // Skip if we're not a hospital admin to reduce unnecessary API calls
//     skip: !isHospitalAdmin
//   });
  
//   // Log errors for debugging
//   useEffect(() => {
//     if (userProfileError) {
//       console.error("Error fetching user profile:", userProfileError);
//     }
//   }, [userProfileError]);
  
//   // Fetch user's hospital data (if available)
//   const { 
//     data: userHospital, 
//     isLoading: userHospitalLoading,
//     error: userHospitalError 
//   } = useReadRequestQuery(
//     userProfile?.hospitalId ? `/hospitals/${userProfile.hospitalId}` : undefined,
//     { 
//       skip: !userProfile?.hospitalId || !isHospitalAdmin
//     }
//   );
  
//   // Log hospital data errors
//   useEffect(() => {
//     if (userHospitalError) {
//       console.error("Error fetching hospital data:", userHospitalError);
//     }
//   }, [userHospitalError]);

//   // Initialize Leaflet map
//   useEffect(() => {
//     if (showMap && mapRef.current) {
//       // Check if map already exists, if so, remove it
//       if (leafletMap.current) {
//         leafletMap.current.remove();
//         leafletMap.current = null;
//       }
      
//       try {
//         // Initialize the map with default Nepal center
//         leafletMap.current = L.map(mapRef.current).setView(
//           [NEPAL_CENTER.latitude, NEPAL_CENTER.longitude], 
//           8
//         );
        
//         // Add OpenStreetMap tile layer
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(leafletMap.current);
        
//         console.log("Map initialized");
//       } catch (error) {
//         console.error("Error initializing map:", error);
//       }
//     }
    
//     return () => {
//       if (leafletMap.current) {
//         leafletMap.current.remove();
//         leafletMap.current = null;
//       }
//     };
//   }, [showMap]);

//   // Update map markers when donor data changes
//   useEffect(() => {
//     if (showMap && leafletMap.current && referenceCoordinates) {
//       try {
//         // Clear existing markers
//         leafletMap.current.eachLayer(layer => {
//           if (layer instanceof L.Marker) {
//             leafletMap.current?.removeLayer(layer);
//           }
//         });
        
//         // Add reference marker (hospital or patient)
//         const redIcon = new L.Icon({
//           iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//           shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//           iconSize: [25, 41],
//           iconAnchor: [12, 41],
//           popupAnchor: [1, -34],
//           shadowSize: [41, 41]
//         });
        
//         const referenceMarker = L.marker(
//           [referenceCoordinates.latitude, referenceCoordinates.longitude],
//           { icon: redIcon }
//         ).addTo(leafletMap.current);
        
//         const locationName = isHospitalAdmin && userHospital 
//           ? userHospital.hospitalName 
//           : 'Patient Location';
        
//         referenceMarker.bindPopup(
//           `<b>${locationName}</b><br>
//           ${isHospitalAdmin && userHospital 
//             ? `${userHospital.municipality}, ${userHospital.district}` 
//             : `${clickedRowData?.municipality} - Ward ${clickedRowData?.wardNo}`}`
//         );
        
//         const markers = [referenceMarker];
        
//         // Add donor markers
//         availableDonors.forEach(donor => {
//           if (donor.coordinates) {
//             const donorMarker = L.marker([
//               donor.coordinates.latitude,
//               donor.coordinates.longitude
//             ]).addTo(leafletMap.current!);
            
//             donorMarker.bindPopup(
//               `<b>${donor.donorName}</b><br>
//               Phone: ${donor.phoneNumber}<br>
//               Location: ${donor.municipality} - Ward ${donor.wardNo}<br>
//               Distance: ${donor.distance?.toFixed(1)} km`
//             );
            
//             markers.push(donorMarker);
//           }
//         });
        
//         // Set view to include all markers
//         if (markers.length > 1) {
//           const group = L.featureGroup(markers);
//           leafletMap.current.fitBounds(group.getBounds(), {
//             padding: [50, 50]
//           });
//         } else {
//           leafletMap.current.setView(
//             [referenceCoordinates.latitude, referenceCoordinates.longitude], 
//             12
//           );
//         }
//       } catch (error) {
//         console.error("Error updating map markers:", error);
//       }
//     }
//   }, [showMap, availableDonors, referenceCoordinates, isHospitalAdmin, userHospital, clickedRowData]);

//   const copyToClipboard = (text: number) => {
//     navigator.clipboard
//       .writeText(text.toString())
//       .then(() => {
//         toast.success('Phone Number copied to clipboard');
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error('Could not copy to clipboard');
//       });
//   };

//   // Fetch donors with matching blood group, municipality, and ward
//   // Using a more robust approach with error handling
//   const { 
//     data: newDonors, 
//     isLoading: donorsLoading,
//     error: donorsError 
//   } = useReadRequestQuery(
//     clickedRowData?.bloodGroup?.bloodGroupName && clickedRowData?.municipality && clickedRowData?.wardNo
//       ? `/filtereddonors/${clickedRowData.bloodGroup.bloodGroupName}/${clickedRowData.municipality}/${clickedRowData.wardNo}`
//       : undefined,
//     {
//       skip: !clickedRowData?.bloodGroup?.bloodGroupName || !clickedRowData?.municipality || !clickedRowData?.wardNo
//     }
//   );
  
//   // Log errors for donor data
//   useEffect(() => {
//     if (donorsError) {
//       console.error("Error fetching donors data:", donorsError);
//     }
//   }, [donorsError]);

//   // Process donors and calculate distances using the CoordinateService
//   useEffect(() => {
//     const processData = async () => {
//       if (!newDonors || donorsLoading || !clickedRowData) {
//         return;
//       }
      
//       setLoading(true);
//       setGeocodingFailed(false);
      
//       // --------- DETERMINE REFERENCE COORDINATES (HOSPITAL OR PATIENT) ---------
//       let referenceCoords: Coordinates;
//       let referenceName = '';
      
//       try {
//         // CASE 1: User is a hospital admin with a hospital
//         if (isHospitalAdmin && userHospital && !userHospitalLoading) {
//           referenceName = userHospital.hospitalName;
//           console.log(`🏥 Using hospital as reference point: ${referenceName}`);
          
//           // Get hospital coordinates using our service
//           referenceCoords = await coordinateService.getHospitalCoordinates(userHospital);
//         } 
//         // CASE 2: Use patient location
//         else {
//           referenceName = `${clickedRowData.municipality} - Ward ${clickedRowData.wardNo}`;
//           console.log(`👤 Using patient as reference point: ${referenceName}`);
          
//           // Get patient coordinates using our service
//           referenceCoords = await coordinateService.getPatientCoordinates(clickedRowData);
//         }
        
//         console.log(`📍 Reference coordinates for ${referenceName}:`, referenceCoords);
//         setReferenceCoordinates(referenceCoords);
        
//         // Set flag if we had to use fallback coordinates
//         if (referenceCoords === NEPAL_CENTER) {
//           setGeocodingFailed(true);
//         }
//       } catch (error) {
//         console.error('Error determining reference coordinates:', error);
//         setReferenceCoordinates(NEPAL_CENTER);
//         setGeocodingFailed(true);
//         referenceCoords = NEPAL_CENTER;
//       }
      
//       // --------- PROCESS DONORS AND CALCULATE DISTANCES ---------
//       console.log(`🔍 Processing ${newDonors.length} donors...`);
//       const processedDonors: DonorWithDistance[] = [];
      
//       for (const donor of newDonors) {
//         try {
//           // Get donor coordinates using our service
//           const donorCoords = await coordinateService.getDonorCoordinates(donor);
          
//           // Calculate distance between reference and donor using the service
//           const distance = coordinateService.calculateDistance(
//             referenceCoords.latitude,
//             referenceCoords.longitude,
//             donorCoords.latitude,
//             donorCoords.longitude
//           );
          
//           processedDonors.push({
//             ...donor,
//             coordinates: donorCoords,
//             distance: distance
//           });
          
//           console.log(`📏 Donor ${donor.donorName} distance: ${distance} km`);
//         } catch (error) {
//           console.error(`Error processing donor ${donor.donorName}:`, error);
//           // Add donor without distance so they still appear in the list
//           processedDonors.push({
//             ...donor,
//             coordinates: NEPAL_CENTER,
//             distance: undefined
//           });
//           setGeocodingFailed(true);
//         }
//       }
      
//       // Sort donors by distance
//       processedDonors.sort((a, b) => {
//         if (a.distance === undefined) return 1;
//         if (b.distance === undefined) return -1;
//         return a.distance - b.distance;
//       });
      
//       console.log(`✅ Finished processing ${processedDonors.length} donors`);
//       setAvailableDonors(processedDonors);
//       setLoading(false);
//     };
    
//     processData();
//   }, [
//     newDonors, 
//     donorsLoading, 
//     clickedRowData, 
//     userHospital, 
//     userHospitalLoading, 
//     isHospitalAdmin
//   ]);

//   // Show loading state when necessary
//   if ((loading && !availableDonors.length) || donorsLoading || userProfileLoading || 
//       (isHospitalAdmin && userProfile?.hospitalId && userHospitalLoading)) {
//     return <LinearProgress color="primary" />;
//   }

//   // Determine reference location name for display
//   const referenceLocationName = isHospitalAdmin && userHospital 
//     ? userHospital.hospitalName 
//     : `${clickedRowData?.municipality} - Ward ${clickedRowData?.wardNo}`;

//   return (
//     <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
//       <div className="w-3/4 flex flex-col md:flex-row items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
//         <span className="text-[#008080] w-full font-semibold text-xl mb-2">
//           Available Donors
//         </span>
//         <div className="w-full flex items-center gap-4">
//           <span className="text-lg text-[#008080]">
//             Ward No: {clickedRowData?.wardNo}
//           </span>
//           <span className="text-lg text-[#008080] cursor-pointer hover:underline">
//             Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
//           </span>
//           <button 
//             className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//             onClick={() => setShowMap(!showMap)}
//           >
//             {showMap ? "Hide Map" : "Show Map"}
//           </button>
//         </div>
//       </div>
      
//       <div className="w-3/4 bg-green-50 p-2 text-center border-b border-green-200">
//         {geocodingFailed ? (
//           <p className="text-amber-700">
//             Exact location data could not be found. Distances may be approximate.
//           </p>
//         ) : (
//           <p className="text-green-700">
//             Donors are sorted by distance from {referenceLocationName}
//           </p>
//         )}
//       </div>
      
//       {referenceCoordinates && (
//         <div className="w-3/4 bg-blue-50 p-2 text-center border-b border-blue-200">
//           <p className="text-blue-700">
//             Reference coordinates: {referenceCoordinates.latitude.toFixed(4)}, {referenceCoordinates.longitude.toFixed(4)}
//           </p>
//         </div>
//       )}
      
//       {showMap && (
//         <div className="w-3/4 h-96 my-4 border border-gray-300 rounded-md shadow-sm">
//           <div ref={mapRef} className="w-full h-full"></div>
//         </div>
//       )}
      
//       <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
//         {loading && (
//           <div className="w-full text-center my-4">
//             <p className="text-[#008080] text-lg mb-2">Loading Available Donors...</p>
//             <LinearProgress color="primary" />
//           </div>
//         )}
//         {!loading && availableDonors?.length === 0 ? (
//           <div className="w-full text-center py-6">
//             <p className="text-[#008080] text-lg m-2">
//               Oops, There are no available donors in your ward.
//             </p>
//             <p className="text-gray-600">
//               Try expanding your search to nearby wards or municipalities.
//             </p>
//           </div>
//         ) : (
//           <div className="w-full">
//             {/* Header row for column titles */}
//             <div className="w-full flex justify-between items-center p-2 border-b border-gray-200 font-semibold sticky top-0 bg-white">
//               <span className="w-full text-lg text-[#008080]">Donor Name</span>
//               <span className="w-full text-lg text-[#008080]">Phone</span>
//               <span className="w-full text-lg text-[#008080]">Location</span>
//               <span className="w-full text-lg text-[#008080]">Distance</span>
//             </div>
            
//             {/* Donor rows */}
//             {availableDonors?.map((oneDonor: DonorWithDistance, index) => (
//               <div
//                 key={oneDonor.donorId}
//                 className={`w-full flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50 ${
//                   index === 0 && oneDonor.distance !== undefined && oneDonor.distance < 5 ? 'bg-green-50' : ''
//                 }`}
//               >
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.donorName}
//                 </span>
//                 <span
//                   className="w-full cursor-pointer hover:underline hover:text-[#005050] ml-2 text-lg font-semibold text-[#008080] flex items-center"
//                   onClick={() => copyToClipboard(oneDonor.phoneNumber)}
//                   title="Click to copy to clipboard"
//                 >
//                   {oneDonor.phoneNumber}
//                   <span className="ml-2 text-xs text-gray-500">(click to copy)</span>
//                 </span>
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.municipality} - {oneDonor.wardNo}
//                 </span>
//                 <span className="w-full text-lg font-semibold">
//                   {oneDonor.distance !== undefined ? (
//                     <span 
//                       className={`${
//                         oneDonor.distance < 5 ? 'text-green-600' :
//                         oneDonor.distance < 20 ? 'text-[#008080]' :
//                         oneDonor.distance < 50 ? 'text-amber-600' : 'text-red-600'
//                       }`}
//                       title={`Based on coordinates: ${oneDonor.coordinates?.latitude.toFixed(4)}, ${oneDonor.coordinates?.longitude.toFixed(4)}`}
//                     >
//                       {oneDonor.distance} km
//                       {oneDonor.distance < 5 && " ✓"}
//                     </span>
//                   ) : (
//                     <span className="text-gray-500">N/A</span>
//                   )}
//                 </span>
//               </div>
//             ))}
            
//             {/* Summary information */}
//             {!loading && availableDonors?.length > 0 && (
//               <div className="w-full p-3 mt-4 bg-gray-50 rounded-md">
//                 <p className="text-[#008080] font-medium">
//                   Found {availableDonors.length} donor{availableDonors.length !== 1 ? 's' : ''} matching blood group {clickedRowData?.bloodGroup.bloodGroupName}
//                 </p>
//                 <p className="text-gray-600 text-sm mt-1">
//                   {availableDonors.filter(d => d.distance !== undefined && d.distance < 10).length} donors are within 10km of your location.
//                 </p>
//                 {geocodingFailed && (
//                   <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
//                     <p>⚠️ Some location data could not be precisely determined. Distance calculations may be approximate.</p>
//                     <p className="mt-1">The system has used district-level or provincial-level coordinates where exact locations were unavailable.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableDonors;



// second with accurate hospital coordinates

// import React, { useState, useEffect, useRef } from 'react';
// import { useReadRequestQuery } from '../api/apiHandler';
// import { useSelector } from 'react-redux';
// import { InitialState, ShowAvailableData, EditDonors } from '../models/datamodels';
// import { LinearProgress } from '@mui/material';
// import { toast } from 'react-toastify';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { coordinateService } from './CoordinateService';
// import { Coordinates, NEPAL_CENTER } from './NepalCoordinates';

// // Type for donor with distance
// interface DonorWithDistance extends EditDonors {
//   distance?: number;
//   coordinates?: Coordinates;
// }

// const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
//   const [availableDonors, setAvailableDonors] = useState<DonorWithDistance[]>([]);
//   const [referenceCoordinates, setReferenceCoordinates] = useState<Coordinates | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showMap, setShowMap] = useState<boolean>(false);
//   const [geocodingFailed, setGeocodingFailed] = useState<boolean>(false);
//   const mapRef = useRef<HTMLDivElement>(null);
//   const leafletMap = useRef<L.Map | null>(null);
  
//   // Get user information from Redux state
//   const userState = useSelector((state: any) => state?.auth || {});
  
//   // Log all user data to understand what's available
//   console.log("Full User Data:", userState);
//   console.log("User Type:", userState?.userType?.userTypeName || userState?.user?.userType || '');
//   console.log("User ID:", userState?.user?.userId || userState?.userId || '');
//   console.log("User Hospital ID:", userState?.user?.hospitalId || userState?.hospitalId || '');
  
//   // Fetch user profile data for all users (not just hospital admins)
//   const { 
//     data: userProfile, 
//     isLoading: userProfileLoading,
//     error: userProfileError 
//   } = useReadRequestQuery('/userprofile', {
//     // No skip condition - we want this for all users
//   });
  
//   // Log user profile data to understand what's available
//   useEffect(() => {
//     if (userProfile) {
//       console.log("User Profile Data:", userProfile);
//       console.log("Associated Hospital ID:", userProfile.hospitalId);
//     }
//     if (userProfileError) {
//       console.error("Error fetching user profile:", userProfileError);
//     }
//   }, [userProfile, userProfileError]);
  
//   // Fetch user's hospital data based on profile
//   const { 
//     data: userHospital, 
//     isLoading: userHospitalLoading,
//     error: userHospitalError 
//   } = useReadRequestQuery(
//     userProfile?.hospitalId ? `/hospitals/${userProfile.hospitalId}` : undefined,
//     { 
//       skip: !userProfile?.hospitalId
//     }
//   );
  
//   // Log hospital information
//   useEffect(() => {
//     if (userHospital) {
//       console.log("User's Hospital Data:", userHospital);
//       console.log("Hospital Location:", userHospital.municipality, userHospital.district, userHospital.province);
//     }
//     if (userHospitalError) {
//       console.error("Error fetching hospital data:", userHospitalError);
//     }
//   }, [userHospital, userHospitalError]);

//   // Initialize Leaflet map
//   useEffect(() => {
//     if (showMap && mapRef.current) {
//       // Check if map already exists, if so, remove it
//       if (leafletMap.current) {
//         leafletMap.current.remove();
//         leafletMap.current = null;
//       }
      
//       try {
//         // Initialize the map with default Nepal center
//         leafletMap.current = L.map(mapRef.current).setView(
//           [NEPAL_CENTER.latitude, NEPAL_CENTER.longitude], 
//           8
//         );
        
//         // Add OpenStreetMap tile layer
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(leafletMap.current);
        
//         console.log("Map initialized");
//       } catch (error) {
//         console.error("Error initializing map:", error);
//       }
//     }
    
//     return () => {
//       if (leafletMap.current) {
//         leafletMap.current.remove();
//         leafletMap.current = null;
//       }
//     };
//   }, [showMap]);

//   // Update map markers when donor data changes
//   useEffect(() => {
//     if (showMap && leafletMap.current && referenceCoordinates) {
//       try {
//         // Clear existing markers
//         leafletMap.current.eachLayer(layer => {
//           if (layer instanceof L.Marker) {
//             leafletMap.current?.removeLayer(layer);
//           }
//         });
        
//         // Add reference marker (hospital)
//         const redIcon = new L.Icon({
//           iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//           shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//           iconSize: [25, 41],
//           iconAnchor: [12, 41],
//           popupAnchor: [1, -34],
//           shadowSize: [41, 41]
//         });
        
//         const referenceMarker = L.marker(
//           [referenceCoordinates.latitude, referenceCoordinates.longitude],
//           { icon: redIcon }
//         ).addTo(leafletMap.current);
        
//         // Always use hospital name as reference location
//         const locationName = userHospital?.hospitalName || 'Hospital Location';
        
//         referenceMarker.bindPopup(
//           `<b>${locationName}</b><br>
//           ${userHospital ? 
//             `${userHospital.municipality}, ${userHospital.district}` : 
//             'Location details not available'}`
//         );
        
//         const markers = [referenceMarker];
        
//         // Add donor markers
//         availableDonors.forEach(donor => {
//           if (donor.coordinates) {
//             const donorMarker = L.marker([
//               donor.coordinates.latitude,
//               donor.coordinates.longitude
//             ]).addTo(leafletMap.current!);
            
//             donorMarker.bindPopup(
//               `<b>${donor.donorName}</b><br>
//               Phone: ${donor.phoneNumber}<br>
//               Location: ${donor.municipality} - Ward ${donor.wardNo}<br>
//               Distance: ${donor.distance?.toFixed(1)} km`
//             );
            
//             markers.push(donorMarker);
//           }
//         });
        
//         // Set view to include all markers
//         if (markers.length > 1) {
//           const group = L.featureGroup(markers);
//           leafletMap.current.fitBounds(group.getBounds(), {
//             padding: [50, 50]
//           });
//         } else {
//           leafletMap.current.setView(
//             [referenceCoordinates.latitude, referenceCoordinates.longitude], 
//             12
//           );
//         }
//       } catch (error) {
//         console.error("Error updating map markers:", error);
//       }
//     }
//   }, [showMap, availableDonors, referenceCoordinates, userHospital, clickedRowData]);

//   const copyToClipboard = (text: number) => {
//     navigator.clipboard
//       .writeText(text.toString())
//       .then(() => {
//         toast.success('Phone Number copied to clipboard');
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error('Could not copy to clipboard');
//       });
//   };

//   // Fetch donors with matching blood group, municipality, and ward
//   const { 
//     data: newDonors, 
//     isLoading: donorsLoading,
//     error: donorsError 
//   } = useReadRequestQuery(
//     clickedRowData?.bloodGroup?.bloodGroupName && clickedRowData?.municipality && clickedRowData?.wardNo
//       ? `/filtereddonors/${clickedRowData.bloodGroup.bloodGroupName}/${clickedRowData.municipality}/${clickedRowData.wardNo}`
//       : undefined,
//     {
//       skip: !clickedRowData?.bloodGroup?.bloodGroupName || !clickedRowData?.municipality || !clickedRowData?.wardNo
//     }
//   );
  
//   // Log errors for donor data
//   useEffect(() => {
//     if (donorsError) {
//       console.error("Error fetching donors data:", donorsError);
//     }
//   }, [donorsError]);

//   // Process donors and calculate distances using the CoordinateService
//   useEffect(() => {
//     const processData = async () => {
//       if (!newDonors || donorsLoading || !clickedRowData) {
//         return;
//       }
      
//       setLoading(true);
//       setGeocodingFailed(false);
      
//       // --------- DETERMINE REFERENCE COORDINATES (ALWAYS HOSPITAL) ---------
//       let referenceCoords: Coordinates;
//       let referenceName = '';
      
//       try {
//         // CASE: User has an affiliated hospital
//         if (userHospital && !userHospitalLoading) {
//           referenceName = userHospital.hospitalName;
//           console.log(`🏥 Using affiliated hospital as reference point: ${referenceName}`);
          
//           // Get hospital coordinates using our service
//           referenceCoords = coordinateService.getHospitalCoordinates(userHospital);
//         } 
//         // FALLBACK: No hospital found
//         else {
//           console.log(`⚠️ No affiliated hospital found, using Nepal center`);
//           referenceName = "Default Location";
//           referenceCoords = NEPAL_CENTER;
//           setGeocodingFailed(true);
//         }
        
//         console.log(`📍 Reference coordinates for ${referenceName}:`, referenceCoords);
//         setReferenceCoordinates(referenceCoords);
        
//         // Set flag if we had to use fallback coordinates
//         if (referenceCoords === NEPAL_CENTER) {
//           setGeocodingFailed(true);
//         }
//       } catch (error) {
//         console.error('Error determining reference coordinates:', error);
//         setReferenceCoordinates(NEPAL_CENTER);
//         setGeocodingFailed(true);
//         referenceCoords = NEPAL_CENTER;
//       }
      
//       // --------- PROCESS DONORS AND CALCULATE DISTANCES ---------
//       console.log(`🔍 Processing ${newDonors.length} donors...`);
//       const processedDonors: DonorWithDistance[] = [];
      
//       for (const donor of newDonors) {
//         try {
//           // Get donor coordinates using our service
//           const donorCoords = coordinateService.getDonorCoordinates(donor);
          
//           // Calculate distance between reference and donor using the service
//           const distance = coordinateService.calculateDistance(
//             referenceCoords.latitude,
//             referenceCoords.longitude,
//             donorCoords.latitude,
//             donorCoords.longitude
//           );
          
//           processedDonors.push({
//             ...donor,
//             coordinates: donorCoords,
//             distance: distance
//           });
          
//           console.log(`📏 Donor ${donor.donorName} distance: ${distance} km`);
//         } catch (error) {
//           console.error(`Error processing donor ${donor.donorName}:`, error);
//           // Add donor without distance so they still appear in the list
//           processedDonors.push({
//             ...donor,
//             coordinates: NEPAL_CENTER,
//             distance: undefined
//           });
//           setGeocodingFailed(true);
//         }
//       }
      
//       // Sort donors by distance
//       processedDonors.sort((a, b) => {
//         if (a.distance === undefined) return 1;
//         if (b.distance === undefined) return -1;
//         return a.distance - b.distance;
//       });
      
//       console.log(`✅ Finished processing ${processedDonors.length} donors`);
//       setAvailableDonors(processedDonors);
//       setLoading(false);
//     };
    
//     processData();
//   }, [
//     newDonors, 
//     donorsLoading, 
//     clickedRowData, 
//     userHospital, 
//     userHospitalLoading
//   ]);

//   // Show loading state when necessary
//   if ((loading && !availableDonors.length) || donorsLoading || userProfileLoading || 
//       (userProfile?.hospitalId && userHospitalLoading)) {
//     return <LinearProgress color="primary" />;
//   }

//   // Determine reference location name for display
//   const referenceLocationName = userHospital 
//     ? userHospital.hospitalName 
//     : "Your Hospital";

//   return (
//     <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
//       <div className="w-3/4 flex flex-col md:flex-row items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
//         <span className="text-[#008080] w-full font-semibold text-xl mb-2">
//           Available Donors
//         </span>
//         <div className="w-full flex items-center gap-4">
//           <span className="text-lg text-[#008080]">
//             Ward No: {clickedRowData?.wardNo}
//           </span>
//           <span className="text-lg text-[#008080] cursor-pointer hover:underline">
//             Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
//           </span>
//           <button 
//             className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//             onClick={() => setShowMap(!showMap)}
//           >
//             {showMap ? "Hide Map" : "Show Map"}
//           </button>
//         </div>
//       </div>
      
//       <div className="w-3/4 bg-green-50 p-2 text-center border-b border-green-200">
//         {geocodingFailed ? (
//           <p className="text-amber-700">
//             Exact location data could not be found. Distances may be approximate.
//           </p>
//         ) : (
//           <p className="text-green-700">
//             Donors are sorted by distance from {referenceLocationName}
//           </p>
//         )}
//       </div>
      
//       {referenceCoordinates && (
//         <div className="w-3/4 bg-blue-50 p-2 text-center border-b border-blue-200">
//           <p className="text-blue-700">
//             Hospital coordinates: {referenceCoordinates.latitude.toFixed(4)}, {referenceCoordinates.longitude.toFixed(4)}
//           </p>
//         </div>
//       )}
      
//       {showMap && (
//         <div className="w-3/4 h-96 my-4 border border-gray-300 rounded-md shadow-sm">
//           <div ref={mapRef} className="w-full h-full"></div>
//         </div>
//       )}
      
//       <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
//         {loading && (
//           <div className="w-full text-center my-4">
//             <p className="text-[#008080] text-lg mb-2">Loading Available Donors...</p>
//             <LinearProgress color="primary" />
//           </div>
//         )}
//         {!loading && availableDonors?.length === 0 ? (
//           <div className="w-full text-center py-6">
//             <p className="text-[#008080] text-lg m-2">
//               Oops, There are no available donors in your ward.
//             </p>
//             <p className="text-gray-600">
//               Try expanding your search to nearby wards or municipalities.
//             </p>
//           </div>
//         ) : (
//           <div className="w-full">
//             {/* Header row for column titles */}
//             <div className="w-full flex justify-between items-center p-2 border-b border-gray-200 font-semibold sticky top-0 bg-white">
//               <span className="w-full text-lg text-[#008080]">Donor Name</span>
//               <span className="w-full text-lg text-[#008080]">Phone</span>
//               <span className="w-full text-lg text-[#008080]">Location</span>
//               <span className="w-full text-lg text-[#008080]">Distance</span>
//             </div>
            
//             {/* Donor rows */}
//             {availableDonors?.map((oneDonor: DonorWithDistance, index) => (
//               <div
//                 key={oneDonor.donorId}
//                 className={`w-full flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50 ${
//                   index === 0 && oneDonor.distance !== undefined && oneDonor.distance < 5 ? 'bg-green-50' : ''
//                 }`}
//               >
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.donorName}
//                 </span>
//                 <span
//                   className="w-full cursor-pointer hover:underline hover:text-[#005050] ml-2 text-lg font-semibold text-[#008080] flex items-center"
//                   onClick={() => copyToClipboard(oneDonor.phoneNumber)}
//                   title="Click to copy to clipboard"
//                 >
//                   {oneDonor.phoneNumber}
//                   <span className="ml-2 text-xs text-gray-500">(click to copy)</span>
//                 </span>
//                 <span className="w-full text-lg text-[#008080]">
//                   {oneDonor.municipality} - {oneDonor.wardNo}
//                 </span>
//                 <span className="w-full text-lg font-semibold">
//                   {oneDonor.distance !== undefined ? (
//                     <span 
//                       className={`${
//                         oneDonor.distance < 5 ? 'text-green-600' :
//                         oneDonor.distance < 20 ? 'text-[#008080]' :
//                         oneDonor.distance < 50 ? 'text-amber-600' : 'text-red-600'
//                       }`}
//                       title={`Based on coordinates: ${oneDonor.coordinates?.latitude.toFixed(4)}, ${oneDonor.coordinates?.longitude.toFixed(4)}`}
//                     >
//                       {oneDonor.distance} km
//                       {oneDonor.distance < 5 && " ✓"}
//                     </span>
//                   ) : (
//                     <span className="text-gray-500">N/A</span>
//                   )}
//                 </span>
//               </div>
//             ))}
            
//             {/* Summary information */}
//             {!loading && availableDonors?.length > 0 && (
//               <div className="w-full p-3 mt-4 bg-gray-50 rounded-md">
//                 <p className="text-[#008080] font-medium">
//                   Found {availableDonors.length} donor{availableDonors.length !== 1 ? 's' : ''} matching blood group {clickedRowData?.bloodGroup.bloodGroupName}
//                 </p>
//                 <p className="text-gray-600 text-sm mt-1">
//                   {availableDonors.filter(d => d.distance !== undefined && d.distance < 10).length} donors are within 10km of your hospital.
//                 </p>
//                 {geocodingFailed && (
//                   <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
//                     <p>⚠️ Some location data could not be precisely determined. Distance calculations may be approximate.</p>
//                     <p className="mt-1">The system has used district-level or provincial-level coordinates where exact locations were unavailable.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableDonors;





import React, { useState, useEffect, useRef } from 'react';
import { useReadRequestQuery } from '../api/apiHandler';
import { useSelector } from 'react-redux';
import { InitialState, ShowAvailableData, EditDonors } from '../models/datamodels';
import { LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { coordinateService } from './CoordinateService';
import { Coordinates, NEPAL_CENTER } from './NepalCoordinates';

// Enhanced type for donor with distance, scores and rank
interface DonorWithScores extends EditDonors {
  distance?: number;
  coordinates?: Coordinates;
  daysSinceLastDonation?: number;
  age?: number;
  proximityScore?: number;
  recencyScore?: number;
  ageScore?: number;
  totalScore?: number;
  rank?: number;
}

// Configuration for the recommendation algorithm
const RECOMMENDATION_CONFIG = {
  weights: {
    proximity: 0.5,  // 50% weight
    recency: 0.3,    // 30% weight
    age: 0.2         // 20% weight
  },
  recency: {
    minEligibleDays: 90,  // Minimum days since last donation to be eligible
    optimalDays: 120,     // Optimal days since last donation (highest score)
    maxEligibleDays: 365  // Maximum days since last donation (lowest score)
  },
  age: {
    minAge: 18,  // Minimum preferred age
    maxAge: 37   // Maximum preferred age
  }
};

const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
  const [availableDonors, setAvailableDonors] = useState<DonorWithScores[]>([]);
  const [referenceCoordinates, setReferenceCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [geocodingFailed, setGeocodingFailed] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  
  // Get user information from Redux state
  const userState = useSelector((state: any) => state?.auth || {});
  
  // Log all user data to understand what's available
  console.log("Full User Data:", userState);
  console.log("User Type:", userState?.userType?.userTypeName || userState?.user?.userType || '');
  console.log("User ID:", userState?.user?.userId || userState?.userId || '');
  console.log("User Hospital ID:", userState?.user?.hospitalId || userState?.hospitalId || '');
  
  // Fetch user profile data for all users
  const { 
    data: userProfile, 
    isLoading: userProfileLoading,
    error: userProfileError 
  } = useReadRequestQuery('/userprofile', {});
  
  // Log user profile data to understand what's available
  useEffect(() => {
    if (userProfile) {
      console.log("User Profile Data:", userProfile);
      console.log("Associated Hospital ID:", userProfile.hospitalId);
    }
    if (userProfileError) {
      console.error("Error fetching user profile:", userProfileError);
    }
  }, [userProfile, userProfileError]);
  
  // Fetch user's hospital data based on profile
  const { 
    data: userHospital, 
    isLoading: userHospitalLoading,
    error: userHospitalError 
  } = useReadRequestQuery(
    userProfile?.hospitalId ? `/hospitals/${userProfile.hospitalId}` : undefined,
    { 
      skip: !userProfile?.hospitalId
    }
  );
  
  // Log hospital information
  useEffect(() => {
    if (userHospital) {
      console.log("User's Hospital Data:", userHospital);
      console.log("Hospital Location:", userHospital.municipality, userHospital.district, userHospital.province);
    }
    if (userHospitalError) {
      console.error("Error fetching hospital data:", userHospitalError);
    }
  }, [userHospital, userHospitalError]);

  // Initialize Leaflet map
  useEffect(() => {
    if (showMap && mapRef.current) {
      // Check if map already exists, if so, remove it
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
      
      try {
        // Initialize the map with default Nepal center
        leafletMap.current = L.map(mapRef.current).setView(
          [NEPAL_CENTER.latitude, NEPAL_CENTER.longitude], 
          8
        );
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMap.current);
        
        console.log("Map initialized");
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [showMap]);

  // Update map markers when donor data changes
  useEffect(() => {
    if (showMap && leafletMap.current && referenceCoordinates) {
      try {
        // Clear existing markers
        leafletMap.current.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            leafletMap.current?.removeLayer(layer);
          }
        });
        
        // Add reference marker (hospital)
        const redIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        const referenceMarker = L.marker(
          [referenceCoordinates.latitude, referenceCoordinates.longitude],
          { icon: redIcon }
        ).addTo(leafletMap.current);
        
        // Always use hospital name as reference location
        const locationName = userHospital?.hospitalName || 'Hospital Location';
        
        referenceMarker.bindPopup(
          `<b>${locationName}</b><br>
          ${userHospital ? 
            `${userHospital.municipality}, ${userHospital.district}` : 
            'Location details not available'}`
        );
        
        const markers = [referenceMarker];
        
        // Add donor markers
        availableDonors.forEach(donor => {
          if (donor.coordinates) {
            const donorMarker = L.marker([
              donor.coordinates.latitude,
              donor.coordinates.longitude
            ]).addTo(leafletMap.current!);
            
            // Enhanced popup with additional information
            donorMarker.bindPopup(
              `<b>${donor.donorName}</b><br>
              <b>Rank:</b> ${donor.rank || 'N/A'}<br>
              <b>Score:</b> ${donor.totalScore ? (donor.totalScore * 100).toFixed(1) + '%' : 'N/A'}<br>
              <b>Phone:</b> ${donor.phoneNumber}<br>
              <b>Location:</b> ${donor.municipality} - Ward ${donor.wardNo}<br>
              <b>Distance:</b> ${donor.distance?.toFixed(1)} km<br>
              <b>Age:</b> ${donor.age || 'N/A'}<br>
              <b>Last Donated:</b> ${donor.daysSinceLastDonation ? donor.daysSinceLastDonation + ' days ago' : 'N/A'}`
            );
            
            markers.push(donorMarker);
          }
        });
        
        // Set view to include all markers
        if (markers.length > 1) {
          const group = L.featureGroup(markers);
          leafletMap.current.fitBounds(group.getBounds(), {
            padding: [50, 50]
          });
        } else {
          leafletMap.current.setView(
            [referenceCoordinates.latitude, referenceCoordinates.longitude], 
            12
          );
        }
      } catch (error) {
        console.error("Error updating map markers:", error);
      }
    }
  }, [showMap, availableDonors, referenceCoordinates, userHospital, clickedRowData]);

  const copyToClipboard = (text: number) => {
    navigator.clipboard
      .writeText(text.toString())
      .then(() => {
        toast.success('Phone Number copied to clipboard');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Could not copy to clipboard');
      });
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string | Date): number | undefined => {
    if (!dateOfBirth) return undefined;
    
    try {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error("Error calculating age:", error);
      return undefined;
    }
  };
  
  // Helper function to calculate days since last donation
  const calculateDaysSinceLastDonation = (lastDonated: string | Date): number | undefined => {
    if (!lastDonated) return undefined;
    
    try {
      const lastDonationDate = new Date(lastDonated);
      const today = new Date();
      
      // Calculate difference in milliseconds and convert to days
      const diffTime = Math.abs(today.getTime() - lastDonationDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error calculating days since last donation:", error);
      return undefined;
    }
  };
  
  // Helper function to calculate proximity score (0-1)
  const calculateProximityScore = (distance: number | undefined, maxDistance: number): number => {
    if (distance === undefined) return 0;
    return 1 - Math.min(distance / maxDistance, 1);
  };
  
  // Helper function to calculate recency score (0-1)
  const calculateRecencyScore = (daysSinceLastDonation: number | undefined): number => {
    if (daysSinceLastDonation === undefined) return 0;
    
    const { minEligibleDays, optimalDays, maxEligibleDays } = RECOMMENDATION_CONFIG.recency;
    
    // Ineligible if donated too recently
    if (daysSinceLastDonation < minEligibleDays) return 0;
    
    // Perfect score if at optimal days
    if (daysSinceLastDonation <= optimalDays) return 1;
    
    // Ineligible if donated too long ago
    if (daysSinceLastDonation > maxEligibleDays) return 0;
    
    // Linear interpolation between optimal and max eligible days
    return 1 - ((daysSinceLastDonation - optimalDays) / (maxEligibleDays - optimalDays));
  };
  
  // Helper function to calculate age score (0-1)
  const calculateAgeScore = (age: number | undefined): number => {
    if (age === undefined) return 0;
    
    const { minAge, maxAge } = RECOMMENDATION_CONFIG.age;
    
    // Age below minimum gets highest score
    if (age < minAge) return 1;
    
    // Age above maximum gets lowest score
    if (age > maxAge) return 0;
    
    // Linear interpolation between min and max age
    return 1 - ((age - minAge) / (maxAge - minAge));
  };
  
  // Fetch donors with matching blood group, municipality, and ward
  const { 
    data: newDonors, 
    isLoading: donorsLoading,
    error: donorsError 
  } = useReadRequestQuery(
    clickedRowData?.bloodGroup?.bloodGroupName && clickedRowData?.municipality && clickedRowData?.wardNo
      ? `/filtereddonors/${clickedRowData.bloodGroup.bloodGroupName}/${clickedRowData.municipality}/${clickedRowData.wardNo}`
      : undefined,
    {
      skip: !clickedRowData?.bloodGroup?.bloodGroupName || !clickedRowData?.municipality || !clickedRowData?.wardNo
    }
  );
  
  // Log errors for donor data
  useEffect(() => {
    if (donorsError) {
      console.error("Error fetching donors data:", donorsError);
    }
  }, [donorsError]);

  // Process donors and calculate distances and scores using the CoordinateService
  useEffect(() => {
    const processData = async () => {
      if (!newDonors || donorsLoading || !clickedRowData) {
        return;
      }
      
      setLoading(true);
      setGeocodingFailed(false);
      
      // --------- DETERMINE REFERENCE COORDINATES (ALWAYS HOSPITAL) ---------
      let referenceCoords: Coordinates;
      let referenceName = '';
      
      try {
        // CASE: User has an affiliated hospital
        if (userHospital && !userHospitalLoading) {
          referenceName = userHospital.hospitalName;
          console.log(`🏥 Using affiliated hospital as reference point: ${referenceName}`);
          
          // Get hospital coordinates using our service
          referenceCoords = coordinateService.getHospitalCoordinates(userHospital);
        } 
        // FALLBACK: No hospital found
        else {
          console.log(`⚠️ No affiliated hospital found, using Nepal center`);
          referenceName = "Default Location";
          referenceCoords = NEPAL_CENTER;
          setGeocodingFailed(true);
        }
        
        console.log(`📍 Reference coordinates for ${referenceName}:`, referenceCoords);
        setReferenceCoordinates(referenceCoords);
        
        // Set flag if we had to use fallback coordinates
        if (referenceCoords === NEPAL_CENTER) {
          setGeocodingFailed(true);
        }
      } catch (error) {
        console.error('Error determining reference coordinates:', error);
        setReferenceCoordinates(NEPAL_CENTER);
        setGeocodingFailed(true);
        referenceCoords = NEPAL_CENTER;
      }
      
      // --------- PROCESS DONORS AND CALCULATE DISTANCES & SCORES ---------
      console.log(`🔍 Processing ${newDonors.length} donors...`);
      const processedDonors: DonorWithScores[] = [];
      
      let maxDistance = 0;
      
      // First pass: Calculate distances and find maximum distance
      for (const donor of newDonors) {
        try {
          // Get donor coordinates using our service
          const donorCoords = coordinateService.getDonorCoordinates(donor);
          
          // Calculate distance between reference and donor using the service
          const distance = coordinateService.calculateDistance(
            referenceCoords.latitude,
            referenceCoords.longitude,
            donorCoords.latitude,
            donorCoords.longitude
          );
          
          // Update max distance for normalization
          if (distance > maxDistance) {
            maxDistance = distance;
          }
          
          // Calculate age and days since last donation
          const age = calculateAge(donor.dateOfBirth);
          const daysSinceLastDonation = calculateDaysSinceLastDonation(donor.lastDonated);
          
          processedDonors.push({
            ...donor,
            coordinates: donorCoords,
            distance: distance,
            age: age,
            daysSinceLastDonation: daysSinceLastDonation
          });
          
          console.log(`📏 Donor ${donor.donorName}: distance=${distance}km, age=${age}, lastDonated=${daysSinceLastDonation} days ago`);
        } catch (error) {
          console.error(`Error processing donor ${donor.donorName}:`, error);
          // Add donor without distance so they still appear in the list
          processedDonors.push({
            ...donor,
            coordinates: NEPAL_CENTER,
            distance: undefined,
            age: calculateAge(donor.dateOfBirth),
            daysSinceLastDonation: calculateDaysSinceLastDonation(donor.lastDonated)
          });
          setGeocodingFailed(true);
        }
      }
      
      // Ensure maxDistance is not 0 to avoid division by zero
      maxDistance = Math.max(maxDistance, 1);
      
      // Second pass: Calculate scores
      for (const donor of processedDonors) {
        // Calculate individual scores
        const proximityScore = calculateProximityScore(donor.distance, maxDistance);
        const recencyScore = calculateRecencyScore(donor.daysSinceLastDonation);
        const ageScore = calculateAgeScore(donor.age);
        
        // Calculate weighted total score
        const totalScore = (
          RECOMMENDATION_CONFIG.weights.proximity * proximityScore +
          RECOMMENDATION_CONFIG.weights.recency * recencyScore +
          RECOMMENDATION_CONFIG.weights.age * ageScore
        );
        
        // Update donor with scores
        donor.proximityScore = proximityScore;
        donor.recencyScore = recencyScore;
        donor.ageScore = ageScore;
        donor.totalScore = totalScore;
        
        console.log(`🔢 Donor ${donor.donorName} scores: proximity=${proximityScore.toFixed(2)}, recency=${recencyScore.toFixed(2)}, age=${ageScore.toFixed(2)}, total=${totalScore.toFixed(2)}`);
      }
      
      // Sort donors by total score (descending)
      processedDonors.sort((a, b) => {
        // Handle undefined scores
        if (a.totalScore === undefined) return 1;
        if (b.totalScore === undefined) return -1;
        return b.totalScore - a.totalScore;
      });
      
      // Add rank to each donor
      processedDonors.forEach((donor, index) => {
        donor.rank = index + 1;
      });
      
      console.log(`✅ Finished processing ${processedDonors.length} donors with enhanced scores`);
      setAvailableDonors(processedDonors);
      setLoading(false);
    };
    
    processData();
  }, [
    newDonors, 
    donorsLoading, 
    clickedRowData, 
    userHospital, 
    userHospitalLoading
  ]);

  // Show loading state when necessary
  if ((loading && !availableDonors.length) || donorsLoading || userProfileLoading || 
      (userProfile?.hospitalId && userHospitalLoading)) {
    return <LinearProgress color="primary" />;
  }

  // Determine reference location name for display
  const referenceLocationName = userHospital 
    ? userHospital.hospitalName 
    : "Your Hospital";

  return (
    <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
      <div className="w-3/4 flex flex-col md:flex-row items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
        <span className="text-[#008080] w-full font-semibold text-xl mb-2">
          Recommended Donors
        </span>
        <div className="w-full flex items-center gap-4">
          <span className="text-lg text-[#008080]">
            Ward No: {clickedRowData?.wardNo}
          </span>
          <span className="text-lg text-[#008080] cursor-pointer hover:underline">
            Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
          </span>
          <button 
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>
      </div>
      
      <div className="w-3/4 bg-green-50 p-2 text-center border-b border-green-200">
        {geocodingFailed ? (
          <p className="text-amber-700">
            Exact location data could not be found. Recommendations may be approximate.
          </p>
        ) : (
          <p className="text-green-700">
            Donors are ranked based on proximity, donation history, and age.
          </p>
        )}
      </div>
      
      {referenceCoordinates && (
        <div className="w-3/4 bg-blue-50 p-2 text-center border-b border-blue-200">
          <p className="text-blue-700">
            Hospital coordinates: {referenceCoordinates.latitude.toFixed(4)}, {referenceCoordinates.longitude.toFixed(4)}
          </p>
        </div>
      )}
      
      {showMap && (
        <div className="w-3/4 h-96 my-4 border border-gray-300 rounded-md shadow-sm">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      )}
      
      <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
        {loading && (
          <div className="w-full text-center my-4">
            <p className="text-[#008080] text-lg mb-2">Loading Recommended Donors...</p>
            <LinearProgress color="primary" />
          </div>
        )}
        {!loading && availableDonors?.length === 0 ? (
          <div className="w-full text-center py-6">
            <p className="text-[#008080] text-lg m-2">
              Oops, There are no available donors in your ward.
            </p>
            <p className="text-gray-600">
              Try expanding your search to nearby wards or municipalities.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Header row for column titles */}
            <div className="w-full flex justify-between items-center p-2 border-b border-gray-200 font-semibold sticky top-0 bg-white">
              <span className="w-1/6 text-lg text-[#008080]">Rank</span>
              <span className="w-full text-lg text-[#008080]">Donor Name</span>
              <span className="w-full text-lg text-[#008080]">Phone</span>
              <span className="w-full text-lg text-[#008080]">Location</span>
              <span className="w-full text-lg text-[#008080]">Distance</span>
              <span className="w-full text-lg text-[#008080]">Details</span>
            </div>
            
            {/* Donor rows */}
            {availableDonors?.map((oneDonor: DonorWithScores) => (
              <div
                key={oneDonor.donorId}
                className={`w-full flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50 ${
                  oneDonor.rank === 1 ? 'bg-green-50' : ''
                }`}
              >
                <span className="w-1/6 text-lg font-semibold">
                  <span 
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      oneDonor.rank === 1 ? 'bg-green-600 text-white' :
                      oneDonor.rank === 2 ? 'bg-green-500 text-white' :
                      oneDonor.rank === 3 ? 'bg-green-400 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}
                    title={`Overall Score: ${oneDonor.totalScore ? (oneDonor.totalScore * 100).toFixed(1) + '%' : 'N/A'}`}
                  >
                    {oneDonor.rank}
                  </span>
                </span>
                <span className="w-full text-lg text-[#008080]">
                  {oneDonor.donorName}
                </span>
                <span
                  className="w-full cursor-pointer hover:underline hover:text-[#005050] ml-2 text-lg font-semibold text-[#008080] flex items-center"
                  onClick={() => copyToClipboard(oneDonor.phoneNumber)}
                  title="Click to copy to clipboard"
                >
                  {oneDonor.phoneNumber}
                  <span className="ml-2 text-xs text-gray-500">(click to copy)</span>
                </span>
                <span className="w-full text-lg text-[#008080]">
                  {oneDonor.municipality} - {oneDonor.wardNo}
                </span>
                <span className="w-full text-lg font-semibold">
                  {oneDonor.distance !== undefined ? (
                    <span 
                      className={`${
                        oneDonor.distance < 5 ? 'text-green-600' :
                        oneDonor.distance < 20 ? 'text-[#008080]' :
                        oneDonor.distance < 50 ? 'text-amber-600' : 'text-red-600'
                      }`}
                      title={`Proximity Score: ${oneDonor.proximityScore ? (oneDonor.proximityScore * 100).toFixed(1) + '%' : 'N/A'}`}
                    >
                      {oneDonor.distance} km
                      {oneDonor.distance < 5 && " ✓"}
                    </span>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </span>
                <span className="w-full flex flex-col">
                  <span className="text-sm" title={`Age Score: ${oneDonor.ageScore ? (oneDonor.ageScore * 100).toFixed(1) + '%' : 'N/A'}`}>
                    Age: <span className="font-medium">{oneDonor.age || 'N/A'}</span>
                  </span>
                  <span className="text-sm" title={`Recency Score: ${oneDonor.recencyScore ? (oneDonor.recencyScore * 100).toFixed(1) + '%' : 'N/A'}`}>
                    Last Donated: 
                    <span className={`font-medium ml-1 ${
                      oneDonor.daysSinceLastDonation && oneDonor.daysSinceLastDonation >= 90 && oneDonor.daysSinceLastDonation <= 365 
                        ? 'text-green-600' 
                        : 'text-amber-600'
                    }`}>
                      {oneDonor.daysSinceLastDonation 
                        ? `${oneDonor.daysSinceLastDonation} days ago` 
                        : 'No record'}
                    </span>
                  </span>
                </span>
              </div>
            ))}
            
            {/* Summary information */}
            {!loading && availableDonors?.length > 0 && (
              <div className="w-full p-3 mt-4 bg-gray-50 rounded-md">
                <p className="text-[#008080] font-medium">
                  Found {availableDonors.length} donor{availableDonors.length !== 1 ? 's' : ''} matching blood group {clickedRowData?.bloodGroup.bloodGroupName}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {availableDonors.filter(d => d.distance !== undefined && d.distance < 10).length} donors are within 10km of your hospital.
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {availableDonors.filter(d => 
                    d.daysSinceLastDonation !== undefined && 
                    d.daysSinceLastDonation >= 90 && 
                    d.daysSinceLastDonation <= 365
                  ).length} donors have donated in the optimal timeframe (3-12 months ago).
                </p>
                {geocodingFailed && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <p>⚠️ Some location data could not be precisely determined. Distance calculations may be approximate.</p>
                    <p className="mt-1">The system has used district-level or provincial-level coordinates where exact locations were unavailable.</p>
                  </div>
                )}
                
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  <p className="font-medium">About our donor ranking:</p>
                  <p className="mt-1">Donors are ranked using weighted scores based on:</p>
                  <ul className="list-disc ml-6 mt-1">
                    <li><b>Proximity (50%):</b> Closer donors are prioritized</li>
                    <li><b>Donation Recency (30%):</b> Donors who last donated 4-12 months ago are prioritized</li>
                    <li><b>Age (20%):</b> Younger donors (18-37) are slightly prioritized</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableDonors;