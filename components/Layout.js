import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";
import { Store } from "@/utils/Store";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Layout({ title, children }) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/" });
  };

  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - Amazona" : "Amazona"}</title>
        <meta name="description" content="Ecommerce Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-right" limit={1} />
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center justify-between shadow-md">
            <Link href="/" className="text-lg font-bold pl-4">
              Amazona
            </Link>
            <form
              onSubmit={submitHandler}
              className="mx-auto hidden justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cartItemsCount > 0 ? (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                ) : null}
              </Link>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="text-blue-600 pr-4">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute top-9 right-0 w-56 origin-top-right bg-white shadow-lg">
                    <Menu.Item>
                      <DropdownLink href="/profile" className="dropdown-link">
                        <span className="px-2">Profile</span>
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        href="/order-history"
                        className="dropdown-link"
                      >
                        <span className="px-2">Order History</span>
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin ? (
                      <Menu.Item>
                        <DropdownLink
                          href="/admin/dashboard"
                          className="dropdown-link"
                        >
                          <span className="px-2">Admin Dashboard</span>
                        </DropdownLink>
                      </Menu.Item>
                    ) : null}
                    <Menu.Item>
                      <DropdownLink
                        href="#"
                        className="dropdown-link"
                        onClick={logoutClickHandler}
                      >
                        <span className="px-2">Logout</span>
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2 pr-4">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          Copyright © 2023 Alif Ashrafee
        </footer>
      </div>
    </>
  );
}

export default Layout;
