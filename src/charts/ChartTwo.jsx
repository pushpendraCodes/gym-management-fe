// import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories:  [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

// interface ChartTwoState {
//   series: {
//     name: string;
//     data: number[];
//   }[];Profit this week
// }

const ChartTwo = ({gymCreationDate,members}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [state, setState] = useState({
    series: [{ name: "New Members", data: [] }],
  });

  // Function to calculate new members for each month of the selected year
  const calculateMonthlyMembers = (year) => {
    const monthlyMembers = Array(12).fill(0); // Initialize monthly members array

    // Calculate new members for each month
    members.forEach((member) => {
      const memberDate = new Date(member.createdAt);
      if (memberDate.getFullYear() === year) {
        const month = memberDate.getMonth(); // Get month (0-11)
        monthlyMembers[month] += 1; // Increment member count for that month
      }
    });

    // Update the chart with new data
    setState({
      series: [{ name: "New Members", data: monthlyMembers }],
    });
  };

  useEffect(() => {
    calculateMonthlyMembers(selectedYear);
  }, [selectedYear, members]);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value)); // Update selected year
  };


  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-4 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:col-span-8">
    <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
      <h4 className="text-lg sm:text-xl font-semibold text-black dark:text-white">
        New Members
      </h4>
      <div className="flex w-full sm:w-auto justify-end">
        <div className="relative inline-block w-full sm:w-auto">
          <select
            name="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full sm:w-auto appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border border-gray-300 rounded-md dark:border-gray-600">
            {/* Dynamically populate year options */}
            {Array.from({
              length:
                new Date().getFullYear() -
                new Date(gymCreationDate).getFullYear() +
                1,
            }).map((_, idx) => {
              const year = new Date(gymCreationDate).getFullYear() + idx;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>

    <div>
      <div id="chartTwo" className="overflow-x-auto -ml-2 sm:ml-0">
        <ReactApexChart
          options={options}
          series={state.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  </div>

  );
};

export default ChartTwo;
