import axios from "axios";
import { useContext } from "react";
import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import Product from "@/models/Product";
import { Store } from "@/utils/Store";
import db from "@/utils/db";
import { toast } from "react-toastify";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import Image from "next/image";

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (quantity > data.countInStock) {
      return toast.error("Sorry, no more stock left for this product");
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });

    toast.success("Product added to cart");
  };

  return (
    <Layout title={"Home Page"}>
      <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link href={`/product/${product.slug}`} className="flex">
              <Image
                src={product.banner}
                alt={product.name}
                height={400}
                width={1500}
              />
            </Link>
          </div>
        ))}
      </Carousel>
      <h2 className="my-4">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();

  return {
    props: {
      products: products.map(db.convertDocToObj),
      featuredProducts: featuredProducts.map(db.convertDocToObj),
    },
  };
}
