import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IoMdAddCircleOutline } from 'react-icons/io';
import DeleteDonor from '../components/Alert/DeleteAlert';
import { MdEditSquare, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import EditAdmin from '../components/Forms/EditAdmin';
import { useReadRequestQuery } from '../api/apiHandler';
import { AdminData, AdminDataTable, AdminTable } from '../models/datamodels';

interface Column {
  id:
    | 'donorName'
    | 'email'
    | 'address'
    | 'hospitalName'
    | 'userType'
    | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: 'donorName',
    label: 'Name',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'address',
    label: 'Address',
    minWidth: 120,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'hospitalName',
    label: 'Organization Name',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },

  {
    id: 'userType',
    label: 'User Type',
    minWidth: 120,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];
interface Data {
  donorName: string;
  email: string;
  address: string;
  hospitalName: string;
  userType: string;
  actions?: React.ReactNode;
}

function createData(
  donorName: string,
  email: string,
  address: string,
  hospitalName: string,
  userType: string,
  actions?: JSX.Element
): Data {
  return { donorName, email, address, hospitalName, userType, actions };
}

const Admin = () => {
  const [deleteRecord, setDeleteRecord] = useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [editQuantity, setEditQuantity] = useState<AdminDataTable | null>(null);
  const { data: adminData } = useReadRequestQuery('users');
  const [searchInput, setSearchInput] = useState('');

  const handleDelete = async (id: string) => {
    setDeleteRecord(id);
    setOpenDeleteDialog(true);
  };

  const handleCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditQuantity = (item: AdminDataTable) => {
    setEditQuantity(item);
  };
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };
  const filteredRows = adminData?.filter((item: AdminData) => {
    const searchString = searchInput.toLowerCase();
    return Object.values(item).some(
      (value: string | number | Date) =>
        typeof value === 'string' && value.toLowerCase().includes(searchString)
    );
  });
  const rows = filteredRows?.map((item: AdminTable) => {
    const province = item.donor.province;
    const municipality = item.donor.municipality;
    const ward = item.donor.wardNo;
    const address = ward
      ? `${province}, ${municipality}, ${ward}`
      : `${province}, ${municipality}`;
    return createData(
      item.donor.donorName,
      item.email,
      address,
      item.hospital.hospitalName,
      item.userType.userTypeName,
      <div className="flex w-full items-center justify-evenly">
        <div
          className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer"
          onClick={() => handleEditQuantity(item)}
        >
          <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
        </div>
        <div
          className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
          onClick={() => handleDelete(item.userId)}
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
      className="bg-fixed w-full h-full"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="flex flex-col gap-5 font-[Poppins] w-full h-screen bg-fixed pt-3">
        <div className="flex w-full justify-between items-center px-6 py-2">
          <input
            placeholder="Search By email"
            className="w-full lg:w-2/5 px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
            value={searchInput}
            onChange={handleChangeSearch}
          />
          <Link to="/create-admin">
            <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] font-[Poppins]">
              <IoMdAddCircleOutline className="text-lg" /> Add New Admin
            </button>
          </Link>
        </div>
        <Paper sx={{ width: '100%' }}>
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
                    .map((row: AdminDataTable, index: number) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row?.donorName}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-100'
                          }
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? (
                                  column.format(value)
                                ) : (
                                  <span className="font-[Poppins]">
                                    {value as string}
                                  </span>
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
            count={filteredRows?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <DeleteDonor
          open={openDeleteDialog}
          onClose={handleCancel}
          slug="users"
          id={deleteRecord}
        />

        {editQuantity && (
          <EditAdmin
            editElement={editQuantity}
            handleCloseEdit={() => setEditQuantity(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
