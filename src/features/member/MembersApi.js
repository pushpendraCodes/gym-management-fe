export const FetchMembers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/fetch-all-member`,

        {
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      if (response.ok && data.members) {
        resolve({
          status: "success",
          message: "aLL Member successfully fetched",
          members: data.members,
        });
      } else {
        reject({
          status: "error",
          message: data.error || data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }

    // console.log(data);
  });
};

export function FilterMember(sort, pagination, search_qurey, filter) {
  let queryString = "";
  // console.log(search_qurey,"search_qurey")

  // sort
  // https://apnacart.vercel.app /products?_sort=asc&
  // https://apnacart.vercel.app /products?_sort=desc&
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in filter) {
    queryString += `${key}=${filter[key]}&`;
  }
  for (let key in search_qurey) {
    if (search_qurey.search) {
      queryString += `${key}=${search_qurey[key]}&`;
    }
  }

  // pagination
  // https://apnacart.vercel.app /products?_limit=10&_page=3

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  // console.log(queryString, "queryString");
  return new Promise(async (resolve) => {
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/member/getMembers?${queryString}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("accessToken"),
        },
      }
    );
    let data = await response.json();
    // console.log(data,"memberdata");
    const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: data.members, totalMembers: totalItems });
  });
}

export const joinMember = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/add-member`,
        {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "multipart/form-data",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      console.log(data, "memberdata");
      console.log(response, "response");

      if (response.ok && data.member) {
        resolve({
          status: "success",
          message: "Member successfully registered",
          member: data.member,
        });
      } else {
        reject({
          status: "error",
          message: data.errors || data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const deleteMember = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/delete/${id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "multipart/form-data",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      console.log(data, "delete");

      if (response.ok) {
        resolve({
          status: "success",
          message: "Member successfully Deleted",
        });
      } else {
        reject({
          status: "error",
          message: data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const getMemberById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/getMember/${id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "multipart/form-data",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      console.log(response, "response");

      if (response.ok) {
        resolve({
          status: "success",
          user: data.user,
        });
      } else {
        reject({
          status: "error",
          message: data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const memberUpadte = (userData) => {
  console.log(userData, "userData");
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/update/${userData.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(userData.body),

          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      console.log(response, "response");

      if (response.ok) {
        resolve({
          status: "success",
          message: "Successfuly user updatetd.",
        });
      } else {
        reject({
          status: "error",
          message: data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
export const updateMemberFees = (userData) => {
  console.log(userData, "data");
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/updateFees/${userData.id}`,
        {
          method: "POST",
          body: JSON.stringify(userData),

          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      console.log(response, "response");

      if (response.ok) {
        resolve({
          status: "success",
          message: "Successfuly user updatetd.",
          member: data.member,
          feesHistory: data.feesHistory,
        });
      } else {
        reject({
          status: "error",
          message: data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};

export const getFeesHistory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/getfeesHistory/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      let data = await response.json();
      console.log(data, "response");

      if (response.ok) {
        resolve({
          status: "success",
          message: "Successfuly fees history fetched.",
          fees: data.fees,
        });
      } else {
        reject({
          status: "error",
          message: data,
        });
      }
    } catch (error) {
      console.log(error, "error");
      reject({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  });
};
