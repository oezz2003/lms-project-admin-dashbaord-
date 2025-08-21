import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudentLayout from "@/components/studentLayout";
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen,
  Zap,
  BarChart3
} from "lucide-react";

interface ProgressData {
  period: "week" | "month";
  lessonsCompleted: number;
  hoursStudied: number;
  pointsEarned: number;
  streakDays: number;
  coursesStarted: number;
  coursesCompleted: number;
  averageScore: number;
}

const mockProgressData: Record<"week" | "month", ProgressData> = {
  week: {
    period: "week",
    lessonsCompleted: 12,
    hoursStudied: 8.5,
    pointsEarned: 340,
    streakDays: 5,
    coursesStarted: 1,
    coursesCompleted: 0,
    averageScore: 87,
  },
  month: {
    period: "month",
    lessonsCompleted: 45,
    hoursStudied: 32,
    pointsEarned: 1250,
    streakDays: 18,
    coursesStarted: 2,
    coursesCompleted: 1,
    averageScore: 91,
  },
};

const weeklyActivity = [
  { day: "Mon", lessons: 2, hours: 1.5, points: 60 },
  { day: "Tue", lessons: 3, hours: 2.0, points: 85 },
  { day: "Wed", lessons: 1, hours: 0.8, points: 35 },
  { day: "Thu", lessons: 2, hours: 1.2, points: 50 },
  { day: "Fri", lessons: 3, hours: 2.5, points: 90 },
  { day: "Sat", lessons: 1, hours: 0.5, points: 20 },
  { day: "Sun", lessons: 0, hours: 0, points: 0 },
];

const monthlyWeeklyActivity = [
  { week: "Week 1", lessons: 18, hours: 12.5, points: 450 },
  { week: "Week 2", lessons: 15, hours: 10.2, points: 380 },
  { week: "Week 3", lessons: 22, hours: 14.8, points: 520 },
  { week: "Week 4", lessons: 20, hours: 13.1, points: 485 },
];

const recentAchievements = [
  {
    title: "Quick Learner",
    description: "Completed 5 lessons in one day",
    points: 100,
    date: "2 days ago",
    icon: Zap,
  },
  {
    title: "Perfect Score",
    description: "Scored 100% on React Quiz",
    points: 50,
    date: "4 days ago",
    icon: Target,
  },
  {
    title: "Study Streak",
    description: "5 days learning streak",
    points: 75,
    date: "1 week ago",
    icon: Award,
  },
];

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const currentData = mockProgressData[selectedPeriod];

  const currentActivity = selectedPeriod === "week" ? weeklyActivity : monthlyWeeklyActivity;
  const maxLessons = Math.max(...currentActivity.map(d => d.lessons));
  const maxHours = Math.max(...currentActivity.map(d => d.hours));

  return (
    <StudentLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
          <p className="text-slate-600">Track your learning journey and achievements</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === "week" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("week")}
            size="sm"
          >
            This Week
          </Button>
          <Button
            variant={selectedPeriod === "month" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("month")}
            size="sm"
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Lessons Completed</p>
                <p className="text-2xl font-bold text-blue-900">{currentData.lessonsCompleted}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Hours Studied</p>
                <p className="text-2xl font-bold text-green-900">{currentData.hoursStudied}h</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Points Earned</p>
                <p className="text-2xl font-bold text-yellow-900">{currentData.pointsEarned}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Streak Days</p>
                <p className="text-2xl font-bold text-purple-900">{currentData.streakDays}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>{selectedPeriod === "week" ? "Weekly" : "Monthly"} Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentActivity.map((period, index) => {
                const periodKey = selectedPeriod === "week" ? period.day : period.week;
                return (
                  <div key={periodKey} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{periodKey}</span>
                      <div className="flex space-x-4 text-xs text-slate-600">
                        <span>{period.lessons} lessons</span>
                        <span>{period.hours}h</span>
                        <span>{period.points}pts</span>
                      </div>
                    </div>

                    {/* Lessons Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Lessons</span>
                        <span>{period.lessons}/{maxLessons}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(period.lessons / maxLessons) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Hours Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Hours</span>
                        <span>{period.hours}h/{maxHours}h</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(period.hours / maxHours) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Course Progress & Achievements */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Course Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900">{currentData.coursesStarted}</p>
                  <p className="text-sm text-blue-700">Courses Started</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">{currentData.coursesCompleted}</p>
                  <p className="text-sm text-green-700">Courses Completed</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">{currentData.averageScore}%</p>
                <p className="text-sm text-purple-700">Average Quiz Score</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{achievement.title}</h4>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                      <p className="text-xs text-slate-500">{achievement.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">+{achievement.points}</p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Learning Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Weekly Goal: 15 lessons</span>
                <span className="text-sm text-slate-600">{currentData.lessonsCompleted}/15</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((currentData.lessonsCompleted / 15) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Study Time: 10 hours</span>
                <span className="text-sm text-slate-600">{currentData.hoursStudied}/10</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-success h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((currentData.hoursStudied / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Points Target: 500</span>
                <span className="text-sm text-slate-600">{currentData.pointsEarned}/500</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-warning h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((currentData.pointsEarned / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </StudentLayout>
  );
}
