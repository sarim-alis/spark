
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Award, Github, Linkedin, Globe, Edit3, Save, Eye, Share2, ExternalLink } from 'lucide-react';

export default function Portfolio() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const viewSlug = urlParams.get('view');

  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    loadData();
  }, [viewSlug]);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      let portfolioData;
      if (viewSlug) {
        // Viewing someone else's portfolio
        const portfolios = await base44.entities.Portfolio.filter({ custom_slug: viewSlug });
        if (portfolios.length > 0) {
          portfolioData = portfolios[0];
          setIsOwner(portfolioData.user_email === userData.email);
          
          // Increment view count
          await base44.entities.Portfolio.update(portfolioData.id, {
            view_count: (portfolioData.view_count || 0) + 1
          });
        }
      } else {
        // Viewing own portfolio
        const portfolios = await base44.entities.Portfolio.filter({ user_email: userData.email });
        if (portfolios.length > 0) {
          portfolioData = portfolios[0];
        } else {
          // Create default portfolio
          portfolioData = await base44.entities.Portfolio.create({
            user_email: userData.email,
            display_name: userData.full_name,
            custom_slug: userData.email.split('@')[0],
            theme: 'modern',
            is_public: true
          });
        }
        setIsOwner(true);
      }

      setPortfolio(portfolioData);

      // Load projects from completed enrollments
      const userEnrollments = await base44.entities.Enrollment.filter({ 
        student_email: portfolioData.user_email,
        completion_percentage: 100
      });
      setEnrollments(userEnrollments);

      // Load certificates
      const userCertificates = await base44.entities.Certificate.filter({ 
        student_email: portfolioData.user_email
      });
      setCertificates(userCertificates);

    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    try {
      await base44.entities.Portfolio.update(portfolio.id, portfolio);
      setIsEditing(false);
      alert('Portfolio updated successfully!');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Failed to save portfolio');
    }
  };

  const handleShare = () => {
    const portfolioUrl = `${window.location.origin}${createPageUrl('Portfolio')}?view=${portfolio.custom_slug}`;
    navigator.clipboard.writeText(portfolioUrl);
    alert('Portfolio link copied to clipboard!');
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

  if (!portfolio) {
    return <div className="p-8">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${themes[portfolio.theme]} text-white py-16 px-4`}>
        <div className="max-w-5xl mx-auto">
          {isOwner && (
            <div className="flex justify-end gap-2 mb-4">
              {isEditing ? (
                <Button onClick={handleSave} variant="secondary" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
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
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {portfolio.profile_image ? (
                <img src={portfolio.profile_image} alt={portfolio.display_name} className="w-full h-full object-cover" />
              ) : (
                <Briefcase className="w-16 h-16" />
              )}
            </div>
            <div className="text-center md:text-left">
              {isEditing ? (
                <>
                  <Input
                    value={portfolio.display_name || ''}
                    onChange={(e) => setPortfolio({...portfolio, display_name: e.target.value})}
                    className="text-2xl font-bold mb-2 bg-white/20 border-white/40 text-white"
                    placeholder="Your Name"
                  />
                  <Input
                    value={portfolio.headline || ''}
                    onChange={(e) => setPortfolio({...portfolio, headline: e.target.value})}
                    className="text-lg bg-white/20 border-white/40 text-white"
                    placeholder="Your Professional Headline"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-2">{portfolio.display_name}</h1>
                  <p className="text-xl opacity-90">{portfolio.headline || 'Lifelong Learner'}</p>
                </>
              )}
              
              {portfolio.social_links && (
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {portfolio.social_links.linkedin && (
                    <a href={portfolio.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-5 h-5 opacity-80 hover:opacity-100" />
                    </a>
                  )}
                  {portfolio.social_links.github && (
                    <a href={portfolio.social_links.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5 opacity-80 hover:opacity-100" />
                    </a>
                  )}
                  {portfolio.social_links.website && (
                    <a href={portfolio.social_links.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-5 h-5 opacity-80 hover:opacity-100" />
                    </a>
                  )}
                </div>
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
                  <Textarea
                    value={portfolio.bio || ''}
                    onChange={(e) => setPortfolio({...portfolio, bio: e.target.value})}
                    className="min-h-[100px]"
                    placeholder="Tell employers about yourself..."
                  />
                ) : (
                  <p className="text-sm text-slate-600">{portfolio.bio || 'No bio added yet.'}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills?.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                  {(!portfolio.skills || portfolio.skills.length === 0) && (
                    <p className="text-sm text-slate-500">No skills added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {certificates.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Certificates
                  </h3>
                  <div className="space-y-2">
                    {certificates.map(cert => (
                      <div key={cert.id} className="text-sm">
                        <p className="font-medium text-slate-700">{cert.course_title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(cert.completion_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
