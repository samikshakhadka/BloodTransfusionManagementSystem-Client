import { toast } from 'react-toastify';
import { EditDonors, ShowAvailableData } from '../models/datamodels';
import { useReadRequestQuery } from '../api/apiHandler';

const AvailableDonors: React.FC<ShowAvailableData> = ({ clickedRowData }) => {
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

  const { data: newDonors, isLoading: loading } = useReadRequestQuery(
    `/filtereddonors/${clickedRowData?.bloodGroup.bloodGroupName}/${clickedRowData?.municipality}/${clickedRowData?.wardNo}`
  );

  return (
    <div className="w-full flex flex-col items-center px-3 py-4 font-[Poppins] bg-gray-50 shadow-md rounded-md">
      <div className="w-3/4 flex items-start gap-2 px-6 py-2 bg-white border-b border-[#008080] rounded-t-md">
        <span className="text-[#008080] w-full font-semibold text-xl mb-2">
          Available Donors
        </span>
        <div className="w-full flex items-center gap-4">
          <span className="text-lg text-[#008080]">
            Ward No: {clickedRowData?.wardNo}
          </span>
          <span className="text-lg text-[#008080] cursor-pointer hover:underline">
            Blood group: {clickedRowData?.bloodGroup.bloodGroupName}
          </span>
        </div>
      </div>
      <div className="w-3/4 mx-auto flex flex-col items-start px-6 bg-white rounded-b-md">
        {loading && (
          <p className="text-[#008080] text-lg">Loading Available Donors...</p>
        )}
        {!loading && newDonors?.length === 0 ? (
          <p className="text-[#008080] text-lg w-full text-center m-2">
            Oops, There are no available donors in your ward.
          </p>
        ) : (
          newDonors?.map((oneDonor: EditDonors) => (
            <div
              key={oneDonor.donorId}
              className="w-full  flex justify-between items-center p-2"
            >
              <span className="w-full text-lg text-[#008080]">
                {oneDonor.donorName} :
              </span>
              <span
                className=" w-full cursor-pointer hover:underline ml-2 text-lg font-semibold text-[#008080]"
                onClick={() => copyToClipboard(oneDonor.phoneNumber)}
              >
                {oneDonor.phoneNumber}
              </span>
              <span className="w-full text-lg text-[#008080]">
                {oneDonor.municipality} - {oneDonor.wardNo}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableDonors;
