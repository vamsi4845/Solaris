"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SavedWallet {
  id: string;
  name: string;
  address: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(32, {
    message: "Please enter a valid Solana address.",
  }),
});

interface AddWalletDialogProps {
  children: React.ReactNode;
}

export function AddWalletDialog({ children }: AddWalletDialogProps) {
  const [open, setOpen] = useState(false);
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<SavedWallet | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    const savedWallets = localStorage.getItem("savedWallets");
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedWallets", JSON.stringify(wallets));
  }, [wallets]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingWallet) {
      setWallets(wallets.map(wallet => 
        wallet.id === editingWallet.id 
          ? { ...values, id: wallet.id }
          : wallet
      ));
      setEditingWallet(null);
    } else {
      setWallets([...wallets, { ...values, id: crypto.randomUUID() }]);
    }
    form.reset();
    setShowForm(false);
  }

  function handleEdit(wallet: SavedWallet) {
    setEditingWallet(wallet);
    form.reset(wallet);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    setWallets(wallets.filter(wallet => wallet.id !== id));
    if (editingWallet?.id === id) {
      setEditingWallet(null);
      form.reset();
      setShowForm(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Wallet List</DialogTitle>
          <DialogDescription>
            Track your friends&apos; wallets and their activity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Table */}
          <ScrollArea className="h-[300px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallets.length > 0 ? (
                  wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell className="font-medium">{wallet.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {wallet.address}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(wallet)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(wallet.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-[200px]">
                      No wallets added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Add/Edit Form */}
          {showForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Friend&apos;s name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Solana wallet address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => {
                      setEditingWallet(null);
                      form.reset();
                      setShowForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingWallet ? "Save Changes" : "Add Wallet"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Wallet
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 