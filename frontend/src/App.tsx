import { useEffect } from "react";
import { AppRouter } from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/useAuthStore";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-brand-blue flex items-center justify-center'>
        <div className='animate-bounce text-white font-black text-2xl uppercase tracking-widest'>
          Mediary
        </div>
      </div>
    );
  }

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
