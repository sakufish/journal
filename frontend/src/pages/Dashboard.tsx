import { useState, useEffect } from 'react';
import { SmileIcon, MehIcon, FrownIcon, AngryIcon, LaughIcon } from 'lucide-react';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'sad' | 'extra_happy' | 'extra_sad' |null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [entries, setEntries] = useState<any[]>([]);

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
      case 'happy':
        return <SmileIcon size={size} className="text-gray-400" />;
      case 'neutral':
        return <MehIcon size={size} className="text-gray-400" />;
      case 'sad':
        return <FrownIcon size={size} className="text-gray-400" />;
      case 'extra_sad':
        return <AngryIcon size={size} className="text-gray-400" />;
      case 'extra_happy':
        return <LaughIcon size={size} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!currentMood || !currentNote.trim()) {
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/diary/add-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                dailyMood: currentMood,
                notes: currentNote,
                tags: {}
            }),
        });

        if (response.ok) {
            fetchDiaryEntries(username);
            setCurrentMood(null);
            setCurrentNote('');
        } else {
            console.error('Failed to save entry');
        }
    } catch (error) {
        console.error('Error saving entry:', error);
    }
};

  return (
    <div className="fixed inset-0 w-full h-full bg-white p-8">
      <div className="mb-8">
        <p className="text-xs text-gray-400">you are {username}</p>
        <h1 className="text-sm text-gray-600 mt-1">journal</h1>
      </div>

      <div className="mb-12 border-b border-gray-100 pb-8">
        <div className="flex gap-4 mb-4">
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
        <div className="relative">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="how was your day..."
            className="w-full text-xs text-gray-600 px-0 py-2 border-b border-gray-100 focus:outline-none focus:border-gray-200 resize-none bg-transparent"
            style={{ minHeight: '2.5rem' }}
          />
          <button 
            onClick={handleSubmit}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2"
          >
            save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {entries.length > 0 ? entries.map((entry, index) => (
          <div key={index} className="flex gap-3">
            <MoodIcon mood={entry.dailyMood} />
            <div className="space-y-2">
              <p className="text-xs text-gray-400">{new Date(entry.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-gray-600">{entry.notes}</p>
            </div>
          </div>
        )) : (
          <p className="text-xs text-gray-600">No diary entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
