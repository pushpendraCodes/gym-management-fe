import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

// interface ChartThreeState {
//   series: number[];
// }

const genderOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#1E90FF", "#FF1493"], // Updated male/female colors
  labels: ["Male", "Female"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const trainingOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: [
    "#1F77B4", // Cardio-M
    "#E377C2", // Cardio-F
    "#2CA02C", // Strength
    "#FF7F0E", // Personal Training
    "#D62728", // Group Classes
    "#9467BD", // Yoga Classes
  ],
  labels: [
    "Cardio-M",
    "Cardio-F",
    "Strength",
    "Personal Training",
    "Group Classes",
    "Yoga Classes",
  ],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],




};


const subscriptionOptions = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#008FFB", "#FEB019", "#00E396"],  // Monthly, Quarterly, Yearly colors
  labels: ["Monthly", "Quarterly", "Yearly"],
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};
const ChartThree = ({ members }) => {
  const [genderSeries, setGenderSeries] = useState([0, 0]);
  const [trainingSeries, setTrainingSeries] = useState([0, 0, 0, 0, 0, 0]);
  const [subscriptionSeries, setSubscriptionSeries] = useState([0, 0, 0]);

  useEffect(() => {
    // Gender breakdown: count male and female members
    const maleCount = members.filter((member) => member.gender == 1).length;
    const femaleCount = members.filter((member) => member.gender == 2).length;
    setGenderSeries([maleCount, femaleCount]);

    // Training breakdown: count members based on training type
    const trainingCounts = [0, 0, 0, 0, 0, 0];
    members.forEach((member) => {
      trainingCounts[member.training - 1]++;
    });
    setTrainingSeries(trainingCounts);


    const monthlyCount = members.filter(
      (member) => member.SubscriptionType == 1
    ).length;
    const quarterlyCount = members.filter(
      (member) => member.SubscriptionType ==2
    ).length;
    const yearlyCount = members.filter(
      (member) => member.SubscriptionType == 3
    ).length;
    setSubscriptionSeries([monthlyCount, quarterlyCount, yearlyCount]);
  }, [members]);

  console.log(subscriptionSeries,"subscriptionSeries")

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-4 pt-6 pb-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6 xl:col-span-8">
  {/* Gender Breakdown Chart */}
  <div className="chart-container">
    <h3 className="text-center font-semibold text-black dark:text-white">
      Gender Breakdown
    </h3>
    <div className="flex flex-col md:flex-row gap-5 items-center justify-center md:justify-between">
      <ReactApexChart
        options={genderOptions}
        series={genderSeries}
        type="donut"
        height={300}
      />
      <div className="flex justify-center mt-4">
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#1E90FF] mr-2"></span>
          <span>Male</span>
        </div>
        <div className="flex items-center">
          <span className="block h-3 w-3 rounded-full bg-[#FF1493] mr-2"></span>
          <span>Female</span>
        </div>
      </div>
    </div>
  </div>

  {/* Training Breakdown Chart */}
  <div className="chart-container mt-5">
    <h3 className="text-center font-semibold text-black dark:text-white">
      Training Type Breakdown
    </h3>
    <div className="flex flex-col md:flex-row gap-5 items-center justify-center md:justify-between">
      <ReactApexChart
        options={trainingOptions}
        series={trainingSeries}
        type="donut"
        height={300}
      />
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#1F77B4] mr-2"></span>
          <span className="text-sm">Cardio-M</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#E377C2] mr-2"></span>
          <span className="text-sm">Cardio-F</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#2CA02C] mr-2"></span>
          <span className="text-sm">Strength</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#FF7F0E] mr-2"></span>
          <span className="text-sm">Personal Training</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#D62728] mr-2"></span>
          <span className="text-sm">Group Classes</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#9467BD] mr-2"></span>
          <span className="text-sm">Yoga Classes</span>
        </div>
      </div>
    </div>
  </div>

  {/* Subscription Breakdown Chart */}
  <div className="chart-container mt-5">
    <h3 className="text-center font-semibold text-black dark:text-white">
      Subscription Type Breakdown
    </h3>
    <div className="flex flex-col md:flex-row gap-5 items-center justify-center md:justify-between">
      <ReactApexChart
        options={subscriptionOptions}
        series={subscriptionSeries}
        type="donut"
        height={300}
      />
      <div className="flex flex-wrap justify-center mt-4">
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#008FFB] mr-2"></span>
          <span className="text-sm">Monthly</span>
        </div>
        <div className="flex items-center mr-4">
          <span className="block h-3 w-3 rounded-full bg-[#FEB019] mr-2"></span>
          <span className="text-sm">Quarterly</span>
        </div>
        <div className="flex items-center">
          <span className="block h-3 w-3 rounded-full bg-[#00E396] mr-2"></span>
          <span className="text-sm">Yearly</span>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ChartThree;
