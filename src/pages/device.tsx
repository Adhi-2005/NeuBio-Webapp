import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bluetooth, Battery, Radio, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Device() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <Card className="max-w-md mx-4">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center">
                  <Bluetooth className="w-8 h-8 text-chart-2" />
                </div>
                <div>
                  <Badge className="mb-4">Coming Soon</Badge>
                  <CardTitle className="text-2xl">Gen 2 Hardware</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Advanced Bluetooth connectivity and enhanced features will be available with our Gen 2 device.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Expected Release: Q2 2026</p>
                  <p className="mt-2">Features include:</p>
                  <ul className="mt-2 space-y-1 text-left max-w-xs mx-auto">
                    <li>• Wireless Bluetooth streaming</li>
                    <li>• Extended battery life</li>
                    <li>• Multiple frequency modes</li>
                    <li>• App-based controls</li>
                  </ul>
                </div>
                <Button className="w-full" variant="outline" data-testid="button-notify">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me When Available
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="opacity-40 pointer-events-none space-y-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Device Controls</h1>
              <p className="text-muted-foreground">Manage your hearing device settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bluetooth className="w-5 h-5" />
                    Bluetooth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Connection Status</Label>
                    <Switch disabled />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Not connected
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="w-5 h-5" />
                    Battery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">85%</div>
                  <div className="text-sm text-muted-foreground">
                    Approximately 12 hours remaining
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  Frequency Modes
                </CardTitle>
                <CardDescription>
                  Adjust frequency settings for different environments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Low Frequency</Label>
                    <span className="text-sm text-muted-foreground">50%</span>
                  </div>
                  <Slider defaultValue={[50]} disabled />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Mid Frequency</Label>
                    <span className="text-sm text-muted-foreground">70%</span>
                  </div>
                  <Slider defaultValue={[70]} disabled />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>High Frequency</Label>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Slider defaultValue={[60]} disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
