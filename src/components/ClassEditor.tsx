import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ClassData } from '../types';
import { Plus, Trash2, Save, FileText, X, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassEditorProps {
  classData: ClassData;
}

export default function ClassEditor({ classData }: ClassEditorProps) {
  const [name, setName] = useState(classData.name);
  const [names, setNames] = useState<string[]>(classData.studentNames);
  const [bulkInput, setBulkInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isSaving) {
      setName(classData.name);
      setNames(classData.studentNames);
    }
  }, [classData, isSaving]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalNames = [...names];
      
      // Auto-add any names in bulk input before saving
      if (bulkInput.trim()) {
        const lines = bulkInput.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');
        finalNames = [...finalNames, ...lines].slice(0, 200);
        setNames(finalNames);
        setBulkInput('');
      }

      await updateDoc(doc(db, 'classes', classData.id), {
        name: name.trim() || 'Untitled Class',
        studentNames: finalNames.filter(n => n.trim() !== ''),
        updatedAt: serverTimestamp(),
      });
      setLastSaved(new Date());
      setTimeout(() => setLastSaved(null), 3000);
    } catch (error) {
      console.error('Error saving class:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    const combined = [...names, ...lines].slice(0, 200);
    setNames(combined);
    setBulkInput('');
  };

  const confirmDeleteClass = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'classes', classData.id));
      // MainScreen sync effect will handle setting selectedClassId to null
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32">
      {/* Class Name Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Class Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full placeholder-slate-300"
            placeholder="Class Name..."
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
          >
            {isSaving ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Delete Class"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full text-center">
              <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete this class?</h3>
              <p className="text-slate-500 mb-8 text-sm">
                This action cannot be undone. All student names in this class will be removed.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDeleteClass}
                  disabled={isDeleting}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2Icon className="w-4 h-4 animate-spin" />}
                  Delete Class
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Add Students
          </h3>
          <p className="text-sm text-slate-500 mb-4">Paste or type names here, one per line. They will be added to the list below.</p>
          <textarea 
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="w-full flex-1 min-h-[300px] p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none"
            placeholder="Ameir&#10;Daniel&#10;Adha..."
          />
          <button 
            onClick={handleBulkAdd}
            disabled={!bulkInput.trim()}
            className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            Add Names to List
          </button>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Students List
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              {names.length}/200
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
            {names.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-4">
                <AlertTriangle className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">No students added to this class yet.</p>
              </div>
            ) : (
              names.map((n, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between group bg-slate-50 p-3 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50 transition-all"
                >
                  <input 
                    type="text" 
                    value={n}
                    onChange={(e) => {
                      const newNames = [...names];
                      newNames[i] = e.target.value;
                      setNames(newNames);
                    }}
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium w-full"
                  />
                  <button 
                    onClick={() => removeName(i)}
                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
