import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users2, ArrowLeft, Mail, Phone, Building, Globe, PlusCircle } from 'lucide-react';
import { createSupplier } from '@/lib/api';

const AddSupplierPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierName.trim() || !email.trim() || !phone.trim()) {
      toast({ title: "Validation Error", description: "Supplier name, email, and phone are required.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: supplierName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      website: website.trim(),
      notes: notes.trim(),
      productsSupplied: 0
    };

    try {
      await createSupplier(payload);
      toast({ title: "Supplier Registered", description: `${supplierName} added to MySQL database.` });
      navigate('/suppliers');
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast({ title: "Failed", description: error.message || "Failed to create supplier.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers
      </Button>

      <Card className="old-money-card border-[#2e4034] rounded-xl shadow-2xl">
        <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
          <CardTitle className="text-2xl font-serif text-[#f8f6f0] flex items-center">
            <Users2 className="mr-3 h-6 w-6 text-[#c5a059]" /> Register New Supplier
          </CardTitle>
          <CardDescription className="text-xs text-[#9ea8a1]">
            Enter merchant information into central procurement database.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Supplier / Guild Name *</Label>
                <Input 
                  value={supplierName} 
                  onChange={(e) => setSupplierName(e.target.value)} 
                  placeholder="e.g. Geneva Horological Guild" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Contact Person</Label>
                <Input 
                  value={contactPerson} 
                  onChange={(e) => setContactPerson(e.target.value)} 
                  placeholder="e.g. Henri de Montmollin" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Email Address *</Label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="guild@genevawatches.ch" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Telephone Number *</Label>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+41 22 700 8820" 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                />
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Headquarters Address</Label>
              <Textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="14 Rue du Rhône, Geneva, Switzerland" 
                className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] min-h-[60px]" 
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Website URL</Label>
              <Input 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                placeholder="https://genevawatches.ch" 
                className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Notes & Contract Terms</Label>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Primary partner for high-precision timepieces..." 
                className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] min-h-[70px]" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 p-6 border-t border-[#202f25] bg-[#0f1712]/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/suppliers')} 
              className="text-[#9ea8a1] border-[#2c3d32] hover:bg-[#18241d] hover:text-[#f4efe6]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="old-money-gold-btn px-6 py-2"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> {isSubmitting ? 'Registering...' : 'Save Supplier'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddSupplierPage;