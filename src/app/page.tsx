import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Landing Page</h1>
      <Link href="/chat">Login</Link>
    </>
  );
}
