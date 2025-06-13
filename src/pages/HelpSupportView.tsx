import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HelpSupportView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Help & Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Documentation & Resources</CardTitle>
          <CardDescription>Find answers and get assistance with Granite Flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn the basics of using Granite Flow
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">User Guide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed documentation for all features
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get help from our support team
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">FAQ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Frequently asked questions and answers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}