import { redirect } from "react-router-dom";

export function CheckAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }

  return null;
}
