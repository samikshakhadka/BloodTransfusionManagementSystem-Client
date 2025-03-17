import { FiUsers } from "react-icons/fi";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import BarChart from "../components/Charts/BarChart";
import PieChart from "../components/Charts/PieChart";
import { useReadRequestQuery } from "../api/apiHandler";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import {  InventoryData, InitialState } from "../models/datamodels";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
Chart.register(CategoryScale);

function Homepage() {
  const { data: donorData } = useReadRequestQuery("/donors");
  const { data: inventoryData } = useReadRequestQuery("/inventorys");
  const { data: patientWaitlistData } =
    useReadRequestQuery("/patientwaitlists");

  let inventoryCount: number = 0;
  {
    inventoryData &&
      inventoryData.map((oneInventory: InventoryData) => {
        inventoryCount = inventoryCount + oneInventory.quantity;
      });
  }
  const patientWaitlistCount = patientWaitlistData
    ? patientWaitlistData.length
    : 0;

  const accessLevel = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  const hospitalId = useSelector(
    (state: InitialState) => state.auth.hospitalId
  );

  const { data: hospitalStats } = useReadRequestQuery(
    `totalcount/${hospitalId}`
  );

  const displayData = {
    inventory: 0,
    donors: 0,
    requests: 0
  }

  if (accessLevel === "Super Admin" ) {
    displayData.inventory = inventoryCount
    displayData.donors = donorData?.count
    displayData.requests = patientWaitlistCount
  } else {
    displayData.inventory = hospitalStats?.inventoryCount
    displayData.donors = hospitalStats?.donorCount
    displayData.requests = hospitalStats?.patientCount
  }
  return (
    <div
      className="w-full h-full bg-fixed py-4"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      
      <div className="w-full m-auto rounded-lg p-6 bg-white border border-white font-[Poppins] flex flex-col gap-5">
        <p className="text-xl font-medium leading-5 border-b p-1">Statistics</p>
        <div className="w-full flex flex-col lg:flex-row justify-evenly items-center lg::items-start gap-5 lg:p-3 p-1">
          <div className="w-2/3 lg:w-1/3 flex items-center justify-around lg:justify-start px-2 lg:px-5 py-5 rounded-2xl bg-[#E8E7F9] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7367F0] flex items-center justify-center border border-[#7367F0]">
              <FiUsers className="text-white" />
            </div>
            <div className="flex flex-col gap-2 text-[#5E5873]">
              <p className="font-bold leading-5 text-2xl text-right md:text-left">
                {displayData.donors ? displayData.donors : 0}
              </p>
              <p className="text-sm">Available Donors</p>
            </div>
          </div>
          <div className="w-2/3 lg:w-1/3 flex items-center justify-around lg:justify-start px-2 lg:px-5 py-5 rounded-2xl bg-[#FCEAEB] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EA5455] flex items-center justify-center border border-[#EA5455]">
              <BloodtypeIcon className="text-white" />
            </div>
            <div className="flex flex-col gap-2 text-[#5E5873]">
              <p className="font-bold leading-5 text-2xl text-right md:text-left">
                {displayData.inventory ? displayData.inventory : 0}
              </p>
              <p className="text-sm">Inventory Units</p>
            </div>
          </div>
          <div className="w-2/3 lg:w-1/3 flex items-center justify-around lg:justify-start  px-2 lg:px-5 py-5 rounded-2xl bg-[#E0F9FC] gap-4">
            <div className="w-12 h-12 rounded-full bg-[#00CFE8]  flex items-center justify-center border border-[#00CFE8]">
              <BsReverseListColumnsReverse className="text-white" />
            </div>
            <div className="flex flex-col gap-2 text-[#5E5873]">
              <p className="font-bold leading-5 text-2xl text-right md:text-left">
                {displayData.requests ? displayData.requests : 0}
              </p>
              <p className="text-sm">Blood requests</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-2 my-10 font-[Poppins] bg-white p-2">
        <div className="w-full flex justify-center">
        <p className="text-2xl font-semibold leading-8 text-[#EA5455]">INVENTORY</p>
        </div>
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 bg-white rounded-lg border border-white flex items-start justify-start">
            <BarChart inventoryData={inventoryData} />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-lg px-4 py-8 gap-6">
            <p className="text-xl font-medium leading-6 border-b p-1 text-[#EA5455] border-[#FCEAEB]">
              Individual Inventory Count
            </p>
            <div className="w-full py-2">
              {inventoryData?.map(
                (oneInventory: InventoryData, index: number) => (
                  <div
                    className="w-full flex justify-between items-center border-b border-[#FCEAEB] p-2"
                    key={index}
                  >
                    <p>{oneInventory.inventoryName}</p>
                    <p className="font-bold">{oneInventory.quantity}</p>
                  </div>
                )
              )}
            </div>
            <Link to="/inventory">
              <button className="w-1/2 bg-[#25CED1] rounded-md border border-[#25CED1] flex items-center justify-center p-2 text-white">
                View Full Table
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center gap-2 my-10 font-[Poppins] ">
        <div className="w-full lg:w-2/3 bg-white rounded-lg border border-white flex items-start justify-center">
          <PieChart donorData={donorData?.data} />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
