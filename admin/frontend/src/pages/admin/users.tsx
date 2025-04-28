import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const users = Array(8).fill({
  id: "0001",
  name: "Amila Perera",
  contact: "011-1234567",
});

export default function UsersList() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <ChevronLeft className="mr-1 h-5 w-5" />
            <h1 className="text-3xl font-bold text-[#1a3a54]">Users</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 font-semibold text-lg px-4 py-2">
              <div>Student Id</div>
              <div>User Name</div>
              <div>Contact</div>
            </div>

            {users.map(
              (
                user: {
                  id:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  contact:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                },
                index: Key | null | undefined
              ) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center bg-[#d6e6f0] rounded-md px-4 py-3 mb-2"
                >
                  <div>{user.id}</div>
                  <div>{user.name}</div>
                  <div className="flex justify-between items-center">
                    {user.contact}
                    <Link to={"/studentDetails"}>
                      <button className="bg-white rounded-full p-2 hover:bg-gray-100">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
