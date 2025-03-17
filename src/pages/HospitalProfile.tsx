import { Link, useParams } from 'react-router-dom';
import { useReadRequestQuery } from '../api/apiHandler';
import logo from '../assets/logo.png';
import { MdEditSquare } from 'react-icons/md';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { FiUsers } from 'react-icons/fi';
import { BsReverseListColumnsReverse } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { InitialState } from '../models/datamodels';

const HospitalProfile = () => {
  const { hospitalId } = useParams();

  const { data: hospitalProfile } = useReadRequestQuery(
    `hospitals/${hospitalId}`
  );

  const { data: inventoryData } = useReadRequestQuery(
    `totalcount/${hospitalId}`
  );

  const userType = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  const [expandInfo, setExpandInfo] = useState<boolean>(false);

  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col w-100vw bg-fixed p-8 gap-4 font-[Poppins]"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      {userType === 'Super Admin' && (
        <Link to="/hospitals">
          <div className="flex justify-start items-center w-full">
            <p className="flex text-[#5E5873] items-center justify-start gap-2 hover:underline hover:text-[#008080] text-sm cursor-pointer">
              <IoMdArrowBack /> Back to Main Table
            </p>
          </div>
        </Link>
      )}
      <div className="flex justify-between items-center border-0 border-b-2 p-3 shadow-sm border-[#008080]">
        <div className="flex justify-start gap-4 items-center">
          <div className="w-20 h-20 rounded-full border border-[#008080] shadow-lg flex justify-center items-center object-cover">
            <img src={logo} alt="logo" className="w-full h-full rounded-full" />
          </div>
          <div>
            <p className="font-bold text-xl leading-7 tracking-wide text-[#008080]">
              {hospitalProfile?.hospitalName}
            </p>
          </div>
        </div>
        <div>
          <button
            className="flex items-center justify-center gap-2 w-64 h-12 rounded p-4 bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md hover:shadow-[#66b2b2] "
            onClick={() => {
              navigate(`/hospitalProfile/edit/${hospitalId}`);
            }}
          >
            <MdEditSquare className="text-lg font-medium text-white hover:text-xl ease-in-out duration-100" />
            <p className="hidden md:block font-medium leading-6 text-lg">
              Edit Hospital Profile
            </p>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col lg:flex-row justify-evenly items-start gap-5 lg:p-3 p-1 bg-white rounded-[19px]">
          <div className="w-full lg:w-1/3 flex items-center justify-around lg:justify-start px-2 lg:px-5 py-5 rounded-2xl bg-[#E8E7F9] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7367F0] flex items-center justify-center border border-[#7367F0]">
              <FiUsers className="text-white" />
            </div>
            <div className="flex flex-col gap-2 text-[#5E5873]">
              <p className="font-bold leading-5 text-2xl text-right md:text-left">
                {inventoryData?.donorCount ? inventoryData?.donorCount : '0'}
              </p>
              <p className="text-sm">Available Donors</p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex items-center justify-around lg:justify-start px-2 lg:px-5 py-5 rounded-2xl bg-[#FCEAEB] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EA5455] flex items-center justify-center border border-[#EA5455]">
              <BloodtypeIcon className="text-white" />
            </div>
            <div className="flex flex-col gap-2 text-[#5E5873]">
              <p className="font-bold leading-5 text-2xl text-right md:text-left">
                {inventoryData?.inventoryCount ? inventoryData?.inventoryCount : '0'}
              </p>
              <p className="text-sm">Inventory Units</p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex items-center justify-around lg:justify-start  px-2 lg:px-5 py-5 rounded-2xl bg-[#E0F9FC] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#00CFE8]  flex items-center justify-center border border-[#00CFE8]">
              <BsReverseListColumnsReverse className="text-white" />
            </div>
            <div className="flex flex-col gap-2 text-[#5E5873]">
              <p className="font-bold leading-5 text-2xl text-right md:text-left">
                {inventoryData?.patientCount ? inventoryData?.patientCount : '0'}
              </p>
              <p className="text-sm">Blood requests</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between w-full ">
          <div className="w-full lg:w-1/2 p-4 h-full flex flex-col gap-6">
            <p className="text-xl font-semibold leading-6 p-4 border-b text-[#006EB9] border-[#006EB9]">
              General Information
            </p>
            <div className="flex flex-col gap-2 p-2 w-full text-[rgba(44,39,36,0.75)]">
              <div className="flex items-baseline gap-4 justify-between">
                <span className="w-1/2 font-medium text-lg leading-4">
                  Hospital Name:
                </span>
                <p>{hospitalProfile?.hospitalName}</p>
              </div>
              <div className="flex items-baseline gap-4 justify-between">
                <span className="w-1/2 font-medium text-lg leading-4">
                  Hospital Address:
                </span>
                <p>{hospitalProfile?.hospitalAddress}</p>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <span className="w-1/2 font-medium text-lg leading-4">
                  Contact Person:
                </span>
                <p>{hospitalProfile?.contactPerson}</p>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <span className="w-1/2 font-medium text-lg leading-4">
                  Location:
                </span>
                <p className="text-right">
                  {hospitalProfile?.province}, {hospitalProfile?.district},{" "}
                  {hospitalProfile?.municipality}, {hospitalProfile?.wardNo}
                </p>
              </div>
              <div className="flex items-baseline gap-4 justify-between">
                <span className="w-1/2 font-medium text-lg leading-4">
                  Hospital Email:
                </span>
                <p className="text-right">{hospitalProfile?.hospitalEmail}</p>
              </div>
              <div className="flex items-baseline gap-4 justify-between">
                <span className="w-1/2 font-medium text-lg leading-4">
                  Contact Info:
                </span>
                <p className="text-right">
                  {hospitalProfile?.phoneNumber1} ,{" "}
                  {hospitalProfile?.phoneNumber2}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-4 h-full my-auto">
            <div className="w-9/10 h-full overflow-hidden transition-all duration-500 ease-in">
              {expandInfo ? (
                <>
                  {hospitalProfile?.hospitalDescription
                    .split('\n')
                    .map((paragraph: string, index: number) => (
                      <p
                        key={index}
                        className="leading-6 text-base text-justify text-[rgba(44,39,36,0.75)]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  <span
                    className="text-[#66b2b2] cursor-pointer"
                    onClick={() => setExpandInfo(false)}
                  >
                    see less
                  </span>
                </>
              ) : (
                <>
                  {hospitalProfile?.hospitalDescription.len > 200 ? (
                    hospitalProfile?.hospitalDescription
                  ) : (
                    <p className="text-[rgba(44,39,36,0.75)]">
                      {hospitalProfile?.hospitalDescription.substring(0, 200)}
                      <span
                        className="text-[#66b2b2] cursor-pointer"
                        onClick={() => setExpandInfo(true)}
                      >
                        ...see more
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
