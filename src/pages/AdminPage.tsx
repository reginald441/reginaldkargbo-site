import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, Calendar, Settings, Users, 
  Upload, Trash2, Edit, Save, X, CheckCircle,
  LogOut, Menu,
  RefreshCw, ExternalLink
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
  uploadedAt: string;
}

interface Booking {
  id: string;
  timestamp: number;
  fullTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  paymentStatus: string;
  createdAt: string;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'videos' | 'bookings' | 'content'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Video management
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  // Content editing
  const [heroText, setHeroText] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [savingContent, setSavingContent] = useState(false);

  const ADMIN_PASSWORD = 'Reginald2024!'; // In production, use proper authentication

  useEffect(() => {
    // Load saved data from localStorage
    const savedVideos = localStorage.getItem('admin_videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
    
    const savedHero = localStorage.getItem('content_hero');
    if (savedHero) setHeroText(savedHero);
    
    const savedAbout = localStorage.getItem('content_about');
    if (savedAbout) setAboutText(savedAbout);
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      // In production, this would fetch from your API
      const saved = localStorage.getItem('bookedSlots');
      const timestamps = saved ? JSON.parse(saved) : [];
      
      // Mock bookings for display
      const mockBookings: Booking[] = timestamps.map((ts: number, i: number) => ({
        id: `BK-${i}`,
        timestamp: ts,
        fullTime: new Date(ts).toLocaleString(),
        clientName: 'Client Name',
        clientEmail: 'client@example.com',
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
      }));
      
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoadingBookings(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoFile || !newVideoTitle) return;

    setUploading(true);
    
    // Simulate upload - in production, upload to cloud storage
    const reader = new FileReader();
    reader.onload = () => {
      const newVideo: VideoItem = {
        id: `vid-${Date.now()}`,
        title: newVideoTitle,
        description: newVideoDescription,
        url: reader.result as string,
        thumbnail: '/images/tech-video-thumb.png',
        uploadedAt: new Date().toISOString(),
      };
      
      const updatedVideos = [...videos, newVideo];
      setVideos(updatedVideos);
      localStorage.setItem('admin_videos', JSON.stringify(updatedVideos));
      
      setNewVideoTitle('');
      setNewVideoDescription('');
      setSelectedVideoFile(null);
      setUploading(false);
    };
    reader.readAsDataURL(selectedVideoFile);
  };

  const deleteVideo = (id: string) => {
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem('admin_videos', JSON.stringify(updatedVideos));
  };

  const saveContent = () => {
    setSavingContent(true);
    localStorage.setItem('content_hero', heroText);
    localStorage.setItem('content_about', aboutText);
    setTimeout(() => setSavingContent(false), 500);
  };

  const cancelBooking = (id: string) => {
    const updatedBookings = bookings.filter(b => b.id !== id);
    setBookings(updatedBookings);
    
    // Update localStorage
    const timestamps = updatedBookings.map(b => b.timestamp);
    localStorage.setItem('bookedSlots', JSON.stringify(timestamps));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-reg-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-2xl bg-reg-bg-card border border-reg-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-reg-text mb-2">Admin Login</h1>
            <p className="text-sm text-reg-text-secondary">Enter your password to access the admin panel</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-reg-text-secondary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text focus:border-reg-primary focus:outline-none"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-3">
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-reg-text-secondary hover:text-reg-primary transition-colors">
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reg-bg flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-reg-bg-card border-r border-reg-border transition-all duration-300`}>
        <div className="p-4 border-b border-reg-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && <span className="font-bold text-reg-text">Admin Panel</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5">
              <Menu size={20} className="text-reg-text-secondary" />
            </button>
          </div>
        </div>
        
        <nav className="p-2 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-reg-primary/20 text-reg-primary' : 'text-reg-text-secondary hover:bg-white/5'
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'videos' ? 'bg-reg-primary/20 text-reg-primary' : 'text-reg-text-secondary hover:bg-white/5'
            }`}
          >
            <Video size={20} />
            {sidebarOpen && <span>Videos</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'bookings' ? 'bg-reg-primary/20 text-reg-primary' : 'text-reg-text-secondary hover:bg-white/5'
            }`}
          >
            <Calendar size={20} />
            {sidebarOpen && <span>Bookings</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'content' ? 'bg-reg-primary/20 text-reg-primary' : 'text-reg-text-secondary hover:bg-white/5'
            }`}
          >
            <Edit size={20} />
            {sidebarOpen && <span>Content</span>}
          </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-reg-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-reg-bg/95 backdrop-blur-md border-b border-reg-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-reg-text capitalize">{activeTab}</h1>
            <Link to="/" className="text-sm text-reg-text-secondary hover:text-reg-primary flex items-center gap-1">
              <ExternalLink size={14} />
              View Website
            </Link>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-reg-primary/20 flex items-center justify-center">
                    <Video size={24} className="text-reg-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-reg-text">{videos.length}</div>
                    <div className="text-sm text-reg-text-secondary">Total Videos</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-reg-accent/20 flex items-center justify-center">
                    <Calendar size={24} className="text-reg-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-reg-text">{bookings.length}</div>
                    <div className="text-sm text-reg-text-secondary">Total Bookings</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-reg-text">${bookings.length * 30}</div>
                    <div className="text-sm text-reg-text-secondary">Total Revenue</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="md:col-span-3 p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <h3 className="text-lg font-semibold text-reg-text mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Upload Video
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    View Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Videos */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {/* Upload Form */}
              <div className="p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <h3 className="text-lg font-semibold text-reg-text mb-4">Upload New Video</h3>
                <form onSubmit={handleVideoUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Video Title</label>
                    <input
                      type="text"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text focus:border-reg-primary focus:outline-none"
                      placeholder="Enter video title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Description</label>
                    <textarea
                      value={newVideoDescription}
                      onChange={(e) => setNewVideoDescription(e.target.value)}
                      className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text focus:border-reg-primary focus:outline-none"
                      rows={3}
                      placeholder="Enter video description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Video File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => setSelectedVideoFile(e.target.files?.[0] || null)}
                      className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-reg-primary file:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!selectedVideoFile || !newVideoTitle || uploading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Video
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Video List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="p-4 rounded-xl bg-reg-bg-card border border-reg-border">
                    <div className="aspect-video rounded-lg bg-reg-bg mb-4 overflow-hidden">
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                    <h4 className="font-semibold text-reg-text mb-1">{video.title}</h4>
                    <p className="text-sm text-reg-text-secondary mb-3">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-reg-text-muted">
                        {new Date(video.uploadedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {videos.length === 0 && (
                  <div className="md:col-span-2 p-8 text-center text-reg-text-secondary">
                    <Video size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No videos uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-reg-text">All Bookings</h3>
                <button
                  onClick={fetchBookings}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              </div>
              
              {loadingBookings ? (
                <div className="p-8 text-center text-reg-text-secondary">
                  <RefreshCw size={32} className="mx-auto mb-4 animate-spin" />
                  <p>Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center text-reg-text-secondary">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 rounded-xl bg-reg-bg-card border border-reg-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-reg-text">{booking.clientName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              booking.paymentStatus === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </div>
                          <p className="text-sm text-reg-text-secondary">{booking.clientEmail}</p>
                          <p className="text-sm text-reg-primary mt-1">{booking.fullTime}</p>
                        </div>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <h3 className="text-lg font-semibold text-reg-text mb-4">Edit Website Content</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">Hero Section Text</label>
                    <textarea
                      value={heroText}
                      onChange={(e) => setHeroText(e.target.value)}
                      className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text focus:border-reg-primary focus:outline-none"
                      rows={3}
                      placeholder="Enter hero section text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-reg-text-secondary mb-2">About Section Text</label>
                    <textarea
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full p-3 rounded-lg bg-reg-bg border border-reg-border text-reg-text focus:border-reg-primary focus:outline-none"
                      rows={5}
                      placeholder="Enter about section text"
                    />
                  </div>
                  
                  <button
                    onClick={saveContent}
                    disabled={savingContent}
                    className="btn-primary flex items-center gap-2"
                  >
                    {savingContent ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-reg-bg-card border border-reg-border">
                <h3 className="text-lg font-semibold text-reg-text mb-4">Content Tips</h3>
                <ul className="space-y-2 text-sm text-reg-text-secondary">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-reg-primary mt-0.5" />
                    Keep hero text concise and impactful
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-reg-primary mt-0.5" />
                    About section should highlight your expertise
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-reg-primary mt-0.5" />
                    Update content regularly to keep it fresh
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
