import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import { MdBloodtype, MdCancel } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { MdContactEmergency } from 'react-icons/md';
import { BiDonateBlood } from 'react-icons/bi';
import { FcPhone } from 'react-icons/fc';
import { DonorDataTable } from '../models/datamodels';

export default function BasicCard({ data }: { data: DonorDataTable | null }) {
  if (data == null) {
    return <p>No data available</p>;
  }
  const checkLastDonation = (lastDonated: string) => {
    if (lastDonated == null) {
      return true;
    }

    const currentDate = new Date();
    const lastDonatedDate = new Date(lastDonated);
    const daysDifference =
      (currentDate.getTime() - lastDonatedDate.getTime()) /
      (1000 * 60 * 60 * 24);
    return daysDifference >= 90;
  };
  const checkAgeEligibility = (dateOfBirth: string) => {
    const currentDate = new Date();
    const ageInYears = moment(currentDate).diff(moment(dateOfBirth), 'years');
    return ageInYears >= 18 && ageInYears < 60;
  };

  const donationEligibility = checkLastDonation(data.lastDonated);
  const ageEligibility = checkAgeEligibility(data.dateOfBirth);
  console.log(ageEligibility);

  const lastDonated = data.lastDonated
    ? moment(data.lastDonated).format('YYYY/MM/DD')
    : 'Not Donated';

  console.log(donationEligibility);
  return (
    <Card
      className="flex justify-between px-4 font-[Poppins]"
      sx={{ minWidth: 275 }}
    >
      <CardContent>
        <div className="text-2xl font-semibold text-[#5E5873] ">
          {' '}
          {data.donorName}
        </div>
        <div className="text-base  text-gray-500 capitalize">
          {data.municipality} - {data.wardNo}
        </div>
        <div className=" text-lg font-medium text-[#5E5873] flex align-middle items-center gap-2">
          <div className=""> Father's Name: {data.fatherName}</div>
        </div>
      </CardContent>
      <CardContent>
        <div className="flex text-2xl gap-1  justify-start items-center align-middle text-[#5E5873] font-semibold">
          <MdBloodtype className="text-2xl text-red-600" />{' '}
          {data.bloodGroup.bloodGroupName}
        </div>
        <div className="text-lg flex gap-2 justify-start items-center align-middle text-[#5E5873] font-medium">
          {' '}
          <BiDonateBlood /> {lastDonated}
        </div>
        <div className="flex text-lg gap-1 items-center align-middle">
          {donationEligibility && ageEligibility ? (
            <div className="flex gap-1 text-green-700 text-lg items-center align-middle">
              <TiTick className="text-2xl text-green-800" />
              Eligible
            </div>
          ) : (
            <div className="flex gap-2 text-red-600 items-center align-middle">
              <MdCancel className=" text-xl text-red-700" />
              Not Eligible
            </div>
          )}
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-3 font-semibold text-[#5E5873]">
        <div className=" text-xl gap-2 flex align-middle items-center  cursor-pointer">
          <FcPhone className=" text-2xl" /> {data.phoneNumber}
        </div>

        <div className="text-xl gap-3 flex align-middle items-center cursor-pointer">
          <MdContactEmergency className=" text-[#911911] text-xl" />{' '}
          {data.emergencyContact}
        </div>
      </CardContent>
    </Card>
  );
}
