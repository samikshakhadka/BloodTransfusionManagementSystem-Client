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
import { useReadRequestQuery } from "../api/apiHandler";
import { IoPersonAdd } from "react-icons/io5";
import { LinearProgress } from "@mui/material";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { InitialState, PatientData } from "../models/datamodels";
import AvailableDonors from "../components/AvailableDonors";
import DeleteDonor from "../components/Alert/DeleteAlert";

interface Column {
  id:
    | "sno"
    | "patientName"
    | "bloodGroup"
    | "phoneNumber"
    | "municipality"
    | "wardNo"
    | "remarks"
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
  actions: React.ReactNode;
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
    actions,
  };
}

export default function PatientDataTable() {
  const [editQuantity, setEditQuantity] = useState<any>(null);
  const [deleteData, setDeleteData] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [municipalityFilter, setMunicipalityFilter] = useState<string | "all">(
    "all"
  );
  const [wardNoFilter, setWardNoFilter] = useState<string | "all">("all");

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

  const handleDelete = async (id: string) => {
    setDeleteData(id);
    setOpenDeleteDialog(true);
  };

  const handleCancel = () => {
    setOpenDeleteDialog(false);
  };

  const user: string | undefined = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  let snoCounter = 1;
  useEffect(() => {
    if (patientData) {
      const municipalities: string[] = Array.from(
        new Set(patientData.map((item: any) => item.municipality))
      );
      setUniqueMunicipalities(municipalities);
    }
  }, [patientData]);
  const filteredRows = patientData?.filter((item: any) => {
    return (
      (municipalityFilter === "all" ||
        item.municipality === municipalityFilter) &&
      (wardNoFilter === "all" || item.wardNo.toString() === wardNoFilter)
    );
  });

  const rows = filteredRows?.map((item: any) => {
    const sno = snoCounter++;
    if (user === "Super Admin" || "Hospital Admin") {
      return createData(
        sno,
        item.patientName,
        item.bloodGroup.bloodGroupName,
        item.phoneNumber,
        item.district,
        item.municipality,
        item.wardNo,
        item.remarks,
        <div className="flex justify-center gap-4 items-center">
          <div
            className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer"
            onClick={() => handleEditQuantity(item)}
          >
            <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
          </div>
          <div
            className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
            onClick={() => handleDelete(item.patientId)}
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
      item.remarks
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
    console.log(index);
    const clickedRowData = patientData && patientData[index];
    console.log(clickedRowData);
    if (clickedRowData) {
      setSelectedRow(selectedRow === index ? null : index);
      setClickedRowData(clickedRowData);
    }
  };

  return (
    <div
      className="flex flex-col gap-5 w-full h-full bg-fixed"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="flex flex-col md:flex-row w-full justify-between items-end">
        <div className="w-full flex items-center gap-4 md:w-3/4 font-[Poppins]">
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <span className="w-full text-[#008080] text-base  font-semibold px-2">
              Filters:
            </span>
            <div className="w-2/3 flex gap-2 items-center justify-center">
              <div className="w-full flex flex-col gap-1">
                <label
                  htmlFor="municipalityFilter"
                  className="w-full text-[#008080] text-base  font-semibold px-2"
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
                  className="w-full text-[#008080] text-base  font-semibold px-2"
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
        {(user === 'Hospital Admin') || (user=== 'Super Admin' || (user === 'Red Cross Admin')) && (
          <Link to="/add-patient">
            <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] font-[Poppins]">
              <IoPersonAdd className="text-lg" /> Add New Patient
            </button>
          </Link>
        )}
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
                      return (
                        <>
                          <TableRow
                            key={row.sno}
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-slate-100"
                            }
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
                              <TableCell colSpan={columns.length}>
                                <AvailableDonors
                                  clickedRowData={clickedRowData}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                        </>
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
