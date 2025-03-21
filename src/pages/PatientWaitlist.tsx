// import { Link, useNavigate } from "react-router-dom";
// import * as React from "react";
// import { useState, useEffect } from "react";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import { useReadRequestQuery } from "../api/apiHandler";
// import { IoPersonAdd } from "react-icons/io5";
// import { LinearProgress } from "@mui/material";
// import { MdEditSquare, MdDelete } from "react-icons/md";
// import { useSelector } from "react-redux";
// import { InitialState, PatientData } from "../models/datamodels";
// import AvailableDonors from "../components/AvailableDonors";
// import DeleteDonor from "../components/Alert/DeleteAlert";

// interface Column {
//   id:
//     | "sno"
//     | "patientName"
//     | "bloodGroup"
//     | "phoneNumber"
//     | "municipality"
//     | "wardNo"
//     | "remarks"
//     | "actions";
//   label: string;
//   minWidth?: number;
//   align?: "center";
//   format?: (value: any) => string;
//   renderCondition?: (user: string | undefined) => boolean;
// }

// const columns: readonly Column[] = [
//   { id: "sno", label: "S.No", minWidth: 50, align: "center" },
//   { id: "patientName", label: "Patient Name", minWidth: 170, align: "center" },
//   {
//     id: "bloodGroup",
//     label: "Blood Group",
//     minWidth: 100,
//     align: "center",
//   },
//   {
//     id: "phoneNumber",
//     label: "Phone Number",
//     align: "center",
//   },
//   {
//     id: "municipality",
//     label: "Municipality",
//     align: "center",
//   },
//   {
//     id: "wardNo",
//     label: "Ward No",
//     align: "center",
//   },
//   { id: "remarks", label: "Remarks", minWidth: 150, align: "center" },
//   {
//     id: "actions",
//     label: "Actions",
//     minWidth: 170,
//     align: "center",
//     format: (value: any) => value,
//     renderCondition: (user: string | undefined) => {
//       return user === "Super Admin" || user === "Hospital Admin";
//     },
//   },
// ];

// interface Data {
//   sno: number;
//   patientName: string;
//   bloodGroup: string;
//   phoneNumber: number;
//   district: string;
//   municipality: string;
//   wardNo: number;
//   remarks: string;
//   actions: React.ReactNode;
// }

// function createData(
//   sno: number,
//   patientName: string,
//   bloodGroup: string,
//   phoneNumber: number,
//   district: string,
//   municipality: string,
//   wardNo: number,
//   remarks: string,
//   actions?: any
// ): Data {
//   return {
//     sno,
//     patientName,
//     bloodGroup,
//     phoneNumber,
//     district,
//     municipality,
//     wardNo,
//     remarks,
//     actions,
//   };
// }

// export default function PatientDataTable() {
//   const [editQuantity, setEditQuantity] = useState<any>(null);
//   const [deleteData, setDeleteData] = useState<string>("");
//   const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
//   const [municipalityFilter, setMunicipalityFilter] = useState<string | "all">(
//     "all"
//   );
//   const [wardNoFilter, setWardNoFilter] = useState<string | "all">("all");

//   const [uniqueMunicipalities, setUniqueMunicipalities] = useState<string[]>(
//     []
//   );

//   const [appliedMunicipalityFilter, setAppliedMunicipalityFilter] = useState<
//     string | "all"
//   >("all");
//   const [appliedWardNoFilter, setAppliedWardNoFilter] = useState<
//     string | "all"
//   >("all");

//   const navigate = useNavigate();

//   const { data: patientData, isLoading: patientwaitlistsLoading } =
//     useReadRequestQuery("patientwaitlists");

//   const handleDelete = async (id: string) => {
//     setDeleteData(id);
//     setOpenDeleteDialog(true);
//   };

//   const handleCancel = () => {
//     setOpenDeleteDialog(false);
//   };

//   const user: string | undefined = useSelector(
//     (state: InitialState) => state.auth.userType.userTypeName
//   );

//   let snoCounter = 1;
//   useEffect(() => {
//     if (patientData) {
//       const municipalities: string[] = Array.from(
//         new Set(patientData.map((item: any) => item.municipality))
//       );
//       setUniqueMunicipalities(municipalities);
//     }
//   }, [patientData]);
//   const filteredRows = patientData?.filter((item: any) => {
//     return (
//       (municipalityFilter === "all" ||
//         item.municipality === municipalityFilter) &&
//       (wardNoFilter === "all" || item.wardNo.toString() === wardNoFilter)
//     );
//   });

