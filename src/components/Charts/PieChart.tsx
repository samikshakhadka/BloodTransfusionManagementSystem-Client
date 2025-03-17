import { Pie } from 'react-chartjs-2';
interface DonorItem {
  bloodGroup: {
    bloodGroupName: string;
  };
}
const PieChart = ({ donorData }: { donorData: DonorItem[] }) => {
  if (!donorData || !Array.isArray(donorData) || donorData.length === 0) {
    return null;
  }

  const bloodGroupCounts: { [key: string]: number } = {};
  donorData.forEach((item) => {
    const bloodGroupName = item.bloodGroup.bloodGroupName;
    if (bloodGroupCounts[bloodGroupName]) {
      bloodGroupCounts[bloodGroupName]++;
    } else {
      bloodGroupCounts[bloodGroupName] = 1;
    }
  });

  const labels = Object.keys(bloodGroupCounts);
  const counts = labels.map((bloodGroupName) => bloodGroupCounts[bloodGroupName]);

  const data = {
    labels: labels,
    datasets: [
      {
        data: counts,
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
        text: 'Distribution of donors based on blood group',
      },
    },
  };

  return (
    <div className="chart-container py-8 w-[90%]">
      <p className="font-semibold text-2xl leading-6 text-center text-[#7367F0]">
        Donor Distribution
      </p>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
