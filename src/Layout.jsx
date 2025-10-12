import Navbar from "./Navbar";
export default function Layout({ children }) {
  return (

    <div className="flex flex-col min-h-screen bg-white-200">
      <Navbar />
      <main className="flex-grow pt-[6rem] pb-[12px] overflow-auto" >
          {children}
      </main>
      <footer className="bottom-0 w-full text-center p-4 bg-gray-800 shadow-inner z-50 h-[50px]">
       <p className="text-sm text-gray-200">
  University of Paderborn 
  <span className="mx-2">|</span> 
  Warburger Straße 100, Paderborn, DE 
  <span className="mx-2">|</span> 
  <a
    href="https://www.uni-paderborn.de"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    Website
  </a>
  <span className="mx-2">|</span>
  <a
    href="https://www.uni-paderborn.de/kontakt"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    Contact
  </a>
</p>

      </footer>
    </div>
  );
}
