import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col justify-between bg-white text-gray-800">
        <section className="text-center py-20 px-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Konvo</h1>
          <p className="text-xl mb-6">
            Your secure and instant messaging platform.
          </p>
          <a
            href="/chat"
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition"
          >
            Get Started
          </a>
        </section>
        <section className="py-16 px-8 md:px-20 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">Why Konvo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">
                Real-time Messaging
              </h3>
              <p>
                Chat with your friends instantly using our blazing-fast
                real-time system.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">
                End-to-End Encryption
              </h3>
              <p>
                Your messages are encrypted and private. Only you and your
                friend can read them.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">
                Multi-device Access
              </h3>
              <p>
                Use Konvo on mobile, tablet, or desktop. Everything stays in
                sync.
              </p>
            </div>
          </div>
        </section>
        <footer className="text-center text-sm py-6 bg-gray-200">
          © {new Date().getFullYear()} Konvo. Built with ❤️ using Next.js.
        </footer>
      </main>
    </>
  );
}
