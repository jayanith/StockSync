
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users2, ArrowLeft, Mail, Phone, User, Building, Globe, AlertCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!supplierName.trim()) newErrors.supplierName = 'Supplier name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly.", variant: "destructive" });
      return;
    }

    const newSupplier = {
      id: `sup${Date.now()}`,
      name: supplierName,
      contactPerson,
      email,
      phone,
      address,
      website,
      notes,
      productsSupplied: 0, // Initial value
    };

    const existingSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
    localStorage.setItem('inventorySuppliers', JSON.stringify([...existingSuppliers, newSupplier]));

    toast({ title: "Supplier Added", description: `${supplierName} has been successfully added.` });
    navigate('/suppliers');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
            <Users2 className="mr-3 h-7 w-7" /> Add New Supplier
          </CardTitle>
          <CardDescription className="text-gray-400">Enter the details for the new supplier.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="supplierName" className={cn("text-gray-300", errors.supplierName && "text-red-400")}>Supplier Name*</Label>
                <Input id="supplierName" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="e.g., Global Tech Solutions" className={cn("bg-slate-700 border-slate-600", errors.supplierName && "border-red-500")} />
                {errors.supplierName && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.supplierName}</p>}
              </div>
              <div>
                <Label htmlFor="contactPerson" className="text-gray-300">Contact Person</Label>
                <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="e.g., Jane Doe" className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="email" className={cn("text-gray-300", errors.email && "text-red-400")}>Email*</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., sales@example.com" className={cn("bg-slate-700 border-slate-600", errors.email && "border-red-500")} />
                {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className={cn("text-gray-300", errors.phone && "text-red-400")}>Phone*</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., (555) 123-4567" className={cn("bg-slate-700 border-slate-600", errors.phone && "border-red-500")} />
                {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.phone}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-gray-300">Address</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Supplier Lane, City, Country" className="bg-slate-700 border-slate-600 min-h-[80px]" />
            </div>
            <div>
              <Label htmlFor="website" className="text-gray-300">Website</Label>
              <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="e.g., https://www.example.com" className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Label htmlFor="notes" className="text-gray-300">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional information about the supplier..." className="bg-slate-700 border-slate-600 min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={() => navigate('/suppliers')} className="text-gray-300 border-slate-600 hover:bg-slate-700">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Supplier
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddSupplierPage;
  