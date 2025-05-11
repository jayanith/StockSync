
import React, { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';

const ImportResumePage = () => {
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const { toast } = useToast();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setFileError('');
    setUploadedFile(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setUploadedFile(file);
        localStorage.setItem('resumeFile', JSON.stringify({ name: file.name, type: file.type, size: file.size }));
        toast({
          title: "Resume Uploaded!",
          description: `${file.name} has been successfully uploaded.`,
          variant: "default",
        });
      } else {
        setFileError("Invalid file type. Please upload a PDF or DOC file.");
        toast({
          title: "Upload Failed",
          description: "Invalid file type. Please upload a PDF or DOC file.",
          variant: "destructive",
        });
      }
      e.dataTransfer.clearData();
    }
  }, [toast]);
  
  const handleFileInputChange = (e) => {
    setFileError('');
    setUploadedFile(null);
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setUploadedFile(file);
        localStorage.setItem('resumeFile', JSON.stringify({ name: file.name, type: file.type, size: file.size }));
        toast({
          title: "Resume Selected!",
          description: `${file.name} has been successfully selected.`,
        });
      } else {
        setFileError("Invalid file type. Please upload a PDF or DOC file.");
        toast({
          title: "Selection Failed",
          description: "Invalid file type. Please upload a PDF or DOC file.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-8 bg-slate-800/50 rounded-xl shadow-2xl"
    >
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Import Your Resume
      </h1>
      
      <div
        className={`p-8 border-2 ${dragging ? 'border-purple-500 bg-slate-700/50' : 'border-dashed border-slate-600'} rounded-lg text-center cursor-pointer transition-all duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resumeInput').click()}
      >
        <input
          type="file"
          id="resumeInput"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
        />
        <UploadCloud className={`mx-auto h-16 w-16 mb-4 ${dragging ? 'text-purple-400' : 'text-gray-400'} transition-colors duration-300`} />
        <p className="text-lg font-semibold text-gray-300">
          {dragging ? "Drop your resume here" : "Drag & drop your resume (PDF or DOC)"}
        </p>
        <p className="text-sm text-gray-500">or click to browse</p>
      </div>

      {fileError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 flex items-center"
        >
          <XCircle className="h-5 w-5 mr-2" />
          {fileError}
        </motion.div>
      )}

      {uploadedFile && !fileError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-md"
        >
          <div className="flex items-center text-green-300">
            <CheckCircle className="h-6 w-6 mr-3 text-green-400" />
            <div>
              <p className="font-semibold">File Uploaded: {uploadedFile.name}</p>
              <p className="text-sm text-green-400">Type: {uploadedFile.type}, Size: {(uploadedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setUploadedFile(null);
              localStorage.removeItem('resumeFile');
              document.getElementById('resumeInput').value = null; // Reset file input
              toast({ title: "Resume Cleared", description: "The uploaded resume has been removed."});
            }} 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-900/50"
          >
            Remove File
          </Button>
        </motion.div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Your resume will be used to help pre-fill applications and showcase your profile.
        </p>
      </div>
    </motion.div>
  );
};

export default ImportResumePage;
  