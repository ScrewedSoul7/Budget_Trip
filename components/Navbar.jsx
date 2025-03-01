import Link from "next/link"
import LoginButton from "./loginButton";

export default function Navbar() {
  return (
    <nav className="bg-cyan-400 border-b border-cyan-500 text-[#1E3A5F]">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link href="/" className="flex flex-shrink-0 items-center mr-4">
            <img src="/icon.png" alt="Site Icon" className="h-10 w-auto" />
              <span className="hidden md:block text-2xl font-bold ml-2">
                Budget Travel
              </span>
            </Link>
          </div>
          <div className="md:ml-auto">
            <div className="flex">
              <Link href="/" className="font-bold hover:bg-[#008B9E] px-4 h-20 flex items-center justify-center transition">
                Home
              </Link>
              <Link href="/about" className="font-bold hover:bg-[#008B9E] px-4 h-20 flex items-center justify-center transition">
                About
              </Link>
              <LoginButton className="items-right justify-right hover:cursor-pointer"/>
            </div>
          </div>
        </div>
      </div>
    </nav>    
  );
}
