import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { ContactMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function AdminMessages() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  
  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
    enabled: isAdmin,
  });

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    if (search === "") return true;
    
    return (
      message.name.toLowerCase().includes(search.toLowerCase()) ||
      message.email.toLowerCase().includes(search.toLowerCase()) ||
      message.subject.toLowerCase().includes(search.toLowerCase()) ||
      message.message.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Toggle message expansion
  const toggleMessageExpansion = (id: number) => {
    if (expandedMessageId === id) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(id);
    }
  };

  // Format date
  const formatMessageDate = (date: Date | null) => {
    if (!date) return "Unknown date";
    return format(new Date(date), "PPP");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-800">Contact Messages</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No messages found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map((message) => (
            <Card key={message.id} className={expandedMessageId === message.id ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{message.subject}</CardTitle>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatMessageDate(message.createdAt)}
                  </div>
                </div>
                <CardDescription className="flex justify-between items-center">
                  <span>From: {message.name} ({message.email})</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleMessageExpansion(message.id)}
                  >
                    {expandedMessageId === message.id ? "Collapse" : "Expand"}
                  </Button>
                </CardDescription>
              </CardHeader>
              {expandedMessageId === message.id && (
                <>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="whitespace-pre-line">{message.message}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="ml-auto">
                      <a href={`mailto:${message.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Reply via Email
                      </a>
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}