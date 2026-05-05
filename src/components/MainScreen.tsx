import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ClassData, PickerType } from '../types';
import Sidebar from './Sidebar';
import ClassEditor from './ClassEditor';
import PickerInterface from './PickerInterface';
import { LogIn, PlusCircle, Users, Settings2, PlayCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MainScreen() {
  const { user, profile, loading, signIn, logout } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [view, setView] = useState<'editor' | 'picker'>('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'classes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClassData[];
      setClasses(classList);
    });

    return unsubscribe;
  }, [user]);

  // Sync selectedClassId if it no longer exists in classes
  useEffect(() => {
    if (selectedClassId) {
      const exists = classes.some(c => c.id === selectedClassId);
      if (!exists) {
        setSelectedClassId(null);
      }
    }
  }, [classes, selectedClassId]);

  const selectedClass = classes.find(c => c.id === selectedClassId) || null;

  const handleAddClass = async () => {
    if (!user || classes.length >= 10) return;
    
    const newClass = {
      userId: user.uid,
      name: 'New Class',
      studentNames: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'classes'), newClass);
    setSelectedClassId(docRef.id);
    setView('editor');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
        >
          <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Name Picker</h1>
          <p className="text-slate-500 mb-8">
            The fun and interactive tool for classroom name selection.
          </p>
          <button 
            onClick={signIn}
            className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-68px)] overflow-hidden">
      <Sidebar 
        classes={classes}
        selectedClassId={selectedClassId}
        onSelectClass={(id) => {
          setSelectedClassId(id);
          // Don't auto-switch view, let user decide or default to current
        }}
        onAddClass={handleAddClass}
        onLogout={logout}
        userProfile={profile}
      />
      
      <main className="flex-1 overflow-auto bg-white relative">
        <AnimatePresence mode="wait">
          {!selectedClass ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center"
            >
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <h2 className="text-xl font-medium text-slate-600">No class selected</h2>
              <p className="max-w-xs">Select a class from the sidebar or create a new one to get started.</p>
              <button 
                onClick={handleAddClass}
                className="mt-6 flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
              >
                <PlusCircle className="w-5 h-5" />
                Add your first class
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key={selectedClassId + view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold">{selectedClass?.name}</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                    {selectedClass?.studentNames.length || 0} Students
                  </p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setView('editor')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'editor' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Settings2 className="w-4 h-4" />
                    Manage
                  </button>
                  <button 
                    onClick={() => setView('picker')}
                    disabled={!selectedClass || selectedClass.studentNames.length === 0}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'picker' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800 disabled:opacity-30'}`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Pick
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {view === 'editor' ? (
                  <ClassEditor classData={selectedClass!} />
                ) : (
                  <PickerInterface classData={selectedClass!} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
