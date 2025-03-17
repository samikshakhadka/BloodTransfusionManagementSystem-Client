// import * as React from 'react';
// import { useState } from 'react';
// import { useReadRequestQuery } from '../api/apiHandler';
// import CreateInventory from '../components/Forms/CreateInventory';
// import EditInventory from '../components/Forms/EditInventory';
// import moment from 'moment';
// import { useSelector } from 'react-redux';
// import {
//   InitialState,
//   InventoryData,
//   PresentInventoryData,
// } from '../models/datamodels';
// import { toast } from 'react-toastify';

// export default function Inventory() {
//   const [createForm, setCreateForm] = useState<boolean>(false);
//   const [editQuantity, setEditQuantity] = useState<InventoryData | null>(null);

//   const user: string | undefined = useSelector(
//     (state: InitialState) => state.auth.userType.userTypeName
//   );

//   console.log(user);
//   const { data: inventoryData } = useReadRequestQuery('inventorys');

//   function handleOpenForm(event?: React.MouseEvent<HTMLButtonElement>) {
//     event?.preventDefault();
//     setCreateForm(!createForm);
//   }

//   function handleCloseEdit(event?: React.MouseEvent<HTMLButtonElement>) {
//     event?.preventDefault();
//     setEditQuantity(null);
//   }

//   const handleEditQuantity = (item: InventoryData) => {
//     setEditQuantity(item);
//   };

//   const colors = [
//     '#E8E7F9',
//     '#FCEAEB',
//     '#E0F9FC',
//     '#E8E7F9',
//     '#FCEAEB',
//     '#E0F9FC',
//     '#E8E7F9',
//     '#FCEAEB',
//   ];

//   return (
//     <div
//       className="flex flex-col gap-5 font-[Poppins] w-full h-screen bg-fixed"
//       style={{ backgroundImage: 'url("/designRectangle.png")' }}
//     >
//       <div className="flex w-full justify-between items-center px-5 py-3">
//         <p className="font-semibold text-xl text-[#008080] border-b-2 px-2 border-[#008080]">
//           Available Inventory
//         </p>
//       </div>

//       <div className="w-full flex flex-wrap justify-between gap-4">
//         {inventoryData?.map((oneInventory: InventoryData, index: number) => (
//           <div
//             onClick={
//               user === 'Hospital Admin' || 'Super Admin'
//                 ? () => handleEditQuantity(oneInventory)
//                 : () => toast.error('You do not have access to alter inventory')
//             }
//             className={`w-full md:w-[49%] flex justify-between text-[#5E5873] items-center rounded-2xl p-4 bg-[${colors[index]}] cursor-pointer hover:bg-button hover:text-white transistion-all duration-150 ease-linear`}
//           >
//             <div className="w-2/3 flex flex-col gap-2">
//               <p className=" font-semibold text-2xl">
//                 {oneInventory.inventoryName}
//               </p>
//               <span className="text-sm">
//                 Last Updated On:{' '}
//                 {oneInventory.dateModified
//                   ? moment(oneInventory.dateModified).format('L')
//                   : moment(oneInventory.dateCreated).format('L')}
//               </span>
//             </div>
//             <span className="w-1/3 flex justify-center text-2xl font-semibold">
//               {oneInventory.quantity}
//             </span>
//           </div>
//         ))}
//       </div>
//       {createForm && <CreateInventory handleOpenForm={handleOpenForm} />}
//       {editQuantity && (
//         <EditInventory
//           editElement={editQuantity}
//           handleCloseEdit={handleCloseEdit}
//         />
//       )}
//     </div>
//   );
// }

import * as React from 'react';
import { useState } from 'react';
import { useReadRequestQuery } from '../api/apiHandler';
import CreateInventory from '../components/Forms/CreateInventory';
import EditInventory from '../components/Forms/EditInventory';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  InitialState,
  InventoryData,
  PresentInventoryData,
} from '../models/datamodels';
import { toast } from 'react-toastify';

export default function Inventory() {
  const [createForm, setCreateForm] = useState<boolean>(false);
  const [editQuantity, setEditQuantity] = useState<InventoryData | null>(null);

  const user: string | undefined = useSelector(
    (state: InitialState) => state.auth.userType.userTypeName
  );

  console.log(user);
  const { data: inventoryData } = useReadRequestQuery('inventorys');

  function handleOpenForm(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    setCreateForm(!createForm);
  }

  function handleCloseEdit(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    setEditQuantity(null);
  }

  const handleEditQuantity = (item: InventoryData) => {
    setEditQuantity(item);
  };

  const colors = [
    '#E8E7F9',
    '#FCEAEB',
    '#E0F9FC',
    '#E8E7F9',
    '#FCEAEB',
    '#E0F9FC',
    '#E8E7F9',
    '#FCEAEB',
  ];

  return (
    <div
      className="flex flex-col gap-5 font-[Poppins] w-full h-screen bg-fixed"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="flex w-full justify-between items-center px-5 py-3">
        <p className="font-semibold text-xl text-[#008080] border-b-2 px-2 border-[#008080]">
          Available Inventory
        </p>
        {/* Add Create Inventory Button */}
        {user === 'Hospital Admin' && (
          <button
            onClick={handleOpenForm}
            className="bg-button text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-all duration-150 ease-linear"
          >
            Create Inventory
          </button>
        )}
      </div>

      <div className="w-full flex flex-wrap justify-between gap-4">
        {inventoryData?.map((oneInventory: InventoryData, index: number) => (
          <div
            key={oneInventory.id || index}
            onClick={
              (user === 'Hospital Admin' || user === 'Super Admin')
                ? () => handleEditQuantity(oneInventory)
                : () => toast.error('You do not have access to alter inventory')
            }
            className={`w-full md:w-[49%] flex justify-between text-[#5E5873] items-center rounded-2xl p-4 bg-[${colors[index % colors.length]}] cursor-pointer hover:bg-button hover:text-white transition-all duration-150 ease-linear`}
          >
            <div className="w-2/3 flex flex-col gap-2">
              <p className="font-semibold text-2xl">
                {oneInventory.inventoryName}
              </p>
              <span className="text-sm">
                Last Updated On:{' '}
                {oneInventory.dateModified
                  ? moment(oneInventory.dateModified).format('L')
                  : moment(oneInventory.dateCreated).format('L')}
              </span>
            </div>
            <span className="w-1/3 flex justify-center text-2xl font-semibold">
              {oneInventory.quantity}
            </span>
          </div>
        ))}
      </div>
      {createForm && <CreateInventory handleOpenForm={handleOpenForm} />}
      {editQuantity && (
        <EditInventory
          editElement={editQuantity}
          handleCloseEdit={handleCloseEdit}
        />
      )}
    </div>
  );
}