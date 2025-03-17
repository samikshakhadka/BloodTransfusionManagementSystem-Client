import { Bar } from 'react-chartjs-2';
interface InventoryItem {
  bloodGroup: {
    bloodGroupName: string;
  };
  quantity: number;
}

function BarChart({ inventoryData }: { inventoryData: InventoryItem[] }) {
  if (!inventoryData || !Array.isArray(inventoryData) || inventoryData.length === 0) {
    return null;
  }

  const labels = inventoryData.map((item) => item.bloodGroup.bloodGroupName);
  const quantities = inventoryData.map((item) => item.quantity);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Available Inventory Units',
        data: quantities,
        backgroundColor: [
          '#7367F0',
          '#EA5455',
          '#00CFE8',
          '#28C76F',
          '#FFB673',
          '#9658E3',
          '#C8A2C8',
          '#F5F5DC',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Distribution of available inventory based on blood group',
      },
    },
  };

  return (
    <div className="chart-container p-8 w-full">
      <p className="font-medium text-xl leading-6 text-center text-[#EA5455]">
        Bar Chart
      </p>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
