import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default function ManageProduct() {
  const [dataProduct, setDataProduct] = useState([
    { name: "", description: "", price: 0, image: "", publish: false },
  ]);
  const [auth, setAuth] = useState({ success: false });
  const navigate = useNavigate();
  const [cookies] = useCookies();
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }
      try {
        const ress = await fetch("http://localhost:3000/pageauth", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
          credentials: "include",
        }).then((res) => res.json());
        setAuth(ress);
      } catch (error) {
        console.log(error);
      }
    };

    verifyCookie();
  }, [cookies.token, navigate]);
  useEffect(() => {
    async function fetchProduct() {
      const data = await fetch("http://localhost:3000/api/products/myproduct", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }).then((res) => res.json());
      setDataProduct(data.data);
    }
    fetchProduct();
  }, []);

  if (!auth.success) return <></>;
  return (
    <>
      <h1>Manage Product Page</h1>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
            <th>image</th>
            <th>price</th>
            <th>publish</th>
          </tr>
        </thead>
        <tbody>
          {dataProduct.map((e, i) => (
            <tr key={i}>
              <td>{e.name} </td>
              <td>{e.description} </td>
              <td>{e.price} </td>
              <td>{e.image} </td>

              <td>{e.publish ? "public" : "privat"} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
