
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, PlusCircle, Trash2 } from 'lucide-react';

const initialJobs = [
  { id: 1, title: 'Frontend Developer', company: 'Tech Solutions Inc.', location: 'Remote', status: 'Viewed' },
  { id: 2, title: 'React Engineer', company: 'Innovate Hub', location: 'New York, NY', status: 'Applied' },
  { id: 3, title: 'UI/UX Designer', company: 'Creative Designs Co.', location: 'San Francisco, CA', status: 'Interviewing' },
];

const ApplyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedJobs = localStorage.getItem('jobApplications');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      setJobs(initialJobs);
      localStorage.setItem('jobApplications', JSON.stringify(initialJobs));
    }
  }, []);

  const handleApply = (jobId) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, status: 'Applied' } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobApplications', JSON.stringify(updatedJobs));
    toast({
      title: "Application Submitted!",
      description: `You've successfully applied for ${jobs.find(j => j.id === jobId)?.title}.`,
      variant: "default",
    });
  };
  
  const handleRemove = (jobId) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    localStorage.setItem('jobApplications', JSON.stringify(updatedJobs));
    toast({
      title: "Job Removed",
      description: "The job has been removed from your list.",
      variant: "destructive",
    });
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Job Listings & Applications
        </h1>
        <div className="relative w-full md:w-1/3">
          <Input 
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 focus:border-purple-500 text-white placeholder-gray-400"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Placeholder for adding new job - can be expanded later */}
      {/* <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
        <PlusCircle className="mr-2 h-5 w-5" /> Add New Job Posting
      </Button> */}
      
      <AnimatePresence>
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
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
                    <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{job.title}</CardTitle>
                    <CardDescription className="text-gray-400 flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" /> {job.company}
                    </CardDescription>
                    <CardDescription className="text-gray-400 flex items-center">
                      <MapPin className="mr-2 h-4 w-4" /> {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-300">Status: <span className={`font-semibold ${job.status === 'Applied' ? 'text-green-400' : job.status === 'Interviewing' ? 'text-yellow-400' : 'text-blue-400'}`}>{job.status}</span></p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-700">
                    {job.status !== 'Applied' && job.status !== 'Interviewing' && (
                       <Button onClick={() => handleApply(job.id)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full mr-2">
                         Apply Now
                       </Button>
                    )}
                    {(job.status === 'Applied' || job.status === 'Interviewing') && (
                      <Button variant="ghost" disabled className="w-full mr-2 text-green-400">Applied</Button>
                    )}
                    <Button onClick={() => handleRemove(job.id)} variant="destructive" size="icon" className="bg-red-700/80 hover:bg-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-xl text-gray-400">No jobs found matching your search.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApplyJobsPage;
  