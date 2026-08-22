import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building, PlusCircle, Search, MapPin, Phone, Mail, User, Eye, Trash2, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getWarehouses, createWarehouse, deleteWarehouse } from '@/lib/api';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('5000');
  const [manager, setManager] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const res = await getWarehouses();
      if (res && res.data) {
        setWarehouses(res.data);
      }
    } catch (e) {
      console.error('Error fetching warehouses:', e);
      toast({ title: 'Notice', description: 'Failed to load warehouses from database.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      toast({ title: "Validation Error", description: "Warehouse name and location are required.", variant: "destructive" });
      return;
    }

    try {
      await createWarehouse({
        name: name.trim(),
        location: location.trim(),
        address: address.trim() || undefined,
        capacity: parseInt(capacity) || 5000,
        manager: manager.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        status: 'Active'
      });

      toast({ title: "Warehouse Created", description: `${name} saved to MySQL database.` });
      setIsCreateOpen(false);
      setName('');
      setLocation('');
      setAddress('');
      fetchWarehouses();
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to create warehouse.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWarehouse(id);
      setWarehouses(prev => prev.filter(w => (w.id || w._id) !== id));
      toast({ title: "Warehouse Removed", description: "Warehouse deleted from database." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete warehouse.", variant: "destructive" });
    }
  };

  const filtered = warehouses.filter(w => {
    const wName = w.name || '';
    const wLoc = w.location || '';
    return wName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           wLoc.toLowerCase().includes(searchTerm.toLowerCase());
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
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Vaults & Hubs</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <Building className="mr-3 h-7 w-7 text-[#c5a059]" /> Storage Warehouses
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Secure depositories, vaults, and regional logistics fulfillment hubs</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Vault / Depot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111914] border-[#36493e] text-[#f4efe6] max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-[#f8f6f0]">Register New Warehouse</DialogTitle>
              <DialogDescription className="text-xs text-[#9ea8a1]">Enter facility and storage capacity details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 pt-2">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059]">Facility Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mayfair Vault & Depository" className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059]">Location / Region *</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. London, Mayfair" className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Street Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="22 Berkeley Square" className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Capacity (Units)</Label>
                  <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Manager Name</Label>
                  <Input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Edward Kensington" className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-[#202f25]">
                <Button type="submit" className="old-money-gold-btn text-xs uppercase tracking-wider w-full">
                  Save Warehouse
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
            <Input 
              type="text"
              placeholder="Search warehouses by facility name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Building className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length > 0 ? (
            filtered.map((w, idx) => {
              const wid = w.id || w._id || idx + 1;
              return (
                <Card key={wid} className="old-money-card border-[#2c3e33] hover:border-[#c5a059]/60 transition-all rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif font-semibold text-lg text-[#f8f6f0]">{w.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#16291f] text-[#6ee7b7] border border-[#2c4435]">
                        {w.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-[#c5a059] font-medium mb-3 flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1" /> {w.location}
                    </p>
                    <div className="space-y-1.5 text-xs text-[#9ea8a1]">
                      {w.address && <p className="truncate">Address: {w.address}</p>}
                      <p>Capacity: <span className="text-[#f4efe6] font-semibold">{w.capacity || 5000}</span> storage units</p>
                      {w.manager && <p>Manager: <span className="text-[#e5dec9]">{w.manager}</span></p>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1e2c22] mt-4 flex justify-between items-center">
                    <Link to={`/inventory/warehouses/${wid}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-[#c5a059] hover:bg-[#1a271f] hover:text-[#f8f6f0]">
                        <Eye className="h-3.5 w-3.5 mr-1" /> Inspect Vault
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(wid)} 
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
              <Building className="h-12 w-12 text-[#c5a059] mx-auto mb-3 opacity-80" />
              <p className="text-xs text-[#9ea8a1]">No warehouses logged in MySQL.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WarehousesPage;