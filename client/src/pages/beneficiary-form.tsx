import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBeneficiaryProfileSchema, type InsertBeneficiaryProfile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Beneficiary Form</CardTitle>
          <CardDescription>
            Please fill out the beneficiary details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Insured Name */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Insured Name</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="insuredFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">First Name</FormLabel>
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
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">Last Name</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Beneficiary Name */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. Beneficiary Name</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="beneficiaryFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">First Name</FormLabel>
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
                          <Input placeholder="Middle Name" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">Middle Name</FormLabel>
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
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">Last Name</FormLabel>
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
                          <Input placeholder="Suffix" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">Suffix</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Date of Birth</h3>
                <FormField
                  control={form.control}
                  name="beneficiaryDob"
                  render={({ field }) => (
                    <FormItem className="max-w-md">
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormLabel className="text-xs text-muted-foreground font-normal">Date</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gender</h3>
                <FormField
                  control={form.control}
                  name="beneficiaryGender"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
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
                <h3 className="text-lg font-semibold">Address</h3>
                
                <FormField
                  control={form.control}
                  name="addressStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='Type "Same as Owner"' {...field} />
                      </FormControl>
                      <FormLabel className="text-xs text-muted-foreground font-normal">Street Address</FormLabel>
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
                        <Input placeholder="if address is same" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormLabel className="text-xs text-muted-foreground font-normal">Street Address Line 2</FormLabel>
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
                          <Input {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">City</FormLabel>
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
                          <Input {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">State / Province</FormLabel>
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
                          <Input {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">Postal / Zip Code</FormLabel>
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
                            <SelectTrigger>
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
                        <FormLabel className="text-xs text-muted-foreground font-normal">Country</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Relationship & Allocation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Relationship to the Insured</h3>
                  <FormField
                    control={form.control}
                    name="relationshipToInsured"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Please Select" />
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
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Allocation</h3>
                  <FormField
                    control={form.control}
                    name="allocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormLabel className="text-xs text-muted-foreground font-normal">Total Allocation 100%</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-6"></div>

              {/* Total */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold uppercase">Total</h3>
                <FormField
                  control={form.control}
                  name="totalAllocation"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormControl>
                        <Input readOnly {...field} value={field.value || "0"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center gap-4 pt-8">
                <Button type="submit" className="w-32" disabled={isSubmitting}>
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
