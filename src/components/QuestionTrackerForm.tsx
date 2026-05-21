import { useState, useEffect } from 'react';
import { DailyQuestions } from '../types';
import { Hash, Plus, Calendar, Save, Trash2, CheckCircle } from 'lucide-react';

interface QuestionTrackerFormProps {
  questionsList: DailyQuestions[];
  onSaveQuestions: (record: DailyQuestions) => void;
}

export default function QuestionTrackerForm({ questionsList, onSaveQuestions }: QuestionTrackerFormProps) {
  // Select active date (default is today YYYY-MM-DD)
  const getTodayStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  // Input states - integers
  const [mathNormal, setMathNormal] = useState<number | ''>(0);
  const [physicsNormal, setPhysicsNormal] = useState<number | ''>(0);
  const [chemistryNormal, setChemistryNormal] = useState<number | ''>(0);

  const [mathMain, setMathMain] = useState<number | ''>(0);
  const [mathAdv, setMathAdv] = useState<number | ''>(0);
  const [phyMain, setPhyMain] = useState<number | ''>(0);
  const [phyAdv, setPhyAdv] = useState<number | ''>(0);
  const [chemMain, setChemMain] = useState<number | ''>(0);
  const [chemAdv, setChemAdv] = useState<number | ''>(0);

  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Load existing questions when date changes
  useEffect(() => {
    const record = questionsList.find((q) => q.date === selectedDate);
    if (record) {
      setMathNormal(record.math || 0);
      setPhysicsNormal(record.physics || 0);
      setChemistryNormal(record.chemistry || 0);
      setMathMain(record.math_pyq_main || 0);
      setMathAdv(record.math_pyq_adv || 0);
      setPhyMain(record.physics_pyq_main || 0);
      setPhyAdv(record.physics_pyq_adv || 0);
      setChemMain(record.chemistry_pyq_main || 0);
      setChemAdv(record.chemistry_pyq_adv || 0);
    } else {
      // Clear or reset to 0
      setMathNormal(0);
      setPhysicsNormal(0);
      setChemistryNormal(0);
      setMathMain(0);
      setMathAdv(0);
      setPhyMain(0);
      setPhyAdv(0);
      setChemMain(0);
      setChemAdv(0);
    }
  }, [selectedDate, questionsList]);

  // Calculations
  const parseNum = (val: number | '') => (val === '' ? 0 : val);

  const mathTotal = parseNum(mathNormal) + parseNum(mathMain) + parseNum(mathAdv);
  const physicsTotal = parseNum(physicsNormal) + parseNum(phyMain) + parseNum(phyAdv);
  const chemistryTotal = parseNum(chemistryNormal) + parseNum(chemMain) + parseNum(chemAdv);

  const totalNormal = parseNum(mathNormal) + parseNum(physicsNormal) + parseNum(chemistryNormal);

  const totalMainPYQs = parseNum(mathMain) + parseNum(phyMain) + parseNum(chemMain);
  const totalAdvPYQs = parseNum(mathAdv) + parseNum(phyAdv) + parseNum(chemAdv);
  const totalPYQs = totalMainPYQs + totalAdvPYQs;

  const grandTotal = totalNormal + totalPYQs;

  const handleSave = () => {
    const record: DailyQuestions = {
      date: selectedDate,
      math: parseNum(mathNormal),
      physics: parseNum(physicsNormal),
      chemistry: parseNum(chemistryNormal),
      math_pyq_main: parseNum(mathMain),
      math_pyq_adv: parseNum(mathAdv),
      physics_pyq_main: parseNum(phyMain),
      physics_pyq_adv: parseNum(phyAdv),
      chemistry_pyq_main: parseNum(chemMain),
      chemistry_pyq_adv: parseNum(chemAdv),
    };

    onSaveQuestions(record);
    setSaveSuccessMessage(true);
    setTimeout(() => {
      setSaveSuccessMessage(false);
    }, 3000);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear inputs for this date?')) {
      setMathNormal(0);
      setPhysicsNormal(0);
      setChemistryNormal(0);
      setMathMain(0);
      setMathAdv(0);
      setPhyMain(0);
      setPhyAdv(0);
      setChemMain(0);
      setChemAdv(0);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-sm hover:border-accent/30 active-scale-99 transition-all duration-300">
      
      {/* Date Header Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-5 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold font-sans tracking-tight">Question Solving Logs</h3>
          <p className="text-xs text-muted-foreground">Select a date below to log and persistent track questions solved</p>
        </div>

        <div className="flex items-center gap-2 bg-accent/15 border border-border px-3 py-2 rounded-xl">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-semibold outline-none text-foreground select-none cursor-pointer"
          />
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PHYSICS SECTION */}
        <div className="bg-accent/10 border border-border/80 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3 mb-2">
            <span className="text-sm font-bold text-foreground">Physics Log</span>
            <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded-full">
              {physicsTotal} Qs Done
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">Normal Questions Solved</label>
              <input
                type="number"
                min="0"
                value={physicsNormal}
                onChange={(e) => setPhysicsNormal(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">JEE Main PYQs</label>
                <input
                  type="number"
                  min="0"
                  value={phyMain}
                  onChange={(e) => setPhyMain(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">JEE Adv PYQs</label>
                <input
                  type="number"
                  min="0"
                  value={phyAdv}
                  onChange={(e) => setPhyAdv(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CHEMISTRY SECTION */}
        <div className="bg-accent/10 border border-border/80 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3 mb-2">
            <span className="text-sm font-bold text-foreground">Chemistry Log</span>
            <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              {chemistryTotal} Qs Done
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">Normal Questions Solved</label>
              <input
                type="number"
                min="0"
                value={chemistryNormal}
                onChange={(e) => setChemistryNormal(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">JEE Main PYQs</label>
                <input
                  type="number"
                  min="0"
                  value={chemMain}
                  onChange={(e) => setChemMain(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">JEE Adv PYQs</label>
                <input
                  type="number"
                  min="0"
                  value={chemAdv}
                  onChange={(e) => setChemAdv(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MATHS SECTION */}
        <div className="bg-accent/10 border border-border/80 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3 mb-2">
            <span className="text-sm font-bold text-foreground">Maths Log</span>
            <span className="text-xs font-mono font-bold bg-violet-500/10 text-violet-500 dark:text-violet-400 px-2 py-0.5 rounded-full">
              {mathTotal} Qs Done
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">Normal Questions Solved</label>
              <input
                type="number"
                min="0"
                value={mathNormal}
                onChange={(e) => setMathNormal(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">JEE Main PYQs</label>
                <input
                  type="number"
                  min="0"
                  value={mathMain}
                  onChange={(e) => setMathMain(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-muted-foreground mb-1">JEE Adv PYQs</label>
                <input
                  type="number"
                  min="0"
                  value={mathAdv}
                  onChange={(e) => setMathAdv(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-card border border-border text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Summary Panel */}
      <div className="mt-8 bg-accent/15 border border-border/80 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center sm:text-left">
          <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Normal Total</span>
          <span className="text-xl font-bold font-mono text-indigo-500">{totalNormal}</span>
        </div>

        <div className="text-center sm:text-left border-l border-border/60 pl-0 sm:pl-4">
          <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">JEE Main PYQs</span>
          <span className="text-xl font-bold font-mono text-emerald-500">{totalMainPYQs}</span>
        </div>

        <div className="text-center sm:text-left border-l border-border/60 pl-0 sm:pl-4">
          <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">JEE Advanced PYQs</span>
          <span className="text-xl font-bold font-mono text-amber-500">{totalAdvPYQs}</span>
        </div>

        <div className="text-center sm:text-left border-l border-border/60 pl-0 sm:pl-4">
          <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">GRAND TOTAL</span>
          <span className="text-xl font-bold font-mono text-primary flex items-center justify-center sm:justify-start gap-1">{grandTotal} <span className="text-xs font-normal text-muted-foreground">Qs</span></span>
        </div>
      </div>

      {/* Button Drawer */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="text-xs text-muted-foreground italic">
          {saveSuccessMessage ? (
            <span className="text-emerald-500 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4" /> Save Success! Local IndexedDB synced.
            </span>
          ) : (
            'All updates are saved locally with ultra performance.'
          )}
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleClear}
            className="flex-1 sm:flex-none border border-border bg-accent/20 hover:bg-accent/40 text-muted-foreground hover:text-foreground font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            Clear Inputs
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none bg-primary text-primary-foreground font-semibold text-xs py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-primary/20 hover:opacity-90 active-scale-98 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Today Logs
          </button>
        </div>
      </div>

    </div>
  );
}
