import React, { useEffect, useState } from "react";
import { GoEye } from "react-icons/go";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import {
  formatCurrency,
  monthlyActiveMember,
  selectRevenueProfit,
} from "../../features/gym/GymSlice";
import { useSelector } from "react-redux";
import { selectAllMembers } from "../../features/member/MembersSlice";

const CardDataStats = ({ children }) => {
  const [currentFilterRevenue, setFilterRevenue] = useState("month");
  const [currentFilterProfit, setFilterProfit] = useState("month");

  let revenueProfit = useSelector(selectRevenueProfit);
  let activeMonthlyMember = useSelector(monthlyActiveMember);
  const totalMembers = useSelector(selectAllMembers);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
      {/* Card 1 - Total Revenue */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11 items-center justify-between">
          <GoEye className="dark:bg-meta-4" size={25} color="blue" />
          <div className="relative z-20 inline-block">
            <select
              name="revenue-filter"
              onChange={(e) => setFilterRevenue(e.target.value)}
              className="appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="month" className="dark:bg-boxdark">
                This month
              </option>
              <option value="year" className="dark:bg-boxdark">
                This year
              </option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">
              {currentFilterRevenue === "month"
                ? formatCurrency(revenueProfit?.currentMonthRevenue)
                : formatCurrency(revenueProfit?.currentYearRevenue)}
            </h4>
            <span className="text-sm font-medium">Total Revenue</span>
          </div>

          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              revenueProfit?.[
                currentFilterRevenue === "month"
                  ? "currentMonthRevenueGrowth"
                  : "currentYearRevenueGrowth"
              ] > 0
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {Math.abs(
              currentFilterRevenue === "month"
                ? revenueProfit?.currentMonthRevenueGrowth
                : revenueProfit?.currentYearRevenueGrowth
            )}
            %
            {currentFilterRevenue === "month" ? (
              revenueProfit?.currentMonthRevenueGrowth > 0 ? (
                <IoIosArrowRoundUp size={25} color="green" />
              ) : (
                <IoIosArrowRoundDown size={25} color="red" />
              )
            ) : revenueProfit?.currentYearRevenueGrowth > 0 ? (
              <IoIosArrowRoundUp size={25} color="green" />
            ) : (
              <IoIosArrowRoundDown size={25} color="red" />
            )}
          </span>
        </div>
      </div>

      {/* Card 2 - Total Profit */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11 items-center justify-between">
          <GoEye className="dark:bg-meta-4" size={25} color="blue" />
          <div className="relative z-20 inline-block">
            <select
              name="profit-filter"
              onChange={(e) => setFilterProfit(e.target.value)}
              className="appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="month" className="dark:bg-boxdark">
                This month
              </option>
              <option value="year" className="dark:bg-boxdark">
                This year
              </option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">
              {currentFilterProfit === "month"
                ? formatCurrency(revenueProfit?.currentMonthProfit)
                : formatCurrency(revenueProfit?.currentYearProfit)}
            </h4>
            <p className="text-sm">
              (
              {currentFilterProfit === "month"
                ? (revenueProfit?.currentMonthRevenue > 0
                    ? (
                        (revenueProfit.currentMonthProfit * 100) /
                        revenueProfit.currentMonthRevenue
                      ).toFixed(2)
                    : "N/A")
                : (revenueProfit?.currentYearRevenue > 0
                    ? (
                        (revenueProfit.currentYearProfit * 100) /
                        revenueProfit.currentYearRevenue
                      ).toFixed(2)
                    : "N/A")}
              %)
            </p>
            <span className="text-sm font-medium">Total Profit</span>
          </div>

          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              revenueProfit?.[
                currentFilterProfit === "month"
                  ? "currentMonthProfitGrowth"
                  : "currentYearProfitGrowth"
              ] > 0
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {Math.abs(
              currentFilterProfit === "month"
                ? revenueProfit?.currentMonthProfitGrowth
                : revenueProfit?.currentYearProfitGrowth
            )}
            %
            {currentFilterProfit === "month" ? (
              revenueProfit?.currentMonthProfitGrowth > 0 ? (
                <IoIosArrowRoundUp size={25} color="green" />
              ) : (
                <IoIosArrowRoundDown size={25} color="red" />
              )
            ) : revenueProfit?.currentYearProfitGrowth > 0 ? (
              <IoIosArrowRoundUp size={25} color="green" />
            ) : (
              <IoIosArrowRoundDown size={25} color="red" />
            )}
          </span>
        </div>
      </div>

      {/* Card 3 - Active Members */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11 items-center justify-between">
          <GoEye className="dark:bg-meta-4" size={25} color="blue" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">
              {activeMonthlyMember?.activeMembers || 0}
            </h4>
            <span className="text-sm font-medium">Active Members</span>
          </div>

          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              activeMonthlyMember?.currentMonthActiveMembersGrowth > 0
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {Math.abs(activeMonthlyMember?.currentMonthActiveMembersGrowth)}%
            {activeMonthlyMember?.currentMonthActiveMembersGrowth > 0 ? (
              <IoIosArrowRoundUp size={25} color="green" />
            ) : (
              <IoIosArrowRoundDown size={25} color="red" />
            )}
          </span>
        </div>
      </div>

      {/* Card 4 - Total Members */}
      <div className="rounded-sm border border-stroke bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11 items-center justify-between">
          <GoEye className="dark:bg-meta-4" size={25} color="blue" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">
              {totalMembers?.length}
            </h4>
            <span className="text-sm font-medium">Total Members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
