import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video, Image as ImageIcon, Star } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  date: Date;
  type: "photo" | "video";
  url: string; // In a real app, this would be a URL
  title: string;
}

interface MilestoneItem {
  id: string;
  title: string;
  score: number; // 1-10 or similar
  date: Date;
  notes: string;
}

export default function Milestones() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneScore, setMilestoneScore] = useState("5");
  const [milestoneNotes, setMilestoneNotes] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && date) {
      const type = file.type.startsWith("video") ? "video" : "photo";
      const newItem: MediaItem = {
        id: Math.random().toString(),
        date: date,
        type,
        url: URL.createObjectURL(file), // Temporary URL for preview
        title: file.name
      };
      setMediaItems([...mediaItems, newItem]);
      toast({
        title: "Media Uploaded",
        description: `Successfully added ${file.name} to ${format(date, "PPP")}`,
      });
    }
  };

  const handleAddMilestone = () => {
    if (date && milestoneTitle) {
      const newMilestone: MilestoneItem = {
        id: Math.random().toString(),
        title: milestoneTitle,
        score: parseInt(milestoneScore),
        date: date,
        notes: milestoneNotes
      };
      setMilestones([...milestones, newMilestone]);
      setIsDialogOpen(false);
      setMilestoneTitle("");
      setMilestoneNotes("");
      toast({
        title: "Milestone Added",
        description: "New milestone tracked successfully.",
      });
    }
  };

  const selectedDateMedia = mediaItems.filter(item => date && item.date.toDateString() === date.toDateString());
  const selectedDateMilestones = milestones.filter(item => date && item.date.toDateString() === date.toDateString());

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view or add memories</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Media</CardTitle>
              <CardDescription>Upload photos or videos for {date ? format(date, "PPP") : "selected date"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <ImageIcon className="w-8 h-8 text-primary" />
                  <span>Add Photo</span>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => document.getElementById('video-upload')?.click()}>
                  <Video className="w-8 h-8 text-primary" />
                  <span>Add Video</span>
                  <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {date ? format(date, "PPP") : "Select a date"}
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Track Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Milestone</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Milestone Title</Label>
                    <Input 
                      placeholder="e.g., Said 'Mama' for the first time" 
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Score (1-10)</Label>
                    <Select value={milestoneScore} onValueChange={setMilestoneScore}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea 
                      placeholder="Describe the moment..." 
                      value={milestoneNotes}
                      onChange={(e) => setMilestoneNotes(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddMilestone} className="w-full">Save Milestone</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Milestones List */}
          {selectedDateMilestones.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-chart-5" />
                Milestones
              </h3>
              {selectedDateMilestones.map(milestone => (
                <Card key={milestone.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.notes}</p>
                      </div>
                      <div className="bg-chart-1/20 text-chart-1 px-3 py-1 rounded-full font-bold">
                        {milestone.score}/10
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Media Grid */}
          {selectedDateMedia.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-chart-2" />
                Photos & Videos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedDateMedia.map(item => (
                  <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    {item.type === "photo" ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" controls />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDateMedia.length === 0 && selectedDateMilestones.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No memories or milestones recorded for this date.</p>
              <p className="text-sm">Use the buttons above to add some!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
