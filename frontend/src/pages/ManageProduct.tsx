import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

export default function ManageProduct() {
  //   const [dataProduct, setDataProduct] = useState([]);
  //   const [auth, setAuth] = useState({});
  const navigate = useNavigate();
  const [cookies, removeCookies] = useCookies();
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) navigate("/login");
      const ress = await fetch("http://localhost:3000/pageauth", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        credentials: "include",
      }).then((res) => res.json());
    };

    verifyCookie();
  }, []);
  //   useEffect(() => {
  //     async function fetchProduct() {
  //       const data = await fetch("");
  //     }
  //   });
  return (
    <>
      <h1>Manage Product Page</h1>
    </>
  );
}
