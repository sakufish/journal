import { useState, useEffect } from 'react';
import { 
  SmileIcon, MehIcon, FrownIcon, AngryIcon, LaughIcon,
  UtensilsIcon, FootprintsIcon, UsersIcon, DumbbellIcon, 
  BriefcaseIcon
} from 'lucide-react';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'sad' | 'extra_happy' | 'extra_sad' | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [tags, setTags] = useState({
    eat: 'moderate',
    walk: false,
    familyTime: false,
    exercise: 'low',
    work: 'neutral'
  });

  useEffect(() => {
    const storedUsername = document.cookie
      .split('; ')
      .find(row => row.startsWith('username='));

    if (storedUsername) {
      const user = storedUsername.split('=')[1];
      setUsername(user);
      fetchDiaryEntries(user);
    }
  }, []);

  const fetchDiaryEntries = async (user: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/diary/entries/${user}`);
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

  const MoodIcon = ({ mood, size = 16 }: { mood: string, size?: number }) => {
    switch (mood) {
      case 'happy': return <SmileIcon size={size} className="text-gray-400" />;
      case 'neutral': return <MehIcon size={size} className="text-gray-400" />;
      case 'sad': return <FrownIcon size={size} className="text-gray-400" />;
      case 'extra_sad': return <AngryIcon size={size} className="text-gray-400" />;
      case 'extra_happy': return <LaughIcon size={size} className="text-gray-400" />;
      default: return null;
    }
  };

  const handleLogOut = () => {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    window.location.href = '/';
  };

  const handleSubmit = async () => {
    if (!currentMood || !currentNote.trim()) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/diary/add-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          dailyMood: currentMood,
          notes: currentNote,
          tags
        }),
      });

      if (response.ok) {
        fetchDiaryEntries(username);
        setCurrentMood(null);
        setCurrentNote('');
        setTags({
          eat: 'moderate',
          walk: false,
          familyTime: false,
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
      <div className="flex justify-between items-center p-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <p className="text-xs text-gray-400">you are {username}</p>
          <h1 className="text-sm text-gray-600">journal</h1>
        </div>
        <span
          onClick={handleLogOut}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          log out
        </span>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-1/2 p-8 border-r border-gray-100">
          <div className="space-y-8">
            <div className="flex gap-4">
              {(['extra_sad','sad', 'neutral', 'happy', 'extra_happy'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${currentMood === mood ? 'bg-gray-50' : ''}`}
                >
                  <MoodIcon mood={mood} size={20} />
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="how was your day..."
                className="w-full text-xs text-gray-600 px-0 py-2 border-b border-gray-100 focus:outline-none focus:border-gray-200 resize-none bg-transparent"
                style={{ minHeight: '2.5rem' }}
              />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <UtensilsIcon size={16} className="text-gray-400" />
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
                  <FootprintsIcon size={16} className="text-gray-400" />
                  <label className="text-xs text-gray-600 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tags.walk}
                      onChange={(e) => setTags({...tags, walk: e.target.checked})}
                      className="form-checkbox h-3 w-3 text-gray-400"
                    />
                    went for a walk
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <UsersIcon size={16} className="text-gray-400" />
                  <label className="text-xs text-gray-600 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tags.familyTime}
                      onChange={(e) => setTags({...tags, familyTime: e.target.checked})}
                      className="form-checkbox h-3 w-3 text-gray-400"
                    />
                    spent time with family
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <DumbbellIcon size={16} className="text-gray-400" />
                  <select
                    value={tags.exercise}
                    onChange={(e) => setTags({...tags, exercise: e.target.value})}
                    className="text-xs text-gray-600 bg-transparent border-none focus:outline-none"
                  >
                    <option value="low">light exercise</option>
                    <option value="medium">moderate exercise</option>
                    <option value="high">intense exercise</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <BriefcaseIcon size={16} className="text-gray-400" />
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

              <button 
                onClick={handleSubmit}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                save
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-8 space-y-6 overflow-y-auto">
          {entries.length > 0 ? entries.map((entry, index) => (
            <div key={index} className="space-y-3">
              <div className="flex gap-3 items-center">
                <MoodIcon mood={entry.dailyMood} />
                <p className="text-xs text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-gray-600 ml-7">{entry.notes}</p>
              <div className="flex gap-2 ml-7">
                {entry.tags.eat !== 'moderate' && (
                  <UtensilsIcon size={12} className="text-gray-400" />
                )}
                {entry.tags.walk && (
                  <FootprintsIcon size={12} className="text-gray-400" />
                )}
                {entry.tags.familyTime && (
                  <UsersIcon size={12} className="text-gray-400" />
                )}
                {entry.tags.exercise !== 'low' && (
                  <DumbbellIcon size={12} className="text-gray-400" />
                )}
                {entry.tags.work !== 'neutral' && (
                  <BriefcaseIcon size={12} className="text-gray-400" />
                )}
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
