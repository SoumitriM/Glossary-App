// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "./Navbar"; 
import Navbar from "./Navbar";
// import CustomToastContainer from "./CustomToastContainer";
export default function Layout({ children }) {
  return (

    <div className="flex flex-col min-h-screen bg-white-200">
      <Navbar />
      <main className="flex-grow pt-[8rem] pb-[12px] overflow-auto" >
          {children}
        {/* <CustomToastContainer position="top-center" /> */}
      </main>

      {/* Fixed Footer */}
      <footer className="bottom-0 w-full text-center p-4 bg-gray-800 shadow-inner z-50 h-[50px]">
        <p className="text-sm text-gray-200">
          University of Paderborn | Warburger Straße 100, Paderborn, DE | https://www.uni-paderborn.de/
        </p>
      </footer>
    </div>
  );
}
