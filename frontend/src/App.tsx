import { AppRouter } from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className='min-h-screen bg-gray-50 flex justify-center font-sans'>
        <div className='w-full max-w-md bg-white min-h-screen shadow-lg overflow-x-hidden relative'>
          <AppRouter />
        </div>
      </div>
      <ToastContainer position='top-center' />
    </>
  );
}

export default App;
