
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

// Example format for payments: [{ amount: 100, createdAt: '2023-03-01' }]
const ChartOne = ({ payHistory, gymCreationDate, expenses, teams }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [state, setState] = useState({
    series: [
      { name: "Revenue", data: [] },
      { name: "Profit", data: [] },
    ],
  });

  // Function to calculate revenue and profit for each month of the selected year
  const calculateMonthlyData = (year) => {
    const monthlyRevenue = Array(12).fill(0); // Initialize monthly revenue array
    const monthlyProfit = Array(12).fill(0); // Initialize monthly profit array

    // Helper function to get monthly revenue and profit
    const calculateForMonth = (month) => {
      const revenue = payHistory
        .filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return (
            paymentDate.getFullYear() === year &&
            paymentDate.getMonth() === month
          );
        })
        .reduce((total, payment) => total + payment.amount, 0);

      const expensesForMonth = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return (
          expenseDate.getFullYear() == year &&
          expense.month == new Date(0, month).toLocaleString("en", { month: "long" }) // Subtract 1 from month to account for zero-based indexing
        );
      })
      .reduce((total, expense) => total + expense.totalAmount, 0);

      const teamSalaryTotal = teams.reduce(
        (total, team) => total + team.teamSalary,
        0
      );

      const profit = revenue - expensesForMonth - teamSalaryTotal;
      return { revenue, profit };
    };

    // Calculate revenue and profit for each month
    for (let i = 0; i < 12; i++) {
      const { revenue, profit } = calculateForMonth(i);
      monthlyRevenue[i] = revenue;
      monthlyProfit[i] = profit;
    }

    // Update the state with new data
    setState({
      series: [
        { name: "Revenue", data: monthlyRevenue },
        { name: "Profit", data: monthlyProfit },
      ],
    });
  };

  useEffect(() => {
    calculateMonthlyData(selectedYear);
  }, [selectedYear, payHistory]);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value)); // Update selected year
  };



  const options = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#FF7F0E", "#2CA02C"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },

    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [
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
    yaxis: {
      title: {
        text: "Amount",
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex  w-full  gap-3 sm:gap-5">
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="wrap">
              <p className="font-semibold w-full text-primary">Total Revenue</p>
            </div>
          </div>
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Profit</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="relative z-20 inline-block">
            <select
              name="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none">
              {/* Dynamically populate year options */}
              {Array.from({
                length:
                  new Date().getFullYear() -
                  new Date(gymCreationDate).getFullYear() +
                  1,
              }).map((_, idx) => {
                const year = new Date(gymCreationDate).getFullYear() + idx;
                return (
                  <option
                    key={year}
                    value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div
          id="chartOne"
          className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
