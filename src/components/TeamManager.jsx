import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addTeamAsync,
  deleteTeamAsync,
  updateTeamAsync,
} from "../features/gym/GymSlice";
import { useSelector } from "react-redux";
import { selectLoggedGym } from "../features/Auth/AuthSlice";
import Alert from "./Alert";
import DeleteModal from "./DeleteModal";

const TeamManager = () => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [teamName, setTeamName] = useState("");
  const [teamSalary, setTeamSalary] = useState("");
  const [teamType, setTeamType] = useState("trainer");
  const [teamStatus, setTeamStatus] = useState("Active");
  const [selectedUser, setselectedUser] = useState({
    type: "",
    id: "",
    name: "",
  });
  const [showSalaryInfo, setShowSalaryInfo] = useState(false);
  let dispatch = useDispatch();
  let gym = useSelector(selectLoggedGym);
  // Add team

  useEffect(() => {
    if (selectedUser.type === "edit" && gym?.teams) {
      const team = gym.teams.find((team) => team._id === selectedUser.id);

      if (team) {
        setTeamName(team.teamName);
        setTeamSalary(team.teamSalary);
        setTeamType(team.teamType);
        setTeamStatus(team.status);
      }
    }
  }, [selectedUser.id, selectedUser.type, gym]);

  const handleStatusToggle = () => {
    setTeamStatus((prevStatus) =>
      prevStatus === "Active" ? "Inactive" : "Active"
    );
  };
  const handleAddTeam = async (e) => {
    e.preventDefault();

    try {
      if (selectedUser.type === "edit" && selectedUser.id) {
        const teams = {
          teamName,
          teamSalary,
          teamType,
          status: teamStatus,
          teamId: selectedUser.id,
        };
        await dispatch(updateTeamAsync(teams)).unwrap();
        setAlert({
          message: "team member updated successfully!",
          type: "success",
        });
        setselectedUser({
          type: "",
          id: "",
          name: "",
        });
        // setdeleteModalOpen(false);
        // reloaddata();
        setTeamName("");
        setTeamSalary("");
        setTeamType("trainer");
      } else {
        const teams = { teamName, teamSalary, teamType, status: "Active" };
        await dispatch(addTeamAsync(teams)).unwrap();
        setAlert({
          message: "team member added successfully!",
          type: "success",
        });
        // setdeleteModalOpen(false);
        // reloaddata();
        setTeamName("");
        setTeamSalary("");
        setTeamType("trainer");
      }
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  // Toggle team status between Active and Inactive

  const [deleteModalOpen, setdeleteModalOpen] = useState(false);

  // Remove a team
  const handelDelete = () => {
    try {
      dispatch(deleteTeamAsync(selectedUser.id)).unwrap();
      setAlert({
        message: "team member deleted successfully!",
        type: "success",
      });
      setselectedUser({ type: "", id: "", name: "" });
      setdeleteModalOpen(false);
      // reloaddata()
    } catch (err) {
      console.log(err, "err");
      setAlert({ message: `Error: ${err}`, type: "error" });
    }
  };

  // Toggle salary info on hover
  const handleMouseEnter = () => {
    setShowSalaryInfo(true);
  };

  const handleMouseLeave = () => {
    setShowSalaryInfo(false);
  };

  return (
    <div className="p-6 bg-white shadow-default dark:border-strokedark dark:bg-boxdark min-h-screen">
      {deleteModalOpen && (
        <DeleteModal
          // reloaddata={reloaddata}
          handelDelete={handelDelete}
          clickedId={selectedUser}
          setdeleteModalOpen={setdeleteModalOpen}
        />
      )}
      <h3 className="font-medium text-black dark:text-white">Team Manager</h3>
      <p className="text-gray-600 mb-4 text-sm my-3">
        Manage your teams by adding details, updating statuses, and setting
        roles. so we can calculate revenue more efficiently
      </p>

      {/* Add Team Section */}
      <form
        onSubmit={handleAddTeam}
        className="bg-white dark:border-strokedark dark:bg-boxdark d p-4 rounded-lg shadow-md mb-6">
        <h3 className="font-medium text-black dark:text-white">Add Team</h3>

        <div className="mb-4">
          <div className="w-full my-4 xl:w-1/2">
            <label className="mb-2 block text-sm text-black dark:text-white">
              Name <span className="text-meta-1">*</span>
            </label>
            <input
              name="firstName"
              className=" text-sm placeholder:text-sm w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="w-full my-4 xl:w-1/2">
            <label className="mb-2 block text-sm text-black dark:text-white">
              Sallary <span className="text-meta-1">*</span>
            </label>
            <input
              name="sallary"
              className=" text-sm placeholder:text-sm w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="sallary"
              value={teamSalary}
              onChange={(e) => setTeamSalary(e.target.value)}
              type="number"
              required
            />
            <button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute top-2 right-3 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-blue-600">
              i
            </button>

            {/* Salary Info Popup */}
            {showSalaryInfo && (
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg p-4 shadow-md w-64 z-10">
                <h3 className="font-semibold mb-2 text-red-600">
                  Salary Information
                </h3>
                <p className="text-sm">
                  Please enter an monthly salary to calculate the monthly
                  revenue.
                </p>
              </div>
            )}
          </div>

          <div className="w-full my-4 xl:w-1/2">
            <label className="mb-2 block text-sm  text-black dark:text-white">
              type <span className="text-meta-1">*</span>
            </label>

            <select
              value={teamType}
              onChange={(e) => setTeamType(e.target.value)}
              className="text-sm placeholder:text-sm w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              <option value="trainer">Trainer</option>
              <option value="other">Other</option>
            </select>
          </div>

          {selectedUser.type === "edit" && selectedUser.id && (
            <div className="flex items-center justify-between mt-4">
              <label className="font-semibold">Status: {teamStatus}</label>
              <div
                onClick={handleStatusToggle}
                className={`relative inline-block w-10 h-6 align-middle transition duration-200 ease-in-out rounded-full ${
                  teamStatus === "Active" ? "bg-green-500" : "bg-red-500"
                } `}>
                <span
                  className={`absolute block w-6 h-6 rounded-full bg-white border-2 appearance-none cursor-pointer transform transition-transform ${
                    teamStatus === "Active" ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
        <button
          //   onClick={handleAddTeam}
          type="submit"
          className="bg-blue-500 text-white px-3 py-1  mt-3 text-sm hover:bg-blue-600 transition duration-200">
          {selectedUser.type === "edit" ? "Update" : "Add Team"}
        </button>
      </form>

      {/* Team List Section */}


      <div class="relative overflow-x-auto">
        <table class="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 rounded-s-lg">
                Name
              </th>

              <th
                scope="col"
                class="px-6 py-3 rounded-e-lg">
                Salary
              </th>
              <th
                scope="col"
                class="px-6 py-3 rounded-e-lg">
                Type
              </th>
              <th
                scope="col"
                class="px-6 py-3 rounded-e-lg">
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 rounded-e-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gym?.teams ? (
              gym?.teams.map((team, i) => {
                return (
                  <>
                    <tr
                      key={i}
                      class="bg-white border dark:bg-gray-800">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {team.teamName}
                      </th>
                      <td class="px-6 py-4">
                        {team.teamSalary.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                      <td class="px-6 py-4">
                        {team.teamType}
                      </td>
                      <td class="px-6 py-4">
                      {team.status == "Active" ? (
                      <img
                        className="w-10 h-10 mx-auto"
                        src="active.png"
                        alt="active"
                      />
                    ) : (
                      <img
                        className="w-10 h-10 mx-auto"
                        src="inactive.png"
                        alt="inactive"
                      />
                    )}
                      </td>
                      <td class="px-6 py-4">
                        <div className="text-sm flex gap-1 text-center">
                          <button
                          onClick={() =>
                        setselectedUser({
                          type: "edit",
                          id: team.id,
                          name: team.teamName,
                        })
                      }
                            className="px-2 border text-xs bg-green-500 text-white border-gray-300">
                            Edit
                          </button>

                          <button
                            onClick={() => {
                        setselectedUser({
                          type: "delete",
                          id: team.id,
                          name: team.teamName,
                        });
                        setdeleteModalOpen(true);
                      }}
                            className="px-2 border text-xs bg-red-700 text-white border-gray-300">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            ) : (
              <p className="text-center">No data Found</p>
            )}
          </tbody>


        </table>
      </div>
    </div>
  );
};

export default TeamManager;
