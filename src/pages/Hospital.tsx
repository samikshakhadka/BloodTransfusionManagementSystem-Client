import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useReadRequestQuery } from '../api/apiHandler';
import Loading from '../components/Loading/Loading';
import { IoPersonAdd } from 'react-icons/io5';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DeleteDonor from '../components/Alert/DeleteAlert';
import { Hospital } from '../models/datamodels';

interface Column {
  id: 'name' | 'address' | 'contactPerson' | 'contact' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: 'name',
    label: 'Hospital Name',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'address',
    label: 'Hospital Address',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'contactPerson',
    label: 'Contact Person',
    minWidth: 120,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'contact',
    label: 'Contact',
    minWidth: 120,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },

  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface Data {
  name: string;
  address: string;
  contactPerson: string;
  contact: string;
  actions: React.ReactNode;
}

function createData(
  name: string,
  address: string,
  contactPerson: string,
  contact: string,
  actions: JSX.Element
): Data {
  return { name, address, contactPerson, contact, actions };
}

export default function HospitalTable() {
  const [deleteRecord, setDeleteRecord] = useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const { data: hospitalData, isLoading } = useReadRequestQuery('hospitals');
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    setOpenDeleteDialog(true);
    setDeleteRecord(id);
  };

  const handleCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const filteredRows = hospitalData?.filter((item: Hospital) => {
    const searchString = searchInput.toLowerCase();
    return item.hospitalName.toLowerCase().includes(searchString);
  });

  const rows = filteredRows?.map((item: Hospital) => {
    const phoneNumber1 = item.phoneNumber1;
    const phoneNumber2 = item.phoneNumber2;
    const contacts = phoneNumber2
      ? `${phoneNumber1}, ${phoneNumber2}`
      : `${phoneNumber1}`;
    return createData(
      item.hospitalName,
      item.hospitalAddress,
      item.contactPerson,
      contacts,
      <div className="flex gap-5 justify-center items-center">
        <Link to={`/hospitalProfile/${item.hospitalId}`}>
          <div className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer">
            <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
          </div>
        </Link>
        <div
          className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
          onClick={() => handleDelete(item.hospitalId)}
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

  function handleOpenForm() {
    navigate('create');
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div
      className="flex flex-col gap-5 font-[Poppins] w-full h-screen bg-fixed pt-3"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="flex w-full justify-between items-center px-2">
        <input
          placeholder="Search Hospital Name"
          className="w-1/2 lg:w-2/5 px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
          value={searchInput}
          onChange={handleChangeSearch}
        />
        <button
          className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] "
          onClick={handleOpenForm}
        >
          <IoPersonAdd className="text-lg" /> Add New Hospital
        </button>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: '#66b2b2',
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
                  .map((row: Data, index: number) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row?.name}
                        className={index % 2 == 0 ? 'bg-white' : 'bg-slate-100'}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number' ? (
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
        onClose={handleCancel}
        slug="hospitals"
        id={deleteRecord}
      />
    </div>
  );
}
