import { useState, useEffect } from 'react';
import { 
  SmileIcon, MehIcon, FrownIcon, AngryIcon, LaughIcon,
  UtensilsIcon, SaladIcon, CakeSlice, 
  Dumbbell, Timer, Sofa,
  BriefcaseIcon, Brain, Coffee
} from 'lucide-react';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'sad' | 'extra_happy' | 'extra_sad' | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [tags, setTags] = useState({
    eat: 'moderate',
    exercise: 'low',
    work: 'neutral'
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
      window.location.href = '/';
      return;
    }

    const storedUsername = document.cookie
      .split('; ')
      .find(row => row.startsWith('username='));

    if (storedUsername) {
      const user = storedUsername.split('=')[1];
      setUsername(user);
      fetchDiaryEntries(user, token); 
    }
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).toLowerCase();
  };

  const fetchDiaryEntries = async (user: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/diary/entries/${user}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(Array.isArray(data) ? data : []);
      } else {
        setEntries([]);
      }
    } catch (error) {
      setEntries([]);
    }
  };

  const EatingIcon = ({ type, size = 16 }: { type: string, size?: number }) => {
    switch (type) {
      case 'healthy': return <SaladIcon size={size} className="text-gray-400" />;
      case 'unhealthy': return <CakeSlice size={size} className="text-gray-400" />;
      default: return <UtensilsIcon size={size} className="text-gray-400" />;
    }
  };

  const ExerciseIcon = ({ level, size = 16 }: { level: string, size?: number }) => {
    switch (level) {
      case 'high': return <Dumbbell size={size} className="text-gray-400" />;
      case 'medium': return <Timer size={size} className="text-gray-400" />;
      default: return <Sofa size={size} className="text-gray-400" />;
    }
  };

  const WorkIcon = ({ status, size = 16 }: { status: string, size?: number }) => {
    switch (status) {
      case 'productive': return <Brain size={size} className="text-gray-400" />;
      case 'unproductive': return <Coffee size={size} className="text-gray-400" />;
      default: return <BriefcaseIcon size={size} className="text-gray-400" />;
    }
  };

  const MoodIcon = ({ mood, size = 16, isSelected = false }: { mood: string, size?: number, isSelected?: boolean }) => {
    const colorClass = isSelected ? "text-gray-600" : "text-gray-400";
    switch (mood) {
      case 'happy': return <SmileIcon size={size} className={colorClass} />;
      case 'neutral': return <MehIcon size={size} className={colorClass} />;
      case 'sad': return <FrownIcon size={size} className={colorClass} />;
      case 'extra_sad': return <AngryIcon size={size} className={colorClass} />;
      case 'extra_happy': return <LaughIcon size={size} className={colorClass} />;
      default: return null;
    }
  };

  const handleLogOut = () => {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    localStorage.removeItem('authToken'); 
    window.location.href = '/'; 
  };

  const handleSubmit = async () => {
    if (!currentMood || !currentNote.trim()) return;

    const token = localStorage.getItem('authToken'); 
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/diary/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          username,
          dailyMood: currentMood,
          notes: currentNote,
          tags
        }),
      });

      if (response.ok) {
        fetchDiaryEntries(username, token);
        setCurrentMood(null);
        setCurrentNote('');
        setTags({
          eat: 'moderate',
          exercise: 'low',
          work: 'neutral'
        });
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-white">
      <div className="flex flex-col p-8 border-b border-gray-100">
        <p className="text-xs text-gray-400">you are {username}</p>
        <h1 className="text-sm text-gray-600 mt-2">journal</h1>
        <span
          onClick={handleLogOut}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors absolute top-8 right-8"
        >
          log out
        </span>
      </div>

      <div className="flex h-[calc(100vh-6rem)]">
        <div className="w-1/2 p-8 border-r border-gray-100">
          <div className="space-y-8">
            <div className="flex gap-4">
              {(['extra_sad','sad', 'neutral', 'happy', 'extra_happy'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${currentMood === mood ? 'bg-gray-50' : ''}`}
                >
                  <MoodIcon mood={mood} size={20} isSelected={currentMood === mood} />
                </button>
              ))}
            </div>

            <div className="space-y-8">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="how was your day..."
                className="w-full text-xs text-gray-600 px-0 py-2 border-b border-gray-100 focus:outline-none focus:border-gray-200 resize-none bg-transparent"
                style={{ minHeight: '2.5rem' }}
              />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <EatingIcon type={tags.eat} />
                  <select
                    value={tags.eat}
                    onChange={(e) => setTags({...tags, eat: e.target.value})}
                    className="text-xs text-gray-600 bg-transparent border-none focus:outline-none"
                  >
                    <option value="moderate">moderate eating</option>
                    <option value="healthy">healthy eating</option>
                    <option value="unhealthy">unhealthy eating</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <ExerciseIcon level={tags.exercise} />
                  <select
                    value={tags.exercise}
                    onChange={(e) => setTags({...tags, exercise: e.target.value})}
                    className="text-xs text-gray-600 bg-transparent border-none focus:outline-none"
                  >
                    <option value="low">no exercise</option>
                    <option value="medium">moderate exercise</option>
                    <option value="high">intense exercise</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <WorkIcon status={tags.work} />
                  <select
                    value={tags.work}
                    onChange={(e) => setTags({...tags, work: e.target.value})}
                    className="text-xs text-gray-600 bg-transparent border-none focus:outline-none"
                  >
                    <option value="neutral">normal work day</option>
                    <option value="productive">productive day</option>
                    <option value="unproductive">unproductive day</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <span 
                  onClick={handleSubmit}
                  className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  save
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-8 space-y-6 overflow-y-auto">
          {entries.length > 0 ? entries.map((entry, index) => (
            <div key={index} className="space-y-3">
              <div className="flex gap-3 items-center">
                <MoodIcon mood={entry.dailyMood} />
                <p className="text-xs text-gray-400">
                  {formatDate(entry.createdAt)}
                </p>
              </div>
              <p className="text-xs text-gray-600 ml-7">{entry.notes}</p>
              <div className="flex gap-2 ml-7">
                <EatingIcon type={entry.tags.eat} size={12} />
                <ExerciseIcon level={entry.tags.exercise} size={12} />
                <WorkIcon status={entry.tags.work} size={12} />
              </div>
            </div>
          )) : (
            <p className="text-xs text-gray-600">no diary entries yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
