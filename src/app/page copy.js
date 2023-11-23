"use client";
import useSWR from "swr";
import Product from "@/components/Product";
import axios from 'axios';

const fetcher = url => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data, error } = useSWR('/api/product', fetcher);

  if (error) return <main>Failed to load</main>
  if (!data) return <main>Loading...</main>

  return (
    <main className="p-10 mx-auto max-w-4xl">
      <h1 className="text-6xl font-bold mb-4 text-center">Next.js Starter</h1>
      <p className="mb-20 text-xl text-center">
        🔥 Shop from the hottest items in the world 🔥
      </p>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
        {data.products.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </main>
  );
}
