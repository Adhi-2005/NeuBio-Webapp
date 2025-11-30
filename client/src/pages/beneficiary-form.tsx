import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBeneficiaryProfileSchema, type InsertBeneficiaryProfile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function BeneficiaryForm({ onNext }: { onNext?: () => void }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertBeneficiaryProfile>({
    resolver: zodResolver(insertBeneficiaryProfileSchema),
    defaultValues: {
      insuredFirstName: "",
      insuredLastName: "",
      beneficiaryFirstName: "",
      beneficiaryMiddleName: "",
      beneficiaryLastName: "",
      beneficiarySuffix: "",
      beneficiaryDob: "",
      beneficiaryGender: "",
      addressStreet: "",
      addressLine2: "",
      addressCity: "",
      addressState: "",
      addressZip: "",
      addressCountry: "Philippines",
      relationshipToInsured: "",
      allocation: "0",
      addBeneficiary2: "no",
      totalAllocation: "0",
    },
  });

  // Watch allocation to update total
  const allocation = form.watch("allocation");
  useEffect(() => {
    form.setValue("totalAllocation", allocation);
  }, [allocation, form]);

  const onSubmit = async (data: InsertBeneficiaryProfile) => {
    setIsSubmitting(true);
    try {
      console.log("Beneficiary Profile Data:", data);
      
      toast({
        title: "Profile Saved",
        description: "Beneficiary information has been saved successfully.",
      });
      
      if (onNext) {
        onNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 mt-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
            Beneficiary<br />Profile
          </h1>
          <p className="text-muted-foreground font-medium">
            Please fill out the beneficiary details below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Insured Name */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">Insured Name</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="insuredFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuredLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Beneficiary Name */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">Beneficiary Name</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="beneficiaryFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="beneficiaryMiddleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Middle Name" {...field} value={field.value || ""} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="beneficiaryLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="beneficiarySuffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Suffix" {...field} value={field.value || ""} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">Date of Birth</h3>
              <FormField
                control={form.control}
                name="beneficiaryDob"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-full h-12 px-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">Gender</h3>
              <FormField
                control={form.control}
                name="beneficiaryGender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem className="space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex items-center justify-center w-full h-12 rounded-full bg-muted text-muted-foreground font-bold uppercase tracking-wide cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted/80">
                            Male
                          </FormLabel>
                        </FormItem>
                        <FormItem className="space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex items-center justify-center w-full h-12 rounded-full bg-muted text-muted-foreground font-bold uppercase tracking-wide cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted/80">
                            Female
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">Address</h3>
              
              <FormField
                control={form.control}
                name="addressStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Street Address' {...field} className="rounded-full h-12 px-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Street Address Line 2" {...field} value={field.value || ""} className="rounded-full h-12 px-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="addressCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="City" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressState"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="State / Province" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="addressZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Postal / Zip Code" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressCountry"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-full h-12 px-6">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Philippines">Philippines</SelectItem>
                          <SelectItem value="UAE">United Arab Emirates</SelectItem>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Relationship & Allocation */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wide">Relationship & Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="relationshipToInsured"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-full h-12 px-6">
                            <SelectValue placeholder="Relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min="0" max="100" placeholder="Allocation %" {...field} className="rounded-full h-12 px-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full rounded-full h-14 text-lg font-bold uppercase tracking-wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Next Step"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
