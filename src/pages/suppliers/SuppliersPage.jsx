import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users2, PlusCircle, Search, Mail, Phone, MapPin, Globe, Eye, Trash2 } from 'lucide-react';
import { getSuppliers, deleteSupplier } from '@/lib/api';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await getSuppliers();
      if (response && response.data) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: 'Notice',
        description: 'Failed to load suppliers from database.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => (s.id || s._id) !== id));
      toast({ title: "Supplier Removed", description: "Supplier has been removed from database." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete supplier.", variant: "destructive" });
    }
  };

  const filtered = suppliers.filter(s => {
    const name = s.name || '';
    const contact = s.contactPerson || '';
    const email = s.email || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 old-money-card border-[#2e4034] rounded-xl shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Vendors Directory</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <Users2 className="mr-3 h-7 w-7 text-[#c5a059]" /> Suppliers & Merchants
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Approved supplier guild & primary manufacturers</p>
        </div>
        <Link to="/suppliers/new">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Supplier
          </Button>
        </Link>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
            <Input 
              type="text"
              placeholder="Search by supplier name, contact person or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Users2 className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length > 0 ? (
            filtered.map((sup, idx) => {
              const sid = sup.id || sup._id || idx + 1;
              return (
                <Card key={sid} className="old-money-card border-[#2c3e33] hover:border-[#c5a059]/60 transition-all rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif font-semibold text-lg text-[#f8f6f0]">{sup.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#16291f] text-[#c5a059] border border-[#2c4435]">
                        {sup.productsSupplied || 0} Products
                      </span>
                    </div>
                    {sup.contactPerson && (
                      <p className="text-xs text-[#c5a059] font-medium mb-3">Contact: {sup.contactPerson}</p>
                    )}
                    <div className="space-y-1.5 text-xs text-[#9ea8a1]">
                      <p className="flex items-center"><Mail className="h-3.5 w-3.5 mr-2 text-[#718277]" /> {sup.email}</p>
                      <p className="flex items-center"><Phone className="h-3.5 w-3.5 mr-2 text-[#718277]" /> {sup.phone}</p>
                      {sup.address && (
                        <p className="flex items-center truncate"><MapPin className="h-3.5 w-3.5 mr-2 text-[#718277]" /> {sup.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1e2c22] mt-4 flex justify-between items-center">
                    <Link to={`/suppliers/${sid}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-[#c5a059] hover:bg-[#1a271f] hover:text-[#f8f6f0]">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(sid)} 
                      className="h-8 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-16 old-money-card border-[#2e4034] rounded-xl">
              <Users2 className="h-12 w-12 text-[#c5a059] mx-auto mb-3 opacity-80" />
              <p className="text-xs text-[#9ea8a1]">No suppliers found in MySQL database.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SuppliersPage;