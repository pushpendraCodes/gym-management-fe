export const FetchGym = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/getGym/${id}`,

        {
          headers: {
            "Content-Type": "application/json",
            // authorization:token ,
          },
        }
      );
      let data = await response.json();
      resolve({
        status: "success",
        data: data,
      });
      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};

export const addTeam = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/add-team`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();
      console.log(data, "teams");
      localStorage.setItem("user", JSON.stringify(data.gym));
      resolve({
        status: "success",
        data: data.gym,
      });
      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};
export const deleteTeam = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/delete-team/${id}`,

        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.gym));
        resolve({
          status: "success",
          data: data.gym,
        });
      } else {
        reject({
          status: "error",
          message: data.error,
        });
      }

      console.log(data, "teams");

      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};
export const updateTeam = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/update-team`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.gym));
        resolve({
          status: "success",
          data: data.gym,
        });
      } else {
        reject({
          status: "error",
          message: data.error,
        });
      }

      console.log(data, "teams");

      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};
export const addExpense = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/add-expenses`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.gym));
        resolve({
          status: "success",
          data: data.gym,
        });
      } else {
        reject({
          status: "error",
          message: data.error,
        });
      }

      console.log(data, "expense");

      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};
export const deleteExpense = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/delete-expenses/${id}`,

        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.gym));
        resolve({
          status: "success",
          data: data.gym,
        });
      } else {
        reject({
          status: "error",
          message: data.error,
        });
      }

      console.log(data, "expense");

      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};
export const EditExpense = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/update-expenses/${body.id}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.gym));
        resolve({
          status: "success",
          data: data.gym,
        });
      } else {
        reject({
          status: "error",
          message: data.error,
        });
      }

      console.log(data, "expense");

      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
    // console.log(error);
  });
};

export const getPaymentHistory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/get-TotalPayHistory`,

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();

      if (response.ok) {
        // localStorage.setItem("user", JSON.stringify(data.gym));
        resolve({
          status: "success",
          data: data.feesHistory,
        });
      } else {
        reject({
          status: "error",
          message: data.error,
        });
      }

      // console.log(data, "payment");

      //   resolve(data);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
