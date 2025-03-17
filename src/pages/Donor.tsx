import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Loading from '../components/Loading/Loading';
import moment from 'moment';
import { useReadRequestQuery } from '../api/apiHandler';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { BloodGroup, Donors, DonorTableRow } from '../models/datamodels';
import DeleteAlert from '../components/Alert/DeleteAlert';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { InitialState } from '../models/datamodels';
import BasicCard from '../components/BasicCard';
interface Column {
  id:
    | 'index'
    | 'donorName'
    | 'age'
    | 'bloodGroup'
    | 'lastDonated'
    | 'phoneNumber'
    | 'municipality'
    | 'wardNo'
    | 'emergencyContact'
    | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
  renderCondition?: (user: string | undefined) => boolean;
}

const columns: readonly Column[] = [
  {
    id: 'index',
    label: 'S.No',
    align: 'center',
  },

  {
    id: 'donorName',
    label: 'Donor',
    align: 'center',
  },
  { id: 'bloodGroup', label: 'Blood Group', align: 'center' },
  {
    id: 'lastDonated',
    label: 'Last Donated',
    align: 'center',
  },
  {
    id: 'age',
    label: 'Age',
    align: 'center',
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    align: 'center',
  },
  {
    id: 'municipality',
    label: 'Municipality',
    align: 'center',
  },
  {
    id: 'wardNo',
    label: 'Ward No',
    align: 'center',
  },
  {
    id: 'emergencyContact',
    label: 'Emergency Contact',
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'center',
    renderCondition: (user: string | undefined) => {
      return user === 'Super Admin' || user === 'Hospital Admin';
    },
  },
];

