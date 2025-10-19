// Imports.
import { useState, useEffect } from "react";
import { userAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, User as UserIcon, Upload } from "lucide-react";
import { message } from "antd";


// Frontend.
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Fetch user from localStorage and API.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get user from localStorage first
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const userData = JSON.parse(authUser);
          setUser(userData);
        }
        
        // Then fetch from API to get latest data
        const response = await userAPI.getProfile();
        if (response.data.success) {
          setUser(response.data.data);
          // Update localStorage
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

  // Handle file change.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  // Handle save.
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const updatedData = {
        name: user.name,
        bio: user.bio || "",
      };

      // Add profile picture file if selected
      if (profilePictureFile) {
        updatedData.profile_picture_url = profilePictureFile;
      }

      const response = await userAPI.updateProfile(updatedData);
      
      if (response.data.success) {
        message.success("Profile updated successfully!");
        // Update localStorage with new data
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        setUser(response.data.data);
        setProfilePictureFile(null);
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
    return <div className="p-8">Loading...</div>;
  }
  
  if (!user) {
    return <div className="p-8">Could not load user profile. Please try again.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-blue-500" />
            My Profile
          </h1>
          <p className="text-slate-600 mt-1">Manage your personal information.</p>
        </header>
        
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-md">
                <AvatarImage src={profilePictureFile ? URL.createObjectURL(profilePictureFile) : user.profile_picture_url} />
                <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <label htmlFor="profile-picture-upload" className="cursor-pointer">
                  <Button as="span" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </label>
                <input id="profile-picture-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <Input
                  name="name"
                  value={user.name || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input
                  value={user.email || ""}
                  readOnly
                  disabled
                  className="mt-1 bg-slate-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Your Bio</label>
                <Textarea
                  name="bio"
                  placeholder="Tell us a little about yourself"
                  value={user.bio || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}