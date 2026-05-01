import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <main className="max-w-[960px] mx-auto px-4 sm:px-8 pb-16">
            <Header />
            <Outlet />
        </main>
    );
}
