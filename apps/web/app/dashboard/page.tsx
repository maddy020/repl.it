import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DropDownMenuPage from "../_components/DropDownMenu/page";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }
  return (
    <>
      <div>Dashboard Page</div>;
      <DropDownMenuPage session={session} />
    </>
  );
}
