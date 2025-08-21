import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/studentLayout";
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Camera,
  Save,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  country: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailNotifications: boolean;
  courseNotifications: boolean;
  marketingEmails: boolean;
}

export default function EditProfile() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "notifications">(
    "personal"
  );

  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load profile from Firestore
  useEffect(() => {
    if (!uid) return;
    (async () => {
      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        setProfile({
          firstName: "",
          lastName: "",
          email: user.email || "",
          phone: "",
          dateOfBirth: "",
          address: "",
          // city: "",
          country: "",
          bio: "",
          // website: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          emailNotifications: true,
          courseNotifications: true,
          marketingEmails: false,
        });
      }
    })();
  }, [uid, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setProfile((p) => ({
      ...p!,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!uid || !profile) return;
    setIsSaving(true);

    try {
      // 1) Handle password update if on security tab
      if (
        activeTab === "security" &&
        profile.currentPassword &&
        profile.newPassword &&
        profile.confirmPassword
      ) {
        if (profile.newPassword !== profile.confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        const credential = EmailAuthProvider.credential(
          auth.currentUser!.email!,
          profile.currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser!, credential);
        await updatePassword(auth.currentUser!, profile.newPassword);
      }

      // 2) Prepare Firestore data (exclude password fields)
      const {
        currentPassword,
        newPassword,
        confirmPassword,
        ...toSave
      } = profile;

      // 3) Merge into Firestore
      await setDoc(doc(db, "users", uid), toSave, { merge: true });

      // 4) Clear edit state
      setIsEditing(false);
      setProfile((p) =>
        p
          ? {
              ...p,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }
          : p
      );
    } catch (err: any) {
      console.error("Save failed", err);
      window.alert(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <StudentLayout>
        <div className="p-8 text-center">Loading profile…</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-slate-600">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-[100px]"
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </div>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl font-bold">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                      <Camera className="w-4 h-4 text-slate-600" />
                    </button>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-slate-600 text-sm">{profile.email}</p>
                <div className="mt-4 space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    Student Level: Advanced
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Member since {new Date().getFullYear()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6">
              {[
                { id: "personal", label: "Personal", icon: User },
                { id: "security", label: "Security", icon: Shield },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex-1 flex items-center space-x-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                {/* Personal Tab */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          disabled
                          className="w-full px-3 py-2 border rounded-lg bg-slate-100 text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* DOB & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profile.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={profile.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Address & City */}
                    <div className="">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profile.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                        />
                      </div> */}
                    </div>

                    {/* Website
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={profile.website}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                      />
                    </div> */}

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={profile.currentPassword}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 pr-10 border rounded-lg disabled:bg-slate-50"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={profile.newPassword}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profile.confirmPassword}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-50"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    {(
                      [
                        {
                          name: "emailNotifications",
                          label: "Email Notifications",
                          desc: "Receive important updates via email",
                        },
                        {
                          name: "courseNotifications",
                          label: "Course Notifications",
                          desc: "Get notified about course updates",
                        },
                        {
                          name: "marketingEmails",
                          label: "Marketing Emails",
                          desc: "Receive promotional offers",
                        },
                      ] as const
                    ).map(({ name, label, desc }) => (
                      <div
                        key={name}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-slate-900">{label}</h4>
                          <p className="text-sm text-slate-600">{desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          name={name}
                          checked={profile[name]}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-4 h-4 rounded focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
