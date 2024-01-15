import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignIn from "@/components/auth/auth.signin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import "@/styles/app.styles.scss";

export default async function page() {
  const session = await getServerSession(authOptions)
  if(session){
    redirect("/")
  }
  return (
    <>
      <SignIn />
    </>
  );
}
