import { useState, useEffect } from "react";
import { userAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, ShieldCheck, Upload } from "lucide-react";
import { message } from "antd";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const userData = JSON.parse(authUser);
          setUser(userData);
        }
        
        const response = await userAPI.getProfile();
        if (response.data.success) {
          setUser(response.data.data);
          localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        message.error('Failed to load profile');
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const updatedData = {name: user.name, bio: user.bio || ""};

      if (profilePictureFile) { 
        updatedData.profile_picture_url = profilePictureFile;
      }
      const response = await userAPI.updateProfile(updatedData);
      
      if (response.data.success) {
        message.success("Admin profile updated successfully!");
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        setUser(response.data.data);
        setProfilePictureFile(null);
        
        window.dispatchEvent(new Event('auth_user_updated'));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.message || "Failed to update profile.");
    }
    
    setIsSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <div className="p-8">Could not load admin profile. Please try again.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-red-600" />
            Admin Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your admin account information.</p>
        </header>
        
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-red-200 shadow-md">
                <AvatarImage src={profilePictureFile ? URL.createObjectURL(profilePictureFile) : user.profile_picture_url} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
                  {user.name?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('admin-profile-picture-upload').click()} 
                  type="button"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                <input 
                  id="admin-profile-picture-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <p className="text-xs text-gray-500">JPG, GIF or PNG. 5MB max.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input 
                  name="name" 
                  value={user.name || ""} 
                  onChange={handleInputChange} 
                  className="mt-1" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input 
                  value={user.email || ""} 
                  readOnly 
                  disabled 
                  className="mt-1 bg-gray-100 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <Input 
                  value={user.role || "admin"} 
                  readOnly 
                  disabled 
                  className="mt-1 bg-red-50 cursor-not-allowed text-red-600 font-semibold" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <Textarea 
                  name="bio" 
                  placeholder="Tell us about yourself" 
                  value={user.bio || ""} 
                  onChange={handleInputChange} 
                  className="mt-1" 
                  rows={4} 
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
              >
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
