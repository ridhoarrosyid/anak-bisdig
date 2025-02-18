export const AllowAPI = [
  {
    baseUrl: "/api/products",
    method: "GET",
    role: ["admin", "user"],
  },
  {
    baseUrl: "/api/products",
    method: "POST",
    role: ["admin", "user"],
  },
  {
    baseUrl: "/api/suggestions",
    method: "POST",
    role: ["user"],
  },

  {
    baseUrl: "",
    method: "",
    role: [],
  },
  {
    baseUrl: "",
    method: "",
    role: [],
  },
  {
    baseUrl: "",
    method: "",
    role: [],
  },
];
