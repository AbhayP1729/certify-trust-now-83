
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Edit, Trash } from 'lucide-react';
import AgencyNavbar from '@/components/agency/AgencyNavbar';

type OrganizationStatus = 'Active' | 'Inactive' | 'Pending';

// Mock data for organizations - ensure status is explicitly typed
const initialOrganizations = [
  { id: 1, name: 'University of Technology', contact: 'admin@uot.edu', status: 'Active' as OrganizationStatus, certificatesIssued: 1245 },
  { id: 2, name: 'Global Institute', contact: 'tech@globalinst.org', status: 'Active' as OrganizationStatus, certificatesIssued: 987 },
  { id: 3, name: 'EduCert Academy', contact: 'info@educert.com', status: 'Inactive' as OrganizationStatus, certificatesIssued: 532 },
  { id: 4, name: 'Professional Training Center', contact: 'admin@ptc.net', status: 'Active' as OrganizationStatus, certificatesIssued: 345 },
  { id: 5, name: 'Academic Excellence', contact: 'support@acexcel.edu', status: 'Pending' as OrganizationStatus, certificatesIssued: 0 },
];

type Organization = {
  id: number;
  name: string;
  contact: string;
  status: OrganizationStatus;
  certificatesIssued: number;
};

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [newOrg, setNewOrg] = useState<Omit<Organization, 'id' | 'certificatesIssued'>>({
    name: '',
    contact: '',
    status: 'Pending'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<number | null>(null);

  const handleAddOrganization = () => {
    if (!newOrg.name || !newOrg.contact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const newOrgWithId: Organization = {
      ...newOrg,
      id: organizations.length > 0 ? Math.max(...organizations.map(org => org.id)) + 1 : 1,
      certificatesIssued: 0
    };
    
    setOrganizations([...organizations, newOrgWithId]);
    setNewOrg({ name: '', contact: '', status: 'Pending' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Organization has been added successfully.",
    });
  };

  const handleUpdateOrganization = () => {
    if (!editingOrg) return;
    
    setOrganizations(organizations.map(org => 
      org.id === editingOrg.id ? editingOrg : org
    ));
    setIsDialogOpen(false);
    setEditingOrg(null);
    
    toast({
      title: "Success",
      description: "Organization has been updated successfully.",
    });
  };

  const handleDeleteOrganization = () => {
    if (organizationToDelete === null) return;
    
    setOrganizations(organizations.filter(org => org.id !== organizationToDelete));
    setIsDeleteDialogOpen(false);
    setOrganizationToDelete(null);
    
    toast({
      title: "Success",
      description: "Organization has been deleted successfully.",
    });
  };

  const openEditDialog = (org: Organization) => {
    setEditingOrg({...org});
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: number) => {
    setOrganizationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <AgencyNavbar />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Organizations</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingOrg(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingOrg ? 'Edit Organization' : 'Add New Organization'}</DialogTitle>
                <DialogDescription>
                  {editingOrg ? 'Update organization details below.' : 'Fill in the details to add a new organization.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={editingOrg ? editingOrg.name : newOrg.name}
                    onChange={(e) => editingOrg 
                      ? setEditingOrg({...editingOrg, name: e.target.value})
                      : setNewOrg({...newOrg, name: e.target.value})
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">Contact</Label>
                  <Input
                    id="contact"
                    className="col-span-3"
                    value={editingOrg ? editingOrg.contact : newOrg.contact}
                    onChange={(e) => editingOrg 
                      ? setEditingOrg({...editingOrg, contact: e.target.value})
                      : setNewOrg({...newOrg, contact: e.target.value})
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <select
                    id="status"
                    className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1"
                    value={editingOrg ? editingOrg.status : newOrg.status}
                    onChange={(e) => {
                      const value = e.target.value as OrganizationStatus;
                      editingOrg 
                        ? setEditingOrg({...editingOrg, status: value})
                        : setNewOrg({...newOrg, status: value});
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={editingOrg ? handleUpdateOrganization : handleAddOrganization}>
                  {editingOrg ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Certificates Issued</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>{org.id}</TableCell>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>{org.contact}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    org.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    org.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {org.status}
                  </span>
                </TableCell>
                <TableCell>{org.certificatesIssued.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(org)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openDeleteDialog(org.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this organization? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteOrganization}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrganizationsPage;
