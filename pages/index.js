import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";


export default function Home() {
  const {data: session} = useSession();

  // console.log(session)
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2> Hello, <b>{session?.user?.name}</b> </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt={session?.user?.name} className="h-7 w-8" />
          <span className="px-2">
          {session?.user?.name} 
          </span>
        </div>
      </div>
    </Layout>
  )
}

