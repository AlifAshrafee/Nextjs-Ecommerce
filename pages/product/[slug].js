import React, { useContext } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Store } from "@/utils/Store";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import db from "@/utils/db";
import Product from "@/models/Product";
import axios from "axios";
import { toast } from "react-toastify";

function ProductPage({ product }) {
  const { state, dispatch } = useContext(Store);

  if (!product)
    return <Layout title="Product Not Found">Product Not Found</Layout>;

  const addToCartHandler = async () => {
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
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">
          <div className="flex flex-row align-middle">
            <ArrowUturnLeftIcon title="Back to homepage" className="h-5 w-5" />
            <span className="pl-2">Back to homepage</span>
          </div>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
