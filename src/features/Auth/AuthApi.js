export const GymSignIn = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(payload, "payload");

      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/gym/signIn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set Content-Type header
          },
          body: JSON.stringify(payload), // Convert payload to JSON string
        }
      );
      let data = await response.json();
      if (response.ok) {

        console.log(data.gym,"data.gym");
        localStorage.setItem("user", JSON.stringify(data.gym));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem('justLoggedIn', 'true');
        resolve({
          status: "success",
          gym: data.gym,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      } else {
        reject({
          status: "error",
          message: data,
        });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const GymSignOut = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(payload, "payload");

      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/gym/logOut`,

        {
          headers: {
            "Content-Type": "application/json",
            authorization:localStorage.getItem("accessToken") ,
          },
        }
      );


      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      let data = await response.json();
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      resolve({
        status: "success",
        data: data,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};

export const updateServicesFees = ({services,serviceChange}) => {
  return new Promise(async (resolve, reject) => {
    // console.log(payload, "payload");
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/gym/updateServicesFees`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify({servicesOffered:services,serviceChange}), // Merged into the same config object
        }
      );

      let data = await response.json();

      console.log(data,"data111")
      localStorage.setItem("user", JSON.stringify(data.gym));
      resolve({
        status: "success",
        gym: data.gym,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const forgotPasswordRequest = (email) => {
  return new Promise(async (resolve, reject) => {
    // console.log(payload, "payload");
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/request-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify({email}),
        }
      );

      let data = await response.json();

      if (response.ok) {

        resolve({
          status: "success",
          message:data.message

        });
      } else {
        reject({
          status: "error",
          message: data.message,
        });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const forgotPasswordReset = ({password,token}) => {
  return new Promise(async (resolve, reject) => {
    // console.log(payload, "payload");
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // authorization: localStorage.getItem("accessToken"),
          },
          body: JSON.stringify({password}),
        }
      );

      let data = await response.json();

      if (response.ok) {

        resolve({
          status: "success",
          message:data.message

        });
      } else {
        reject({
          status: "error",
          message: data.message,
        });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};