//   const rows = filteredRows?.map((item: any) => {
//     const sno = snoCounter++;
//     if (user === "Super Admin" || "Hospital Admin") {
//       return createData(
//         sno,
//         item.patientName,
//         item.bloodGroup.bloodGroupName,
//         item.phoneNumber,
//         item.district,
//         item.municipality,
//         item.wardNo,
//         item.remarks,
//         <div className="flex justify-center gap-4 items-center">
//           <div
//             className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer"
//             onClick={() => handleEditQuantity(item)}
//           >
//             <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
//           </div>
//           <div
//             className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
//             onClick={() => handleDelete(item.patientId)}
//           >
//             <MdDelete className="text-xl font-medium text-red-500 hover:text-2xl ease-in-out duration-100" />
//           </div>
//         </div>
//       );
//     }
//     return createData(
//       sno,
//       item.patientName,
//       item.bloodGroup.bloodGroupName,
//       item.phoneNumber,
//       item.district,
//       item.municipality,
//       item.wardNo,
//       item.remarks
//     );
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const handleChangePage = (event: any, newPage: number) => {
//     event.preventDefault();
//     setPage(newPage);
//     setAppliedMunicipalityFilter("all");
//     setAppliedWardNoFilter("all");
//   };
//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const handleApplyFilter = () => {
//     setMunicipalityFilter(appliedMunicipalityFilter);
//     setWardNoFilter(appliedWardNoFilter);
//     setPage(0);
//     setEditQuantity(null);
//     setDeleteData("");
//   };

//   const handleResetFilter = () => {
//     setAppliedMunicipalityFilter("all");
//     setAppliedWardNoFilter("all");
//     setMunicipalityFilter("all");
//     setWardNoFilter("all");
//   };

//   const handleEditQuantity = (item: any) => {
//     navigate(`edit/${item.patientId}`);
//   };

//   const filteredColumns = columns.filter((column) => {
//     if (column.renderCondition) {
//       return column.renderCondition(user);
//     }
//     return true;
//   });

//   const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
//   const [clickedRowData, setClickedRowData] = React.useState<PatientData>();

//   const handleRowClick = (index: number) => {
//     console.log(index);
//     const clickedRowData = patientData && patientData[index];
//     console.log(clickedRowData);
//     if (clickedRowData) {
//       setSelectedRow(selectedRow === index ? null : index);
//       setClickedRowData(clickedRowData);
//     }
//   };

//   return (
//     <div
//       className="flex flex-col gap-5 w-full h-full bg-fixed"
//       style={{ backgroundImage: 'url("/designRectangle.png")' }}
//     >
//       <div className="flex flex-col md:flex-row w-full justify-between items-end">
//         <div className="w-full flex items-center gap-4 md:w-3/4 font-[Poppins]">
//           <div className="w-full flex flex-col items-start justify-start gap-2">
//             <span className="w-full text-[#008080] text-base  font-semibold px-2">
//               Filters:
//             </span>
//             <div className="w-2/3 flex gap-2 items-center justify-center">
//               <div className="w-full flex flex-col gap-1">
//                 <label
//                   htmlFor="municipalityFilter"
//                   className="w-full text-[#008080] text-base  font-semibold px-2"
//                 >
//                   Municipality
//                 </label>
//                 <select
//                   id="municipalityFilter"
//                   value={appliedMunicipalityFilter}
//                   onChange={(e) => setAppliedMunicipalityFilter(e.target.value)}
//                   className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
//                 >
//                   <option value="all">All Municipality</option>
//                   {uniqueMunicipalities.map((municipality) => (
//                     <option key={municipality} value={municipality}>
//                       {municipality}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-full flex flex-col gap-1">
//                 <label
//                   htmlFor="wardNoFilter"
//                   className="w-full text-[#008080] text-base  font-semibold px-2"
//                 >
//                   Ward
//                 </label>
//                 <select
//                   id="wardNoFilter"
//                   value={appliedWardNoFilter}
//                   onChange={(e) => setAppliedWardNoFilter(e.target.value)}
//                   className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
//                 >
//                   <option value="all">All Ward No</option>
//                   {uniqueMunicipalities
//                     .filter(
//                       (m) =>
//                         municipalityFilter === "all" || m === municipalityFilter
//                     )
//                     .map((municipality) =>
//                       Array.from(
//                         new Set(
//                           patientData
//                             ?.filter(
//                               (item: any) => item.municipality === municipality
//                             )
//                             .map((item: any) => item.wardNo)
//                         )
//                       ).map((wardNo: any) => (
//                         <option key={wardNo} value={wardNo}>
//                           {wardNo}
//                         </option>
//                       ))
//                     )}
//                 </select>
//               </div>
//             </div>
//             <div className="w-1/4 flex items-center justify-center gap-2">
//               <button
//                 onClick={handleApplyFilter}
//                 className="bg-button text-white p-2 rounded-3xl medium-size-button w-full hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] "
//               >
//                 Apply
//               </button>
//               <button
//                 onClick={handleResetFilter}
//                 className="bg-gray-400 text-white p-2 rounded-3xl medium-size-button w-full"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//         {(user === 'Hospital Admin') || (user=== 'Super Admin' || (user === 'Red Cross Admin')) && (
//           <Link to="/add-patient">
//             <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] font-[Poppins]">
//               <IoPersonAdd className="text-lg" /> Add New Patient
//             </button>
//           </Link>
//         )}
//       </div>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer>
//           <Table aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {filteredColumns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{
//                       minWidth: column.minWidth,
//                       backgroundColor: "#66b2b2",
//                     }}
//                   >
//                     <p className="text-white leading-5 font-[Poppins]">
//                       {column.label}
//                     </p>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             {patientwaitlistsLoading ? (
//               <LinearProgress />
//             ) : (
//               <TableBody>
//                 {rows &&
//                   rows
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((row: Data, index: number) => {
//                       return (
//                         <>
//                           <TableRow
//                             key={row.sno}
//                             hover
//                             role="checkbox"
//                             tabIndex={-1}
//                             className={
//                               index % 2 === 0 ? "bg-white" : "bg-slate-100"
//                             }
//                             onClick={() => handleRowClick(index)}
//                           >
//                             {filteredColumns.map((column) => {
//                               const value = row[column.id];
//                               return (
//                                 <TableCell key={column.id} align={column.align}>
//                                   {column.format &&
//                                   typeof value === "number" ? (
//                                     column.format(value)
//                                   ) : typeof value === "object" &&
//                                     value instanceof Date ? (
//                                     value.toLocaleString()
//                                   ) : (
//                                     <span className="font-[Poppins]">
//                                       {value}
//                                     </span>
//                                   )}
//                                 </TableCell>
//                               );
//                             })}
//                           </TableRow>
//                           {selectedRow === index && (
//                             <TableRow>
//                               <TableCell colSpan={columns.length}>
//                                 <AvailableDonors
//                                   clickedRowData={clickedRowData}
//                                 />
//                               </TableCell>
//                             </TableRow>
//                           )}
//                         </>
//                       );
//                     })}
//               </TableBody>
//             )}
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={rows?.length || 0}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//         <DeleteDonor
//           open={openDeleteDialog}
//           onClose={handleCancel}
//           slug="patientwaitlists"
//           id={deleteData}
//         />
//       </Paper>
//     </div>
//   );
// }


// added case resolved button

// import { Link, useNavigate } from "react-router-dom";
// import * as React from "react";
// import { useState, useEffect } from "react";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import Checkbox from "@mui/material/Checkbox";
// import { useReadRequestQuery } from "../api/apiHandler";
// import { IoPersonAdd } from "react-icons/io5";
// import { MdVisibility, MdVisibilityOff } from "react-icons/md";
// import { LinearProgress } from "@mui/material";
// import { MdEditSquare, MdDelete } from "react-icons/md";
// import { useSelector } from "react-redux";
// import { InitialState, PatientData } from "../models/datamodels";
// import AvailableDonors from "../components/AvailableDonors";
// import DeleteDonor from "../components/Alert/DeleteAlert";

// interface Column {
//   id:
//     | "sno"
//     | "patientName"
//     | "bloodGroup"
//     | "phoneNumber"
//     | "municipality"
//     | "wardNo"
//     | "remarks"
//     | "created"
//     | "resolved"
//     | "actions";
//   label: string;
//   minWidth?: number;
//   align?: "center";
//   format?: (value: any) => string;
//   renderCondition?: (user: string | undefined) => boolean;
// }

// const columns: readonly Column[] = [
//   { id: "sno", label: "S.No", minWidth: 50, align: "center" },
//   { id: "patientName", label: "Patient Name", minWidth: 170, align: "center" },
//   {
//     id: "bloodGroup",
//     label: "Blood Group",
//     minWidth: 100,
//     align: "center",
//   },
//   {
//     id: "phoneNumber",
//     label: "Phone Number",
//     align: "center",
//   },
//   {
//     id: "municipality",
//     label: "Municipality",
//     align: "center",
//   },
//   {
//     id: "wardNo",
//     label: "Ward No",
//     align: "center",
//   },
//   { id: "remarks", label: "Remarks", minWidth: 150, align: "center" },
//   {
//     id: "created",
//     label: "Case Created",
//     minWidth: 120,
//     align: "center",
//   },
//   {
//     id: "resolved",
//     label: "Resolved",
//     minWidth: 90,
//     align: "center",
//   },
//   {
//     id: "actions",
//     label: "Actions",
//     minWidth: 170,
//     align: "center",
//     format: (value: any) => value,
//     renderCondition: (user: string | undefined) => {
//       return user === "Super Admin" || user === "Hospital Admin";
//     },
//   },
// ];

// interface Data {
//   sno: number;
//   patientName: string;
//   bloodGroup: string;
//   phoneNumber: number;
//   district: string;
//   municipality: string;
//   wardNo: number;
//   remarks: string;
//   created: string;
//   resolved: React.ReactNode;
//   actions: React.ReactNode;
// }

// function createData(
//   sno: number,
//   patientName: string,
//   bloodGroup: string,
//   phoneNumber: number,
//   district: string,
//   municipality: string,
//   wardNo: number,
//   remarks: string,
//   created: string,
//   resolved: React.ReactNode,
//   actions?: any
// ): Data {
//   return {
//     sno,
//     patientName,
//     bloodGroup,
//     phoneNumber,
//     district,
//     municipality,
//     wardNo,
//     remarks,
//     created,
//     resolved,
//     actions,
//   };
// }

// export default function PatientDataTable() {
//   const [editQuantity, setEditQuantity] = useState<any>(null);
//   const [deleteData, setDeleteData] = useState<string>("");
//   const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
//   const [municipalityFilter, setMunicipalityFilter] = useState<string | "all">(
//     "all"
//   );
//   const [wardNoFilter, setWardNoFilter] = useState<string | "all">("all");
//   const [showResolvedCases, setShowResolvedCases] = useState<boolean>(false);
//   const [resolvedCases, setResolvedCases] = useState<Record<string, boolean>>({});

//   const [uniqueMunicipalities, setUniqueMunicipalities] = useState<string[]>(
//     []
//   );

//   const [appliedMunicipalityFilter, setAppliedMunicipalityFilter] = useState<
//     string | "all"
//   >("all");
//   const [appliedWardNoFilter, setAppliedWardNoFilter] = useState<
//     string | "all"
//   >("all");

//   const navigate = useNavigate();

//   const { data: patientData, isLoading: patientwaitlistsLoading } =
//     useReadRequestQuery("patientwaitlists");

//   // Load resolved cases from localStorage on component mount
//   useEffect(() => {
//     const savedResolvedCases = localStorage.getItem("resolvedCases");
//     if (savedResolvedCases) {
//       setResolvedCases(JSON.parse(savedResolvedCases));
//     }
//   }, []);

//   // Save resolved cases to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("resolvedCases", JSON.stringify(resolvedCases));
//   }, [resolvedCases]);

//   const handleDelete = async (id: string) => {
//     setDeleteData(id);
//     setOpenDeleteDialog(true);
//   };

//   const handleCancel = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleResolvedChange = (patientId: string, event: React.ChangeEvent<HTMLInputElement>) => {
//     event.stopPropagation(); // Prevent row click when checkbox is clicked
//     setResolvedCases(prev => ({
//       ...prev,
//       [patientId]: event.target.checked
//     }));
//   };

//   const user: string | undefined = useSelector(
//     (state: InitialState) => state.auth.userType.userTypeName
//   );

//   let snoCounter = 1;
//   useEffect(() => {
//     if (patientData) {
//       const municipalities: string[] = Array.from(
//         new Set(patientData.map((item: any) => item.municipality))
//       );
//       setUniqueMunicipalities(municipalities);
//     }
//   }, [patientData]);
  
//   const filteredRows = patientData?.filter((item: any) => {
//     // Apply municipality and ward filters
//     const locationFilterPassed = (
//       (municipalityFilter === "all" ||
//         item.municipality === municipalityFilter) &&
//       (wardNoFilter === "all" || item.wardNo.toString() === wardNoFilter)
//     );
    
//     // Apply resolved filter
//     const resolvedFilterPassed = showResolvedCases || !resolvedCases[item.patientId];
    
//     return locationFilterPassed && resolvedFilterPassed;
//   });

//   const rows = filteredRows?.map((item: any) => {
//     const sno = snoCounter++;
//     // Generate formatted created date (using current date as placeholder if not available)
//     const createdDate = item.createdAt 
//       ? new Date(item.createdAt).toLocaleString() 
//       : new Date().toLocaleString();
    
//     // Create resolved checkbox
//     const resolvedCheckbox = (
//       <Checkbox
//         checked={!!resolvedCases[item.patientId]}
//         onChange={(e) => handleResolvedChange(item.patientId, e)}
//         onClick={(e) => e.stopPropagation()}
//         color="success"
//       />
//     );
    
//     if (user === "Super Admin" || user === "Hospital Admin") {
//       return createData(
//         sno,
//         item.patientName,
//         item.bloodGroup.bloodGroupName,
//         item.phoneNumber,
//         item.district,
//         item.municipality,
//         item.wardNo,
//         item.remarks,
//         createdDate,
//         resolvedCheckbox,
//         <div className="flex justify-center gap-4 items-center">
//           <div
//             className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEditQuantity(item);
//             }}
//           >
//             <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
//           </div>
//           <div
//             className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleDelete(item.patientId);
//             }}
//           >
//             <MdDelete className="text-xl font-medium text-red-500 hover:text-2xl ease-in-out duration-100" />
//           </div>
//         </div>
//       );
//     }
//     return createData(
//       sno,
//       item.patientName,
//       item.bloodGroup.bloodGroupName,
//       item.phoneNumber,
//       item.district,
//       item.municipality,
//       item.wardNo,
//       item.remarks,
//       createdDate,
//       resolvedCheckbox
//     );
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const handleChangePage = (event: any, newPage: number) => {
//     event.preventDefault();
//     setPage(newPage);
//     setAppliedMunicipalityFilter("all");
//     setAppliedWardNoFilter("all");
//   };
//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const handleApplyFilter = () => {
//     setMunicipalityFilter(appliedMunicipalityFilter);
//     setWardNoFilter(appliedWardNoFilter);
//     setPage(0);
//     setEditQuantity(null);
//     setDeleteData("");
//   };

//   const handleResetFilter = () => {
//     setAppliedMunicipalityFilter("all");
//     setAppliedWardNoFilter("all");
//     setMunicipalityFilter("all");
//     setWardNoFilter("all");
//   };

//   const handleEditQuantity = (item: any) => {
//     navigate(`edit/${item.patientId}`);
//   };

//   const filteredColumns = columns.filter((column) => {
//     if (column.renderCondition) {
//       return column.renderCondition(user);
//     }
//     return true;
//   });

//   const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
//   const [clickedRowData, setClickedRowData] = React.useState<PatientData>();

//   const handleRowClick = (index: number) => {
//     console.log(index);
//     const clickedRowData = patientData && patientData[index + (page * rowsPerPage)];
//     console.log(clickedRowData);
//     if (clickedRowData) {
//       setSelectedRow(selectedRow === index ? null : index);
//       setClickedRowData(clickedRowData);
//     }
//   };

//   const toggleResolvedCases = () => {
//     setShowResolvedCases(!showResolvedCases);
//     setPage(0); // Reset to first page when toggling view
//   };

//   return (
//     <div
//       className="flex flex-col gap-5 w-full h-full bg-fixed"
//       style={{ backgroundImage: 'url("/designRectangle.png")' }}
//     >
//       <div className="flex flex-col md:flex-row w-full justify-between items-end">
//         <div className="w-full flex items-center gap-4 md:w-3/4 font-[Poppins]">
//           <div className="w-full flex flex-col items-start justify-start gap-2">
//             <span className="w-full text-[#008080] text-base font-semibold px-2">
//               Filters:
//             </span>
//             <div className="w-2/3 flex gap-2 items-center justify-center">
//               <div className="w-full flex flex-col gap-1">
//                 <label
//                   htmlFor="municipalityFilter"
//                   className="w-full text-[#008080] text-base font-semibold px-2"
//                 >
//                   Municipality
//                 </label>
//                 <select
//                   id="municipalityFilter"
//                   value={appliedMunicipalityFilter}
//                   onChange={(e) => setAppliedMunicipalityFilter(e.target.value)}
//                   className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
//                 >
//                   <option value="all">All Municipality</option>
//                   {uniqueMunicipalities.map((municipality) => (
//                     <option key={municipality} value={municipality}>
//                       {municipality}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-full flex flex-col gap-1">
//                 <label
//                   htmlFor="wardNoFilter"
//                   className="w-full text-[#008080] text-base font-semibold px-2"
//                 >
//                   Ward
//                 </label>
//                 <select
//                   id="wardNoFilter"
//                   value={appliedWardNoFilter}
//                   onChange={(e) => setAppliedWardNoFilter(e.target.value)}
//                   className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
//                 >
//                   <option value="all">All Ward No</option>
//                   {uniqueMunicipalities
//                     .filter(
//                       (m) =>
//                         municipalityFilter === "all" || m === municipalityFilter
//                     )
//                     .map((municipality) =>
//                       Array.from(
//                         new Set(
//                           patientData
//                             ?.filter(
//                               (item: any) => item.municipality === municipality
//                             )
//                             .map((item: any) => item.wardNo)
//                         )
//                       ).map((wardNo: any) => (
//                         <option key={wardNo} value={wardNo}>
//                           {wardNo}
//                         </option>
//                       ))
//                     )}
//                 </select>
//               </div>
//             </div>
//             <div className="w-1/4 flex items-center justify-center gap-2">
//               <button
//                 onClick={handleApplyFilter}
//                 className="bg-button text-white p-2 rounded-3xl medium-size-button w-full hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] "
//               >
//                 Apply
//               </button>
//               <button
//                 onClick={handleResetFilter}
//                 className="bg-gray-400 text-white p-2 rounded-3xl medium-size-button w-full"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <button 
//             onClick={toggleResolvedCases}
//             className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-amber-600 text-white font-medium hover:bg-amber-700 transition duration-150 hover:shadow-md hover:shadow-amber-300 font-[Poppins]"
//           >
//             {showResolvedCases ? (
//               <>
//                 <MdVisibilityOff className="text-lg" /> Hide Resolved Cases
//               </>
//             ) : (
//               <>
//                 <MdVisibility className="text-lg" /> View Resolved Cases
//               </>
//             )}
//           </button>
          
//           {(user === 'Hospital Admin' || user === 'Super Admin' || user === 'Red Cross Admin') && (
//             <Link to="/add-patient">
//               <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] font-[Poppins]">
//                 <IoPersonAdd className="text-lg" /> Add New Patient
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer>
//           <Table aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {filteredColumns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{
//                       minWidth: column.minWidth,
//                       backgroundColor: "#66b2b2",
//                     }}
//                   >
//                     <p className="text-white leading-5 font-[Poppins]">
//                       {column.label}
//                     </p>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             {patientwaitlistsLoading ? (
//               <LinearProgress />
//             ) : (
//               <TableBody>
//                 {rows &&
//                   rows
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((row: Data, index: number) => {
//                       return (
//                         <React.Fragment key={row.sno}>
//                           <TableRow
//                             hover
//                             role="checkbox"
//                             tabIndex={-1}
//                             className={
//                               index % 2 === 0 ? "bg-white" : "bg-slate-100"
//                             }
//                             onClick={() => handleRowClick(index)}
//                           >
//                             {filteredColumns.map((column) => {
//                               const value = row[column.id];
//                               return (
//                                 <TableCell key={column.id} align={column.align}>
//                                   {column.format &&
//                                   typeof value === "number" ? (
//                                     column.format(value)
//                                   ) : typeof value === "object" &&
//                                     value instanceof Date ? (
//                                     value.toLocaleString()
//                                   ) : (
//                                     <span className="font-[Poppins]">
//                                       {value}
//                                     </span>
//                                   )}
//                                 </TableCell>
//                               );
//                             })}
//                           </TableRow>
//                           {selectedRow === index && (
//                             <TableRow>
//                               <TableCell colSpan={filteredColumns.length}>
//                                 <AvailableDonors
//                                   clickedRowData={clickedRowData}
//                                 />
//                               </TableCell>
//                             </TableRow>
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//               </TableBody>
//             )}
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={rows?.length || 0}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//         <DeleteDonor
//           open={openDeleteDialog}
//           onClose={handleCancel}
//           slug="patientwaitlists"
//           id={deleteData}
//         />
//       </Paper>
//     </div>
//   );
// }



//urgencylevl fix
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { useReadRequestQuery } from "../api/apiHandler";
import { IoPersonAdd } from "react-icons/io5";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { LinearProgress } from "@mui/material";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { InitialState, PatientData } from "../models/datamodels";
import AvailableDonors from "../components/AvailableDonors";
import DeleteDonor from "../components/Alert/DeleteAlert";

// Define urgency keywords and their priority weights
const URGENCY_LEVELS = {
  accident: { priority: 1, keywords: ["accident", "emergency", "trauma"] },
  surgery_complication: { priority: 1, keywords: ["complication", "surgery complication", "post-op", "post-surgery"] },
  pregnancy: { priority: 2, keywords: ["pregnancy", "pregnant", "childbirth", "labor", "delivery"] },
  planned_surgery: { priority: 3, keywords: ["planned", "scheduled", "routine", "elective"] }
};

interface Column {
  id:
    | "sno"
    | "patientName"
    | "bloodGroup"
    | "phoneNumber"
    | "municipality"
    | "wardNo"
    | "remarks"
    | "timeElapsed"
    | "resolved"
    | "actions";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: any) => string;
  renderCondition?: (user: string | undefined) => boolean;
}

const columns: readonly Column[] = [
  { id: "sno", label: "S.No", minWidth: 50, align: "center" },
  { id: "patientName", label: "Patient Name", minWidth: 170, align: "center" },
  {
    id: "bloodGroup",
    label: "Blood Group",
    minWidth: 100,
    align: "center",
  },
  {
    id: "phoneNumber",
    label: "Phone Number",
    align: "center",
  },
  {
    id: "municipality",
    label: "Municipality",
    align: "center",
  },
  {
    id: "wardNo",
    label: "Ward No",
    align: "center",
  },
  { id: "remarks", label: "Remarks", minWidth: 150, align: "center" },
  {
    id: "timeElapsed",
    label: "Time Elapsed",
    minWidth: 120,
    align: "center",
  },
  {
    id: "resolved",
    label: "Resolved",
    minWidth: 90,
    align: "center",
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 170,
    align: "center",
    format: (value: any) => value,
    renderCondition: (user: string | undefined) => {
      return user === "Super Admin" || user === "Hospital Admin";
    },
  },
];

interface Data {
  sno: number;
  patientName: string;
  bloodGroup: string;
  phoneNumber: number;
  district: string;
  municipality: string;
  wardNo: number;
  remarks: string;
  timeElapsed: string;
  resolved: React.ReactNode;
  actions: React.ReactNode;
  // Additional fields for sorting
  priorityWeight: number;
  postedTime: Date;
  elapsedMinutes: number;
  score: number;
}

function createData(
  sno: number,
  patientName: string,
  bloodGroup: string,
  phoneNumber: number,
  district: string,
  municipality: string,
  wardNo: number,
  remarks: string,
  timeElapsed: string,
  resolved: React.ReactNode,
  priorityWeight: number,
  postedTime: Date,
  elapsedMinutes: number,
  score: number,
  actions?: any
): Data {
  return {
    sno,
    patientName,
    bloodGroup,
    phoneNumber,
    district,
    municipality,
    wardNo,
    remarks,
    timeElapsed,
    resolved,
    priorityWeight,
    postedTime,
    elapsedMinutes,
    score,
    actions,
  };
}

// Helper function to determine priority based on remarks text
function determinePriorityFromRemarks(remarks: string): number {
  if (!remarks) return 3; // Default to lowest priority if remarks is empty
  
  const lowerCaseRemarks = remarks.toLowerCase();
  
  // Check for high priority keywords (priority 1)
  for (const urgencyType of ['accident', 'surgery_complication']) {
    const keywords = URGENCY_LEVELS[urgencyType].keywords;
    if (keywords.some(keyword => lowerCaseRemarks.includes(keyword))) {
      return 1;
    }
  }
  
  // Check for medium priority keywords (priority 2)
  if (URGENCY_LEVELS.pregnancy.keywords.some(keyword => lowerCaseRemarks.includes(keyword))) {
    return 2;
  }
  
  // Check for low priority keywords (priority 3)
  if (URGENCY_LEVELS.planned_surgery.keywords.some(keyword => lowerCaseRemarks.includes(keyword))) {
    return 3;
  }
  
  return 3; // Default to lowest priority if no match
}

// Helper function to calculate minutes elapsed since a given date
function calculateTimeElapsed(createdDate: Date | string | undefined): { 
  minutes: number,
  hours: number,
  days: number, 
  display: string
} {
  if (!createdDate) {
    return { minutes: 0, hours: 0, days: 0, display: "Unknown" };
  }
  
  const now = new Date();
  let created: Date;
  
  // Handle different date formats
  try {
    if (typeof createdDate === 'string') {
      created = new Date(createdDate);
      
      // Check if date is valid
      if (isNaN(created.getTime())) {
        console.error("Invalid date format:", createdDate);
        return { minutes: 0, hours: 0, days: 0, display: "Invalid date" };
      }
    } else {
      created = createdDate;
    }
    
    // Calculate total elapsed time in milliseconds
    const diffMs = now.getTime() - created.getTime();
    
    // Convert to minutes, hours, days
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // Create display string based on elapsed time
    let display = "";
    if (minutes < 1) {
      display = "Just now";
    } else if (minutes < 60) {
      display = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (hours < 24) {
      display = `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const remainingHours = hours % 24;
      if (remainingHours === 0) {
        display = `${days} day${days !== 1 ? 's' : ''}`;
      } else {
        display = `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
      }
    }
    
    return { minutes, hours, days, display };
  } catch (error) {
    console.error("Error calculating time elapsed:", error, "for date:", createdDate);
    return { minutes: 0, hours: 0, days: 0, display: "Error" };
  }
}

// Function to calculate score for medium and low priority cases
function calculateScore(priorityWeight: number, elapsedMinutes: number): number {
  // Add a small constant to avoid division by zero
  return priorityWeight + (1 / (elapsedMinutes + 1));
}

export default function PatientDataTable() {
  const [editQuantity, setEditQuantity] = useState<any>(null);
  const [deleteData, setDeleteData] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [municipalityFilter, setMunicipalityFilter] = useState<string | "all">(
    "all"
  );
  const [wardNoFilter, setWardNoFilter] = useState<string | "all">("all");
  const [showResolvedCases, setShowResolvedCases] = useState<boolean>(false);
  const [resolvedCases, setResolvedCases] = useState<Record<string, boolean>>({});

  const [uniqueMunicipalities, setUniqueMunicipalities] = useState<string[]>(
    []
  );

  const [appliedMunicipalityFilter, setAppliedMunicipalityFilter] = useState<
    string | "all"
  >("all");
  const [appliedWardNoFilter, setAppliedWardNoFilter] = useState<
    string | "all"
  >("all");

  const navigate = useNavigate();

  const { data: patientData, isLoading: patientwaitlistsLoading } =
    useReadRequestQuery("patientwaitlists");

  // Log the patient data to check the date format
  useEffect(() => {
    if (patientData && patientData.length > 0) {
      console.log("Sample patient data:", patientData[0]);
      console.log("Date field types:");
      if (patientData[0].dateCreated) {
        console.log("- dateCreated:", patientData[0].dateCreated, "type:", typeof patientData[0].dateCreated);
      }
      if (patientData[0].createdAt) {
        console.log("- createdAt:", patientData[0].createdAt, "type:", typeof patientData[0].createdAt);
      }
      
      // Log all possible date fields
      const dateFields = Object.keys(patientData[0]).filter(key => 
        key.toLowerCase().includes('date') || 
        key.toLowerCase().includes('time') || 
        key.toLowerCase().includes('created') ||
        key.toLowerCase().includes('updated')
      );
      
      console.log("Possible date fields:", dateFields);
      dateFields.forEach(field => {
        console.log(`- ${field}:`, patientData[0][field], "type:", typeof patientData[0][field]);
      });
    }
  }, [patientData]);

  // Load resolved cases from localStorage on component mount
  useEffect(() => {
    const savedResolvedCases = localStorage.getItem("resolvedCases");
    if (savedResolvedCases) {
      setResolvedCases(JSON.parse(savedResolvedCases));
    }
  }, []);

  // Save resolved cases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("resolvedCases", JSON.stringify(resolvedCases));
  }, [resolvedCases]);

  const handleDelete = async (id: string) => {
    setDeleteData(id);
    setOpenDeleteDialog(true);
  };

  const handleCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleResolvedChange = (patientId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Prevent row click when checkbox is clicked
    setResolvedCases(prev => ({
      ...prev,
      [patientId]: event.target.checked
    }));
  };

  const user: string | undefined = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  useEffect(() => {
    if (patientData) {
      const municipalities: string[] = Array.from(
        new Set(patientData.map((item: any) => item.municipality))
      );
      setUniqueMunicipalities(municipalities);
    }
  }, [patientData]);
  
  const filteredRows = patientData?.filter((item: any) => {
    // Apply municipality and ward filters
    const locationFilterPassed = (
      (municipalityFilter === "all" ||
        item.municipality === municipalityFilter) &&
      (wardNoFilter === "all" || item.wardNo.toString() === wardNoFilter)
    );
    
    // Apply resolved filter
    const resolvedFilterPassed = showResolvedCases || !resolvedCases[item.patientId];
    
    return locationFilterPassed && resolvedFilterPassed;
  });

  // Process and prioritize rows according to the algorithm
  const processRows = (filteredRows: any[] | undefined) => {
    if (!filteredRows || filteredRows.length === 0) return [];

    const processedRows = filteredRows.map((item: any) => {
      // Log date fields for debugging
      if (item.patientId) {
        console.log(`Patient ${item.patientId} date fields:`, {
          dateCreated: item.dateCreated,
          createdAt: item.createdAt
        });
      }
      
      // Determine priority weight based on remarks
      const priorityWeight = determinePriorityFromRemarks(item.remarks);
      
      // Use dateCreated field from backend, falling back to createdAt, or default to current time
      const postedTime = item.dateCreated ? new Date(item.dateCreated) : 
                         item.createdAt ? new Date(item.createdAt) : 
                         new Date();
      
      // Calculate elapsed time
      const timeInfo = calculateTimeElapsed(postedTime);
      
      console.log(`Patient ${item.patientName || 'unknown'}: priority=${priorityWeight}, elapsed=${timeInfo.display}`);
      
      // Calculate score for sorting - using minutes for more precision
      const score = calculateScore(priorityWeight, timeInfo.minutes);
      
      return {
        ...item,
        priorityWeight,
        postedTime,
        elapsedMinutes: timeInfo.minutes,
        timeDisplay: timeInfo.display,
        score
      };
    });

    // Split into high priority and other cases
    const highPriorityCases = processedRows.filter(item => item.priorityWeight === 1);
    const otherCases = processedRows.filter(item => item.priorityWeight > 1);

    // Sort high priority cases by time (oldest first)
    highPriorityCases.sort((a, b) => b.elapsedMinutes - a.elapsedMinutes);
    
    // Sort other cases by score (lower is better)
    otherCases.sort((a, b) => a.score - b.score);

    // Combine the two arrays
    return [...highPriorityCases, ...otherCases];
  };

  const prioritizedRows = processRows(filteredRows);
  
  const rows = prioritizedRows.map((item: any, index: number) => {
    const sno = index + 1; // Re-number based on priority order
    
    // Create resolved checkbox
    const resolvedCheckbox = (
      <Checkbox
        checked={!!resolvedCases[item.patientId]}
        onChange={(e) => handleResolvedChange(item.patientId, e)}
        onClick={(e) => e.stopPropagation()}
        color="success"
      />
    );
    
    if (user === "Super Admin" || user === "Hospital Admin") {
      return createData(
        sno,
        item.patientName,
        item.bloodGroup.bloodGroupName,
        item.phoneNumber,
        item.district,
        item.municipality,
        item.wardNo,
        item.remarks,
        item.timeDisplay,
        resolvedCheckbox,
        item.priorityWeight,
        item.postedTime,
        item.elapsedMinutes,
        item.score,
        <div className="flex justify-center gap-4 items-center">
          <div
            className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleEditQuantity(item);
            }}
          >
            <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
          </div>
          <div
            className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.patientId);
            }}
          >
            <MdDelete className="text-xl font-medium text-red-500 hover:text-2xl ease-in-out duration-100" />
          </div>
        </div>
      );
    }
    return createData(
      sno,
      item.patientName,
      item.bloodGroup.bloodGroupName,
      item.phoneNumber,
      item.district,
      item.municipality,
      item.wardNo,
      item.remarks,
      item.timeDisplay,
      resolvedCheckbox,
      item.priorityWeight,
      item.postedTime,
      item.elapsedMinutes,
      item.score
    );
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: any, newPage: number) => {
    event.preventDefault();
    setPage(newPage);
    setAppliedMunicipalityFilter("all");
    setAppliedWardNoFilter("all");
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleApplyFilter = () => {
    setMunicipalityFilter(appliedMunicipalityFilter);
    setWardNoFilter(appliedWardNoFilter);
    setPage(0);
    setEditQuantity(null);
    setDeleteData("");
  };

  const handleResetFilter = () => {
    setAppliedMunicipalityFilter("all");
    setAppliedWardNoFilter("all");
    setMunicipalityFilter("all");
    setWardNoFilter("all");
  };

  const handleEditQuantity = (item: any) => {
    navigate(`edit/${item.patientId}`);
  };

  const filteredColumns = columns.filter((column) => {
    if (column.renderCondition) {
      return column.renderCondition(user);
    }
    return true;
  });

  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [clickedRowData, setClickedRowData] = React.useState<PatientData>();

  const handleRowClick = (index: number) => {
    // Get the actual patient data from the original prioritized array
    const currentPageStartIndex = page * rowsPerPage;
    const adjustedIndex = currentPageStartIndex + index;
    
    if (adjustedIndex < prioritizedRows.length) {
      const clickedRowData = prioritizedRows[adjustedIndex];
      console.log("Clicked Row Data:", clickedRowData);
      
      if (clickedRowData) {
        setSelectedRow(selectedRow === index ? null : index);
        setClickedRowData(clickedRowData);
      }
    }
  };

  const toggleResolvedCases = () => {
    setShowResolvedCases(!showResolvedCases);
    setPage(0); // Reset to first page when toggling view
  };

  // Force re-render every minute to update the elapsed time display
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex flex-col gap-5 w-full h-full bg-fixed"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="flex flex-col md:flex-row w-full justify-between items-end">
        <div className="w-full flex items-center gap-4 md:w-3/4 font-[Poppins]">
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <span className="w-full text-[#008080] text-base font-semibold px-2">
              Filters:
            </span>
            <div className="w-2/3 flex gap-2 items-center justify-center">
              <div className="w-full flex flex-col gap-1">
                <label
                  htmlFor="municipalityFilter"
                  className="w-full text-[#008080] text-base font-semibold px-2"
                >
                  Municipality
                </label>
                <select
                  id="municipalityFilter"
                  value={appliedMunicipalityFilter}
                  onChange={(e) => setAppliedMunicipalityFilter(e.target.value)}
                  className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                >
                  <option value="all">All Municipality</option>
                  {uniqueMunicipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>
                      {municipality}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full flex flex-col gap-1">
                <label
                  htmlFor="wardNoFilter"
                  className="w-full text-[#008080] text-base font-semibold px-2"
                >
                  Ward
                </label>
                <select
                  id="wardNoFilter"
                  value={appliedWardNoFilter}
                  onChange={(e) => setAppliedWardNoFilter(e.target.value)}
                  className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                >
                  <option value="all">All Ward No</option>
                  {uniqueMunicipalities
                    .filter(
                      (m) =>
                        municipalityFilter === "all" || m === municipalityFilter
                    )
                    .map((municipality) =>
                      Array.from(
                        new Set(
                          patientData
                            ?.filter(
                              (item: any) => item.municipality === municipality
                            )
                            .map((item: any) => item.wardNo)
                        )
                      ).map((wardNo: any) => (
                        <option key={wardNo} value={wardNo}>
                          {wardNo}
                        </option>
                      ))
                    )}
                </select>
              </div>
            </div>
            <div className="w-1/4 flex items-center justify-center gap-2">
              <button
                onClick={handleApplyFilter}
                className="bg-button text-white p-2 rounded-3xl medium-size-button w-full hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] "
              >
                Apply
              </button>
              <button
                onClick={handleResetFilter}
                className="bg-gray-400 text-white p-2 rounded-3xl medium-size-button w-full"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleResolvedCases}
            className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-amber-600 text-white font-medium hover:bg-amber-700 transition duration-150 hover:shadow-md hover:shadow-amber-300 font-[Poppins]"
          >
            {showResolvedCases ? (
              <>
                <MdVisibilityOff className="text-lg" /> Hide Resolved Cases
              </>
            ) : (
              <>
                <MdVisibility className="text-lg" /> View Resolved Cases
              </>
            )}
          </button>
          
          {(user === 'Hospital Admin' || user === 'Super Admin' || user === 'Red Cross Admin') && (
            <Link to="/add-patient">
              <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] font-[Poppins]">
                <IoPersonAdd className="text-lg" /> Add New Patient
              </button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Legend/key for the priority system */}
      <div className="bg-white p-3 rounded-md shadow-sm">
        <h3 className="font-semibold text-[#008080] mb-2">Priority System:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Accident / Surgery Complication (Highest)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Pregnancy (Medium)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Planned Surgery (Lower)</span>
          </div>
          <div className="border-l-2 border-gray-300 pl-4">
            <span className="text-sm text-gray-600">Cases are auto-sorted by urgency level and time waiting.</span>
          </div>
        </div>
      </div>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {filteredColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#66b2b2",
                    }}
                  >
                    <p className="text-white leading-5 font-[Poppins]">
                      {column.label}
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {patientwaitlistsLoading ? (
              <LinearProgress />
            ) : (
              <TableBody>
                {rows &&
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: Data, index: number) => {
                      // Determine row background color based on priority
                      let rowBgColor = "";
                      if (row.priorityWeight === 1) {
                        rowBgColor = index % 2 === 0 ? "bg-red-50" : "bg-red-100";
                      } else if (row.priorityWeight === 2) {
                        rowBgColor = index % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100";
                      } else {
                        rowBgColor = index % 2 === 0 ? "bg-white" : "bg-slate-100";
                      }
                      
                      return (
                        <React.Fragment key={row.sno}>
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            className={rowBgColor}
                            onClick={() => handleRowClick(index)}
                          >
                            {filteredColumns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format &&
                                  typeof value === "number" ? (
                                    column.format(value)
                                  ) : typeof value === "object" &&
                                    value instanceof Date ? (
                                    value.toLocaleString()
                                  ) : (
                                    <span className="font-[Poppins]">
                                      {value}
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                          {selectedRow === index && (
                            <TableRow>
                              <TableCell colSpan={filteredColumns.length}>
                                <AvailableDonors
                                  clickedRowData={clickedRowData}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <DeleteDonor
          open={openDeleteDialog}
          onClose={handleCancel}
          slug="patientwaitlists"
          id={deleteData}
        />
      </Paper>
    </div>
  );
}