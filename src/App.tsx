import { AuthProvider } from './context/AuthContext';
import MainScreen from './components/MainScreen';

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
        <div className="flex-1 overflow-hidden h-full">
          <MainScreen />
        </div>
        <footer className="flex-shrink-0 py-4 text-center text-slate-500 text-[10px] md:text-sm border-t border-slate-200 bg-white">
          Developed by Sir Ameir Daniel
        </footer>
      </div>
    </AuthProvider>
  );
}
