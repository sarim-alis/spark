import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, User as UserIcon, Upload } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
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
    
    let updatedData = {
      full_name: user.full_name,
      bio: user.bio || "",
    };

    try {
      if (profilePictureFile) {
        const { file_url } = await UploadFile({ file: profilePictureFile });
        updatedData.profile_picture_url = file_url;
      }

      await User.updateMyUserData(updatedData);
      alert("Profile updated successfully!");
      window.location.reload(); // Reload to reflect changes across the app
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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
                <AvatarFallback className="text-2xl">{user.full_name?.[0]}</AvatarFallback>
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
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input
                  name="full_name"
                  value={user.full_name || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input
                  value={user.email || ""}
                  disabled
                  className="mt-1 bg-slate-100"
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