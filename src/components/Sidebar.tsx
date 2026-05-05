import React from 'react';
import { ClassData, UserProfile } from '../types';
import { Plus, Users, LogOut, GraduationCap, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  classes: ClassData[];
  selectedClassId: string | null;
  onSelectClass: (id: string) => void;
  onAddClass: () => void;
  onLogout: () => void;
  userProfile: UserProfile | null;
  onClose?: () => void;
}

export default function Sidebar({ 
  classes, 
  selectedClassId, 
  onSelectClass, 
  onAddClass, 
  onLogout,
  userProfile,
  onClose
}: SidebarProps) {
  return (
    <aside className="w-[280px] md:w-72 border-r border-slate-200 bg-white flex flex-col h-full shadow-2xl md:shadow-none">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Name Picker</h1>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Classes</h3>
          {classes.length < 10 && (
            <button 
              onClick={onAddClass}
              className="p-1 hover:bg-slate-100 rounded-md text-indigo-600 transition-colors"
              title="Add Class"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto no-scrollbar">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all ${
                selectedClassId === cls.id 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${selectedClassId === cls.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-sm font-medium truncate max-w-[140px]">{cls.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedClassId === cls.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
          {classes.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">No classes yet</p>
          )}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 space-y-4">
        {userProfile && (
          <div className="flex items-center gap-3">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                {userProfile.displayName?.charAt(0) || userProfile.email?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{userProfile.displayName || 'Teacher'}</p>
              <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
            </div>
          </div>
        )}
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 w-full p-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
