// Imports.
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import portfolioAPI from '@/services/portfolioApi';
import { userAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Award, Github, Edit3, Save, Share2, ExternalLink, Upload, Plus, X } from 'lucide-react';


// Frontend.
export default function Portfolio() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const viewSlug = urlParams.get('view');

  // States.
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Load portfolio data.
  useEffect(() => {
    loadData();
  }, [viewSlug]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const userResponse = await userAPI.getProfile();
      const userData = userResponse.data.data;
      setUser(userData);

      let portfolioData;
      if (viewSlug) {
        // Viewing someone else's portfolio by slug
        const response = await portfolioAPI.getBySlug(viewSlug);
        portfolioData = response.data.data;
        setIsOwner(portfolioData.user_email === userData.email);
      } else {
        // Viewing own portfolio
        const response = await portfolioAPI.getMyPortfolio();
        portfolioData = response.data.data;
        
        if (!portfolioData) {
          // Create default portfolio if none exists
          const createResponse = await portfolioAPI.create({
            user_email: userData.email,
            display_name: userData.name,
            custom_slug: userData.email.split('@')[0],
            theme: 'modern',
            is_public: true,
            featured_projects: [],
            skills: [],
            social_links: {}
          });
          portfolioData = createResponse.data.data;
        }
        setIsOwner(true);
      }

      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setError(error.message || 'Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file change.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  // Handle add skill.
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = portfolio.skills || [];
      setPortfolio({
        ...portfolio,
        skills: [...currentSkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Handle remove skill.
  const handleRemoveSkill = (index) => {
    const currentSkills = portfolio.skills || [];
    setPortfolio({
      ...portfolio,
      skills: currentSkills.filter((_, idx) => idx !== index)
    });
  };

  // Handle skill input key press.
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Handle save.
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    console.log('🔄 Starting save...');
    
    try {
      const updatedData = { ...portfolio };
      
      // Add profile image file if selected
      if (profileImageFile) {
        updatedData.profile_image = profileImageFile;
      }
      
      console.log('📤 Saving portfolio with data:', updatedData);
      const updateResponse = await portfolioAPI.update(portfolio.id, updatedData);
      console.log('✅ Update response:', updateResponse);
      
      // Reload portfolio to get updated image URL
      console.log('🔄 Reloading portfolio...');
      const response = await portfolioAPI.getMyPortfolio();
      console.log('✅ Reload response:', response);
      setPortfolio(response.data.data);
      
      setIsEditing(false);
      setProfileImageFile(null);
      console.log('🎉 Success! Showing toast...');
      toast.success('Portfolio updated successfully!', {
        duration: 4000,
      });
    } catch (error) {
      console.error('❌ Full error object:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      const errors = error.response?.data?.errors;
      if (errors) {
        console.error('❌ Validation errors:', errors);
        const firstError = Object.values(errors)[0][0];
        toast.error(firstError, { duration: 5000 });
      } else {
        toast.error('Failed to save portfolio: ' + errorMsg, { duration: 5000 });
      }
    } finally {
      setIsSaving(false);
      console.log('✅ Save process complete');
    }
  };

  // Handle share.
  const handleShare = () => {
    const portfolioUrl = `${window.location.origin}/portfolio?view=${portfolio.custom_slug}`;
    navigator.clipboard.writeText(portfolioUrl);
    toast.success('Portfolio link copied to clipboard!');
  };

  const themes = {
    modern: 'from-blue-500 to-purple-600',
    minimal: 'from-slate-600 to-slate-800',
    creative: 'from-pink-500 to-orange-500',
    professional: 'from-emerald-600 to-teal-600'
  };

  if (isLoading) {
    return <div className="p-8">Loading portfolio...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!portfolio) {
    return <div className="p-8">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${themes['modern']} text-white py-16 px-4`}>
        <div className="max-w-5xl mx-auto">
          {isOwner && (
            <div className="flex justify-end gap-2 mb-4">
              {isEditing ? (
                <Button onClick={handleSave} variant="secondary" size="sm" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Portfolio
                  </Button>
                  <Button onClick={handleShare} variant="secondary" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {profileImageFile ? (
                  <img src={URL.createObjectURL(profileImageFile)} alt={portfolio.display_name} className="w-full h-full object-cover" />
                ) : portfolio.profile_image ? (
                  <img src={portfolio.profile_image} alt={portfolio.display_name} className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-16 h-16" />
                )}
              </div>
              {isEditing && (
                <div className="mt-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => document.getElementById('portfolio-image-upload').click()} 
                    type="button"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <input 
                    id="portfolio-image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <>
                  <Input value={portfolio.display_name || ''} onChange={(e) => setPortfolio({...portfolio, display_name: e.target.value})} className="text-2xl font-bold mb-2 bg-white/20 border-white/40 text-white" placeholder="Your Name" />
                  <Input value={portfolio.headline || ''} onChange={(e) => setPortfolio({...portfolio, headline: e.target.value})} className="text-lg bg-white/20 border-white/40 text-white" placeholder="Your Professional Headline" />
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-2">{portfolio.display_name || "User"}</h1>
                  <p className="text-xl opacity-90">{portfolio.headline || 'Lifelong Learner'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 -mt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">About</h3>
                {isEditing ? (
                  <Textarea value={portfolio.bio || ''} onChange={(e) => setPortfolio({...portfolio, bio: e.target.value})} className="min-h-[100px]" placeholder="Tell employers about yourself..." />
                ) : (
                  <p className="text-sm text-slate-600">{portfolio.bio || 'No bio added yet.'}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Skills</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={handleSkillKeyPress}
                        placeholder="Add a skill..."
                        className="flex-1"
                      />
                      <Button onClick={handleAddSkill} size="sm" type="button">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1 pr-1">
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(idx)}
                            className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
                            type="button"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {(!portfolio.skills || portfolio.skills.length === 0) && (
                        <p className="text-sm text-slate-500">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills?.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                    {(!portfolio.skills || portfolio.skills.length === 0) && (
                      <p className="text-sm text-slate-500">No skills added yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Featured Projects</h3>
                {portfolio.featured_projects && portfolio.featured_projects.length > 0 ? (
                  <div className="grid gap-4">
                    {portfolio.featured_projects.map((project, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {project.thumbnail && (
                            <img src={project.thumbnail} alt={project.title} className="w-24 h-24 object-cover rounded-lg" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 mb-1">{project.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                            {project.technologies && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {project.technologies.map((tech, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2">
                              {project.live_url && (
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Live Demo
                                  </Button>
                                </a>
                              )}
                              {project.github_url && (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm">
                                    <Github className="w-3 h-3 mr-1" />
                                    Code
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8">No projects added yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Completed Courses</h3>
                <div className="space-y-3">
                  {enrollments.slice(0, 5).map(enrollment => (
                    <div key={enrollment.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Course Completed</p>
                        <p className="text-xs text-slate-500">
                          {new Date(enrollment.updated_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
