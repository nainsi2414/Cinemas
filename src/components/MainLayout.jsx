import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
