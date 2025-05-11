
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users2, ArrowLeft, Mail, Phone, User, Building, Globe, Edit3, Save, Package, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const SupplierDetailsPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [supplier, setSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields for editing
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Mock data for related items
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedPOs, setRelatedPOs] = useState([]);

  useEffect(() => {
    const fetchSupplierData = () => {
      setIsLoading(true);
      const allSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
      const foundSupplier = allSuppliers.find(s => s.id === supplierId);
      
      if (foundSupplier) {
        setSupplier(foundSupplier);
        setSupplierName(foundSupplier.name);
        setContactPerson(foundSupplier.contactPerson || '');
        setEmail(foundSupplier.email);
        setPhone(foundSupplier.phone);
        setAddress(foundSupplier.address || '');
        setWebsite(foundSupplier.website || '');
        setNotes(foundSupplier.notes || '');

        // Mock fetching related data
        const allProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
        setRelatedProducts(allProducts.filter(p => p.supplier === foundSupplier.name).slice(0, 5)); // Show first 5

        const allPOs = JSON.parse(localStorage.getItem('inventoryPurchaseOrders')) || [];
        setRelatedPOs(allPOs.filter(po => po.supplierId === foundSupplier.id).slice(0,5));

      } else {
        toast({ title: "Error", description: "Supplier not found.", variant: "destructive" });
        navigate('/suppliers');
      }
      setIsLoading(false);
    };
    fetchSupplierData();
  }, [supplierId, navigate, toast]);

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

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly.", variant: "destructive" });
      return;
    }

    const updatedSupplierData = { 
      ...supplier, 
      name: supplierName, 
      contactPerson, 
      email, 
      phone, 
      address, 
      website, 
      notes 
    };

    const allSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
    const updatedSuppliers = allSuppliers.map(s => s.id === supplierId ? updatedSupplierData : s);
    localStorage.setItem('inventorySuppliers', JSON.stringify(updatedSuppliers));

    setSupplier(updatedSupplierData);
    setIsEditing(false);
    toast({ title: "Supplier Updated", description: `${supplierName} has been successfully updated.` });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Users2 className="h-12 w-12 animate-spin text-sky-500" /></div>;
  }

  if (!supplier) {
    return <div className="text-center py-10 text-red-500">Supplier not found.</div>;
  }

  const DetailItem = ({ label, value, icon, className, isLink = false }) => (
    <div className={cn("mb-2", className)}>
      <Label className="text-sm font-medium text-gray-400 flex items-center">
        {icon && React.cloneElement(icon, { className: "mr-2 h-4 w-4"})}
        {label}
      </Label>
      {isLink && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="text-gray-100 break-words">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Button variant="outline" onClick={() => navigate('/suppliers')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers
      </Button>

      <form onSubmit={handleSaveChanges}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-700 pb-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
                <Users2 className="mr-3 h-7 w-7 md:h-8 md:w-8" /> {isEditing ? "Edit Supplier" : supplier.name}
              </CardTitle>
              {!isEditing && <CardDescription className="text-gray-400 mt-1">ID: {supplier.id}</CardDescription>}
            </div>
            <Button type={isEditing ? "submit" : "button"} onClick={() => { if(!isEditing) setIsEditing(true);}} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md self-start md:self-auto">
              {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
              {isEditing ? "Save Changes" : "Edit Supplier"}
            </Button>
          </CardHeader>
          
          <CardContent className="pt-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplierName" className={cn("text-gray-300", errors.supplierName && "text-red-400")}>Supplier Name*</Label>
                      <Input id="supplierName" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.supplierName && "border-red-500")} />
                      {errors.supplierName && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.supplierName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="contactPerson" className="text-gray-300">Contact Person</Label>
                      <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div>
                      <Label htmlFor="email" className={cn("text-gray-300", errors.email && "text-red-400")}>Email*</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.email && "border-red-500")} />
                      {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className={cn("text-gray-300", errors.phone && "text-red-400")}>Phone*</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.phone && "border-red-500")} />
                      {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-300">Address</Label>
                    <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-slate-700 border-slate-600 min-h-[80px]" />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-gray-300">Website</Label>
                    <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-slate-700 border-slate-600 min-h-[100px]" />
                  </div>
                </>
              ) : (
                <>
                  <DetailItem label="Contact Person" value={supplier.contactPerson} icon={<User />} />
                  <DetailItem label="Email" value={supplier.email} icon={<Mail />} />
                  <DetailItem label="Phone" value={supplier.phone} icon={<Phone />} />
                  <DetailItem label="Address" value={supplier.address} icon={<Building />} />
                  <DetailItem label="Website" value={supplier.website} icon={<Globe />} isLink={true} />
                  <DetailItem label="Notes" value={supplier.notes} icon={<FileText />} />
                </>
              )}
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader><CardTitle className="text-lg text-sky-300">Products from this Supplier</CardTitle></CardHeader>
                    <CardContent>
                        {relatedProducts.length > 0 ? (
                            <ul className="space-y-1 text-sm text-gray-300">
                                {relatedProducts.map(p => <li key={p.id} className="flex items-center"><Package size={16} className="mr-2 text-sky-400"/>{p.name}</li>)}
                            </ul>
                        ) : <p className="text-sm text-gray-400">No products linked to this supplier yet.</p>}
                    </CardContent>
                </Card>
                 <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader><CardTitle className="text-lg text-sky-300">Recent Purchase Orders</CardTitle></CardHeader>
                    <CardContent>
                        {relatedPOs.length > 0 ? (
                            <ul className="space-y-1 text-sm text-gray-300">
                                {relatedPOs.map(po => <li key={po.id} className="flex items-center"><FileText size={16} className="mr-2 text-sky-400"/>{po.id} - {po.status}</li>)}
                            </ul>
                        ) : <p className="text-sm text-gray-400">No purchase orders for this supplier yet.</p>}
                    </CardContent>
                </Card>
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); /* Reset changes */ }} className="text-gray-300 border-slate-600 hover:bg-slate-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </motion.div>
  );
};

export default SupplierDetailsPage;
  