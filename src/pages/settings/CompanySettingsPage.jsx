
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building, ArrowLeft, Save, UploadCloud, Mail, Phone, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CompanySettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    // Load existing settings from localStorage
    const settings = JSON.parse(localStorage.getItem('companySettings')) || {};
    setCompanyName(settings.companyName || 'InventoryPro Inc.');
    setCompanyEmail(settings.companyEmail || 'contact@inventorypro.com');
    setCompanyPhone(settings.companyPhone || '(555) 012-3456');
    setCompanyAddress(settings.companyAddress || '123 Business Rd, Suite 404, Commerce City, USA');
    setCompanyWebsite(settings.companyWebsite || 'https://www.inventorypro.example.com');
    setLogoPreview(settings.logoPreview || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'); // Default placeholder
  }, []);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCompanyLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSettings = {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      logoPreview, // In real app, upload logo and store URL
    };
    localStorage.setItem('companySettings', JSON.stringify(updatedSettings));
    toast({ title: "Settings Saved", description: "Company profile updated successfully." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate('/settings')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
            <Building className="mr-3 h-7 w-7" /> Company Profile
          </CardTitle>
          <CardDescription className="text-gray-400">Manage your organization's details.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-2 border-sky-500">
                <AvatarImage src={logoPreview} alt={companyName} />
                <AvatarFallback className="bg-sky-600 text-white text-3xl">{companyName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="companyLogo" className="text-gray-300">Company Logo</Label>
                <div className="relative mt-1">
                    <Input id="companyLogo" type="file" onChange={handleLogoChange} accept="image/*" className="bg-slate-700 border-slate-600 file:text-sky-400 file:font-medium hover:file:bg-sky-700/20" />
                    <UploadCloud className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: Square image, PNG or JPG, max 2MB.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="companyEmail" className="text-gray-300">Company Email</Label>
                <Input id="companyEmail" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="companyPhone" className="text-gray-300">Company Phone</Label>
                <Input id="companyPhone" type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="bg-slate-700 border-slate-600" />
              </div>
               <div>
                <Label htmlFor="companyWebsite" className="text-gray-300">Company Website</Label>
                <Input id="companyWebsite" type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-slate-700 border-slate-600" />
              </div>
            </div>
            <div>
              <Label htmlFor="companyAddress" className="text-gray-300">Company Address</Label>
              <Textarea id="companyAddress" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="bg-slate-700 border-slate-600 min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6 border-t border-slate-700">
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <Save className="mr-2 h-5 w-5" /> Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default CompanySettingsPage;
  