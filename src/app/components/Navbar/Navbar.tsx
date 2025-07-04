import { Children } from "react";

export default function Navbar({ children }: any) {
  return (
    <>
      <header>
        <nav>
          <div className="navbar bg-primary text-primary-content">
            <div className="flex justify-between w-full">
              <div>
                <button className="btn btn-square btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>{" "}
                  </svg>
                </button>
                <button className="btn btn-ghost text-xl">Chat App</button>
              </div>
              {children}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
