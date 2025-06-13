import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View your schedule and upcoming events</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar />
        </CardContent>
      </Card>
    </div>
  );
}