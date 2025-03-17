import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";
import { useReadRequestQuery } from "../api/apiHandler";
import { WardRepresentatives } from "../models/datamodels";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import DeleteDonor from "../components/Alert/DeleteAlert";

interface Column {
  id: "wardRepName" | "wardNo" | "phoneNumber" | "secondaryContact" | "actions";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "wardRepName",
    label: "Name",
    minWidth: 170,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "wardNo",
    label: "Ward No",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "phoneNumber",
    label: "Phone Number",
    minWidth: 120,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "secondaryContact",
    label: "Secondary Contact",
    minWidth: 120,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 120,
    align: "center",
    format: (value: number) => value.toLocaleString("en-US"),
  },
];
interface Data {
  wardRepName: string;
  wardNo: string;
  phoneNumber: string;
  secondaryContact: string;
  actions: React.ReactNode;
}

function createData(
  wardRepName: string,
  wardNo: string,
  phoneNumber: string,
  secondaryContact: string,
  actions: JSX.Element
): Data {
  return { wardRepName, wardNo, phoneNumber, secondaryContact, actions };
}

function WardRepresentative() {
  const { data: wardAdmins } = useReadRequestQuery("wardrepresentatives");

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [wardRepId, setWardRepId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const handleOpenDeleteDialog = (id: string) => {
    setOpenDeleteDialog(true);
    setWardRepId(id);
  };
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setPage(0);
  };


  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const filteredRows = wardAdmins?.filter((item: any) =>{
    const searchString = searchInput.toLowerCase();
    return item.wardRepName.toLowerCase().includes(searchString);
});
   


  const rows = filteredRows?.map((item: any) => {
    return createData(
      item.wardRepName,
      item.wardNo,
      item.phoneNumber,
      item.secondaryContact,
      <div className="flex gap-5 justify-center items-center">
        <Link to={`edit/${item.wardRepId}`}>
          <div className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer">
            <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
          </div>
        </Link>
        <div
          className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
          onClick={() => {
            handleOpenDeleteDialog(item.wardRepId);
          }}
        >
          <MdDelete className="text-xl font-medium text-red-500 hover:text-2xl ease-in-out duration-100" />
        </div>
      </div>
    );
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  

  return (
    <div
      className="flex flex-col gap-5 font-[Poppins] w-full h-screen bg-fixed pt-3"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="flex flex-col gap-5 font-[Poppins] w-full h-screen bg-fixed pt-3">
        <div className="flex w-full justify-between items-center px-6 py-2">
          <input
            placeholder="Search By Name"
            className="w-full lg:w-2/5 px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
            value={searchInput}
            onChange={handleChangeSearch}
          />
          <Link to="create">
            <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] font-[Poppins]">
              <IoMdAddCircleOutline className="text-lg" /> Add New Member
            </button>
          </Link>
        </div>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "75vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
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
              <TableBody>
                {rows &&
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: WardRepresentatives, index: number) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row?.wardRepName}
                          className={index % 2 == 0 ? "bg-white" : "bg-slate-100"}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number" ? (
                                  column.format(value)
                                ) : (
                                  <span className="font-[Poppins]">{value}</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <DeleteDonor
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          slug="wardrepresentatives"
          id={wardRepId}
        />
      </div>
      </div>
      );
}

      export default WardRepresentative;
