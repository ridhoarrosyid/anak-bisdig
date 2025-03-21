import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFeedbackForm } from "@/lib/formHandler";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Home() {
  const [feedBackForm, onSubmitFeedBack] = useFeedbackForm();
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("http://localhost:3000/api/products/get3", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
          credentials: "include",
        }).then((res) => res.json());
        console.log(res.data);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProduct();
  }, []);

  // const [user, setUser] = useState(); KEMUNGKINAN TIDAK DIBUTUHKAN

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const res = await fetch("http://localhost:3000/pageauth", {
  //         method: "GET",
  //         headers: { "Content-Type": "Application/json" },
  //         redirect: "follow",
  //         credentials: "include",
  //       }).then((res) => res.json());
  //       setUser(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   verifyToken();
  // });
  return (
    <>
      <nav className="flex items-center justify-between bg-blue-200 px-4 py-2">
        <p className="text-lg font-bold tracking-wider">AnakBisdig</p>
        <Button asChild size="sm">
          <Link to="#">Project</Link>
        </Button>
      </nav>
      <header className="mx-auto flex min-h-[calc(100vh-48px)] flex-col justify-center gap-y-4 px-4">
        <h1 className="text-2xl font-bold">Web Suka-Suka Anak Bisdig</h1>
        <p className="text-md">
          Ambil manfaat dari dari product dan project kami
        </p>
        <div>
          <Button asChild>
            <Link to="#">Project</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="#">Product</Link>
          </Button>
        </div>
      </header>
      <main className="mx-4 flex flex-col gap-y-8">
        <section className="space-y-4">
          <h2 className="text-center text-xl font-semibold">
            Tentang Anak Bisdig
          </h2>
          <p>
            yaa ini hanya project suka suka, meski begitu, kami ingin memberi
            manfaat dari project suka-suka ini.
          </p>
          <div>
            <p>kalo mau Kamu boleh coba project kami yang sudah jadi</p>
            <Button asChild size="sm">
              <Link to="#">Lihat Project</Link>
            </Button>
          </div>
        </section>
        <section>
          <h1>Project Kami</h1>
          <div>
            <Card>
              <CardContent></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </section>
        <section>
          <h1>Product Kami</h1>
          <div>
            <Card>
              <CardContent></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </section>
        <section>
          <h1>Gallery</h1>
          <Carousel>
            <CarouselContent>
              <CarouselItem></CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        <section>
          <h2>Keren dan bermanfaatkan kan???</h2>
          <p>
            kalo iya boleh dong sawerannya untuk memotivasi kami tetap berkarya
          </p>
          <code>#buy a coffee here</code>
          <p>kalo tidak tolong berikan masukan untuk kami kedepannya</p>
          <Form {...feedBackForm}>
            <form onSubmit={feedBackForm.handleSubmit(onSubmitFeedBack)}>
              <FormField
                control={feedBackForm.control}
                name="suggestion"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="menurut saya..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button size="sm" type="submit">
                Kirim Saran
              </Button>
            </form>
          </Form>
        </section>
      </main>
      <footer>
        <p>copyright anakbisdig</p>
      </footer>
    </>
  );
}
