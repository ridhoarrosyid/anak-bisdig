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
    baseUrl: "/api/products",
    method: "DELETE",
    role: ["admin", "user"],
  },
  {
    baseUrl: "/api/suggestions",
    method: "POST",
    role: ["user"],
  },

  {
    baseUrl: "/api/products/myproduct",
    method: "GET",
    role: ["user", "admin"],
  },
  {
    baseUrl: "/api/suggestion",
    method: "POST",
    role: ["user", "admin"],
  },
  {
    baseUrl: "/api/files",
    method: "GET",
    role: ["user", "admin"],
  },
  {
    baseUrl: "/api/products",
    method: "PATCH",
    role: ["user", "admin"],
  },
];
