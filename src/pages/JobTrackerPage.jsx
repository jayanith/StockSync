
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Edit3, Trash2, ChevronDown, CheckCircle, XCircle, Award, FolderOpen, ClipboardList } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const JobTrackerPage = () => {
  const [trackedJobs, setTrackedJobs] = useState([]);
  const { toast } = useToast();

  const jobStatuses = ["Applied", "Interviewing", "Offer Received", "Rejected", "Archived"];
  
  const statusColors = {
    "Applied": "text-blue-400",
    "Interviewing": "text-yellow-400",
    "Offer Received": "text-green-400",
    "Rejected": "text-red-400",
    "Archived": "text-gray-500",
  };

  useEffect(() => {
    const allJobs = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    setTrackedJobs(allJobs.filter(job => job.status && job.status !== 'Viewed'));
  }, []);

  const updateJobStatus = (jobId, newStatus) => {
    const allJobs = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const updatedAllJobs = allJobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    );
    localStorage.setItem('jobApplications', JSON.stringify(updatedAllJobs));
    setTrackedJobs(updatedAllJobs.filter(job => job.status && job.status !== 'Viewed'));
    toast({
      title: "Status Updated",
      description: `Job status changed to ${newStatus}.`,
    });
  };
  
  const removeJob = (jobId) => {
    const allJobs = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const updatedAllJobs = allJobs.filter(job => job.id !== jobId);
    localStorage.setItem('jobApplications', JSON.stringify(updatedAllJobs));
    setTrackedJobs(updatedAllJobs.filter(job => job.status && job.status !== 'Viewed'));
    toast({
      title: "Job Removed",
      description: "The job has been removed from your tracker.",
      variant: "destructive",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Applied": return <Briefcase className="h-4 w-4 mr-2" />;
      case "Interviewing": return <Edit3 className="h-4 w-4 mr-2" />;
      case "Offer Received": return <Award className="h-4 w-4 mr-2" />;
      case "Rejected": return <XCircle className="h-4 w-4 mr-2" />;
      case "Archived": return <FolderOpen className="h-4 w-4 mr-2" />;
      default: return <CheckCircle className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          My Job Application Tracker
        </h1>
      </div>

      <AnimatePresence>
        {trackedJobs.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {trackedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/70 border-slate-700 hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{job.title}</CardTitle>
                        <CardDescription className="text-gray-400 flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" /> {job.company}
                        </CardDescription>
                      </div>
                       <Button onClick={() => removeJob(job.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-900/30 shrink-0">
                         <Trash2 className="h-5 w-5" />
                       </Button>
                    </div>
                     <CardDescription className="text-gray-400 flex items-center pt-1">
                      <MapPin className="mr-2 h-4 w-4" /> {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                     <div className="flex items-center">
                        <span className={`flex items-center font-semibold ${statusColors[job.status] || 'text-gray-300'}`}>
                          {getStatusIcon(job.status)} Current Status: {job.status}
                        </span>
                      </div>
                    <div>
                      <label htmlFor={`status-${job.id}`} className="text-sm font-medium text-gray-300 mb-1 block">Update Status:</label>
                      <Select
                        value={job.status}
                        onValueChange={(newStatus) => updateJobStatus(job.id, newStatus)}
                      >
                        <SelectTrigger id={`status-${job.id}`} className="w-full bg-slate-700 border-slate-600 text-white focus:ring-purple-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          {jobStatuses.map(status => (
                            <SelectItem key={status} value={status} className="hover:bg-purple-700/50 focus:bg-purple-600">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Placeholder for notes or deadlines */}
                    {/* <Textarea placeholder="Add notes, interview dates, contacts..." className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500" /> */}
                  </CardContent>
                   <CardFooter className="pt-4 border-t border-slate-700">
                     <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                   </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-slate-800/50 rounded-xl shadow-xl"
          >
            <ClipboardList className="h-20 w-20 text-purple-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">Your Tracker is Empty</h2>
            <p className="text-gray-400 mb-6">
              Start by applying for jobs on the "Apply Jobs" page. They will appear here once you've applied.
            </p>
            <Link to="/apply-jobs">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/50">
                Find Jobs to Apply
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobTrackerPage;
  