interface Filter {
  key: string;
  value: string | number;
}
interface Data {
  index: number;
  donorName: string;
  bloodGroup: string;
  age: number;
  lastDonated: string | null;
  phoneNumber: number;
  district: string;
  municipality: string;
  wardNo: number;
  emergencyContact: number;
  actions?: React.ReactNode;
}
function createData(
  index: number,
  donorName: string,
  bloodGroup: string,
  age: number,
  lastDonated: string | null,
  phoneNumber: number,
  district: string,
  municipality: string,
  wardNo: number,
  emergencyContact: number,
  actions?: JSX.Element
): Data {
  return {
    index,
    donorName,
    bloodGroup,
    age,
    lastDonated,
    phoneNumber,
    district,
    municipality,
    wardNo,
    emergencyContact,
    actions,
  };
}
function Donor() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedLocation, setSelectedLocation] = React.useState<string>('');
  const [selectedWardNo, setSelectedWardNo] = React.useState<number | ''>('');
  const [selectedBloodGroup, setSelectedBloodGroup] =
    React.useState<string>('');
  const [queryParams, setQueryParams] = React.useState('');
  const [paginationParams, setPaginationParams] = React.useState(
    `pageNumber=${page + 1}&pageSize=${rowsPerPage}`
  );

  const {
    data: donorData,
    isLoading,
    error,
  } = useReadRequestQuery(`donors?${paginationParams}&${queryParams}`);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [clickedRowData, setClickedRowData] = React.useState<Donors | null>(
    null
  );
  const { data: bloodGroups } = useReadRequestQuery('bloodGroups');

  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchClicked, setSearchClicked] = React.useState(false);

  const [donorId, setDonorId] = React.useState('');
  const navigate = useNavigate();
  const handleOpenDeleteDialog = (id: string) => {
    setOpenDeleteDialog(true);
    setDonorId(id);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleRowClick = (index: number) => {
    const clickedRowData = donorData.data && donorData.data[index];
    if (clickedRowData) {
      setSelectedRow(selectedRow === index ? null : index);
      setClickedRowData(clickedRowData);
    }
  };

  const user: string | undefined = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  const originalRows =
    donorData?.data.map((item: Donors, index: number) => {
      if (user === 'Super Admin' || user === 'Hospital Admin') {
        return createData(
          rowsPerPage * page + index + 1,
          item.donorName,
          item.bloodGroup.bloodGroupName,
          moment().diff(moment(item.dateOfBirth), 'years'),
          item.lastDonated ? moment(item.lastDonated).format('DD/MM/YY') : null,
          item.phoneNumber,
          item.district,
          item.municipality,
          item.wardNo,
          item.emergencyContact,
          <div className="flex w-full items-center gap-2 justify-between">
            <div
              className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-[#008080] shadow-md cursor-pointer "
              onClick={() => {
                navigate(`/donor/edit/${item.donorId}`);
              }}
            >
              <MdEditSquare className="text-xl font-medium text-[#008080] hover:text-2xl ease-in-out duration-100" />
            </div>
            <div
              className="flex w-10 h-10 rounded-full gap-2 justify-center items-center border-[3px] border-red-500 shadow-md cursor-pointer"
              onClick={() => {
                handleOpenDeleteDialog(item.donorId);
              }}
            >
              <MdDelete className="text-xl font-medium text-red-500 hover:text-2xl ease-in-out duration-100" />
            </div>
          </div>
        );
      }
      return createData(
        index + 1,
        item.donorName,
        item.bloodGroup.bloodGroupName,
        moment().diff(moment(item.dateOfBirth), 'years'),
        item.lastDonated ? moment(item.lastDonated).format('DD/MM/YY') : null,
        item.phoneNumber,
        item.district,
        item.municipality,
        item.wardNo,
        item.emergencyContact
      );
    }) || [];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setPaginationParams(`pageNumber=${newPage + 1}&pageSize=${rowsPerPage}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(+event.target.value);
    setPaginationParams(`pageNumber=${1}&pageSize=${event.target.value}`);
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSearchClick = () => {
    const filters: Filter[] = [];
    if (selectedBloodGroup && selectedBloodGroup !== 'All Blood Groups') {
      filters.push({
        key: 'bloodgroup',
        value: selectedBloodGroup,
      });
    }

    if (selectedLocation) {
      filters.push({ key: 'municipality', value: selectedLocation });
    }

    if (selectedWardNo !== '') {
      filters.push({ key: 'wardno', value: selectedWardNo });
    }

    const queryParams = filters
      .map(
        (filter, index) =>
          `filters[${index}].key=${filter.key}&filters[${index}].value=${filter.value}`
      )
      .join('&');
    setPage(0);
    setPaginationParams(`pageNumber=${1}&pageSize=${rowsPerPage}`);
    setQueryParams(queryParams);
    setSearchClicked(true);
  };

  const handleResetClick = () => {
    setSortedRows(originalRows);
    setSearchClicked(false);
    setQueryParams('');
    setSelectedBloodGroup('');
    setSelectedLocation('');
    setSelectedWardNo('');
  };
  const filteredColumns = columns.filter((column) => {
    if (column.renderCondition) {
      return column.renderCondition(user);
    }
    return true;
  });

  const [sortedRows, setSortedRows] =
    React.useState<DonorTableRow[]>(originalRows);

  React.useEffect(() => {
    setSortedRows(originalRows);
  }, [donorData]);

  console.log((user === 'Hospital Admin') || (user=== 'Super Admin'));

  if (error) {
    return <p>Contact your admin sorry</p>;
  } else if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div
        className="flex flex-col gap-5 font-[Poppins] w-full h-full bg-fixed"
        style={{ backgroundImage: 'url("/designRectangle.png")' }}
      >
        <div className="flex flex-col md:flex-row w-full justify-between items-end">
          <div className="w-full flex items-center gap-4 md:w-3/4 font-[Poppins]">
            <div className="w-full flex flex-col items-start justify-start gap-2">
              <span className="w-full text-[#008080] text-base  font-semibold px-2">
                Filters:
              </span>
              <div className="w-3/4 flex gap-2 items-end justify-center">
                <div className="w-1/3 flex flex-col gap-1">
                  <label
                    htmlFor="bloodGroupSelect"
                    className="w-full text-[#008080] text-base  font-semibold px-2"
                  >
                    BloodGroup:
                  </label>
                  <select
                    id="bloodGroupSelect"
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups?.map((oneGroup: BloodGroup) => (
                      <option
                        key={oneGroup.bloodGroupId}
                        value={oneGroup.bloodGroupName}
                      >
                        {oneGroup.bloodGroupName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3 flex  flex-col gap-1">
                  <label
                    htmlFor="locationSelect"
                    className="w-full text-[#008080] text-base  font-semibold px-2"
                  >
                    Municipality:
                  </label>
                  <select
                    id="locationSelect"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className=" border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  >
                    <option label="Select Municipality"></option>
                    {Array.from(
                      new Set(originalRows.map((row: Data) => row.municipality))
                    ).map((location) => (
                      <option
                        key={location as string}
                        value={location as string}
                      >
                        {location as string}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3 flex flex-col gap-1">
                  <label
                    htmlFor="wardNoSelect"
                    className=" w-full text-[#008080] text-base  font-semibold px-2"
                  >
                    Ward:
                  </label>
                  <select
                    id="wardNoSelect"
                    value={selectedWardNo}
                    onChange={(e) =>
                      setSelectedWardNo(e.target.value as number | '')
                    }
                    className=" border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  >
                    <option label="Select Ward"></option>
                    {Array.from({ length: 32 }, (_, index) => index + 1).map(
                      (wardNo) => (
                        <option key={wardNo} value={wardNo}>
                          {wardNo}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="w-1/4 flex items-center justify-between gap-2">
                <button
                  onClick={handleSearchClick}
                  className="bg-button text-white p-2 rounded-3xl medium-size-button w-full hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] "
                >
                  Apply
                </button>
                <button
                  onClick={handleResetClick}
                  className="bg-gray-400 text-white p-2 rounded-3xl medium-size-button w-full"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {(user === 'Hospital Admin' || user === 'Super Admin') && (
            <div className="flex pt-6 align-bottom justify-end items-end">
              <Link to="/create-donor">
                <button className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2]">
                  <IoMdAddCircleOutline className="text-lg" /> Add New Donor
                </button>
              </Link>
            </div>
          )}
        </div>
        <Paper
          sx={{
            backgroundColor: '#F1F5F9',
          }}
        >
          <TableContainer
            style={{
              backgroundColor: '#F1F5F9',
            }}
          >
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {filteredColumns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: '#66b2b2',
                      }}
                    >
                      <p className="text-white font-[Poppins]">
                        {column.label}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows.map((row: DonorTableRow, index: number) => {
                  return (
                    <>
                      <TableRow
                        hover
                        key={row.index}
                        className={
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-100'
                        }
                        onClick={() => handleRowClick(index)}
                      >
                        {filteredColumns.map((column, columnIndex) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={columnIndex} align={column.align}>
                              <span className="font-[Poppins]">{value}</span>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {selectedRow === index && (
                        <TableRow>
                          <TableCell colSpan={columns.length}>
                            <BasicCard data={clickedRowData} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className="bg-slate-100"
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={donorData?.count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <DeleteAlert
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            slug="donors"
            id={donorId}
          />
        </Paper>
      </div>
    );
  }
}
export default Donor;
