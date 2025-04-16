import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, User2, Activity } from "lucide-react";
import { useContext } from "react";
import { Store } from "@/store/Store";
import Loading from "@/components/ui/Loading";

export default function ProfileCard() {
  const context = useContext(Store);
  if (!context) {
    return <Loading />;
  }

  const { user } = context;

  return (
    <div className="min-h-screen flex items-start justify-center bg-white px-4">
      <Card className="w-full max-w-md border border-red-400 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-500">
            Welcome, {user?.fullname}
          </CardTitle>
          <p className="text-sm text-gray-500">User Dashboard</p>
        </CardHeader>

        <Separator className="bg-red-500 h-[2px]" />

        <CardContent className="space-y-4 mt-4 text-gray-700">
          <div className="flex items-center space-x-3">
            <User2 className="text-red-500" />
            <span className="font-medium">User ID:</span>
            <span>{user?.userId}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="text-red-500" />
            <span className="font-medium">Email:</span>
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center space-x-3">
            <CalendarDays className="text-red-500" />
            <span className="font-medium">Active Since:</span>
            <span>{user?.ActiveSince}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Activity className="text-red-500" />
            <span className="font-medium">Role:</span>
            <Badge className="bg-red-500 text-white">{user?.role}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
