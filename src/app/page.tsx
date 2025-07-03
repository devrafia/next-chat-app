import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-1 h-[calc(100vh-64px)]">
          <ContactList />
          <Chat>
            <ChatInput />
          </Chat>
        </div>
      </main>
    </>
  );
}

export function Navbar() {
  return (
    <>
      <header>
        <nav>
          <div className="navbar bg-primary text-primary-content">
            <div className="flex-none">
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
            </div>
            <button className="btn btn-ghost text-xl">Chat App</button>
          </div>
        </nav>
      </header>
    </>
  );
}

export function ContactList() {
  return (
    <>
      <section className="relative flex-1/3 bg-slate-700">
        <ul className="list bg-base-100 rounded-box shadow-md">
          <li className="list-row hover:bg-base-200 active:bg-base-300 cursor-pointer">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
              />
            </div>
            <div>
              <div>Dio Lupa</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Remaining Reason
              </div>
            </div>
          </li>

          <li className="list-row hover:bg-base-200 active:bg-base-300 cursor-pointer">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/4@94.webp"
              />
            </div>
            <div>
              <div>Ellie Beilish</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Bears of a fever
              </div>
            </div>
          </li>

          <li className="list-row hover:bg-base-200 active:bg-base-300 cursor-pointer">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/3@94.webp"
              />
            </div>
            <div>
              <div>Sabrino Gardener</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Cappuccino
              </div>
            </div>
          </li>
        </ul>
        <div className="absolute bottom-0 right-0 bg-primary w-12 h-12 rounded-full flex justify-center items-center cursor-pointer m-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </section>
    </>
  );
}

export function Chat({ children }: any) {
  return (
    <>
      <section className="relative bg-slate-800 w-full p-4 pt-0">
        <div className="container">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              Obi-Wan Kenobi
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">You were the Chosen One!</div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              Anakin
              <time className="text-xs opacity-50">12:46</time>
            </div>
            <div className="chat-bubble">I hate you!</div>
            <div className="chat-footer opacity-50">Seen at 12:46</div>
          </div>
        </div>
        <div className="absolute flex bottom-0 left-0 right-0 w-full bg-slate-800 p-4 gap-2 justify-center items-center">
          <input
            type="text"
            placeholder="Send a Message!"
            className="input input-primary w-full"
          />
          {children}
        </div>
      </section>
    </>
  );
}

export function ChatInput() {
  return (
    <>
      <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </div>
    </>
  );
}
