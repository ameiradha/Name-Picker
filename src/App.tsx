import { AuthProvider } from './context/AuthContext';
import MainScreen from './components/MainScreen';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <MainScreen />
        <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 mt-auto">
          Developed by Sir Ameir Daniel
        </footer>
      </div>
    </AuthProvider>
  );
}
