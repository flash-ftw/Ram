import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Send } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  subject: z.string().min(1, { message: "Veuillez sélectionner un sujet." }),
  message: z.string().min(10, { message: "Le message doit comporter au moins 10 caractères." }),
  subscribe: z.boolean().default(false),
});

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
      subscribe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await apiRequest({
        url: '/api/contact',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      toast({
        title: "Message Envoyé !",
        description: "Nous vous répondrons dès que possible.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Une erreur s'est produite.",
        description: "Votre message n'a pas pu être envoyé. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MessageSquare className="text-yellow-500 mr-2" size={28} />
              <span className="text-yellow-500 text-lg uppercase font-semibold tracking-wider">Contactez-Nous</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">
              Contacter Rammeh MotoScoot
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mt-6">
              Des questions sur nos motos ou nos services ? Besoin de planifier un essai ? Remplissez le formulaire ci-dessous et notre équipe vous répondra dès que possible.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-xl border border-yellow-500 p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white">Prénom</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white focus-visible:ring-yellow-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-yellow-500" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white">Nom</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white focus-visible:ring-yellow-500" 
                          />
                        </FormControl>
                        <FormMessage className="text-yellow-500" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-white">Adresse Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          className="w-full rounded-lg bg-gray-800 border-gray-700 text-white focus-visible:ring-yellow-500" 
                        />
                      </FormControl>
                      <FormMessage className="text-yellow-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-white">Subject</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-yellow-500">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="motorcycle-inquiry">Motorcycle Inquiry</SelectItem>
                          <SelectItem value="test-ride">Schedule Test Ride</SelectItem>
                          <SelectItem value="service">Service & Maintenance</SelectItem>
                          <SelectItem value="parts">Parts & Accessories</SelectItem>
                          <SelectItem value="financing">Financing Options</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-yellow-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-white">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={5} 
                          className="w-full rounded-lg resize-none bg-gray-800 border-gray-700 text-white focus-visible:ring-yellow-500"
                          placeholder="Tell us about your motorcycle interests, questions, or how we can help you..."
                        />
                      </FormControl>
                      <FormMessage className="text-yellow-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subscribe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-yellow-500 text-yellow-500 focus-visible:ring-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-black"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-300">
                          Subscribe to our newsletter for motorcycle news, events, and exclusive offers
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="inline-flex items-center px-8 py-3 shadow-md text-base font-semibold text-black bg-yellow-500 hover:bg-yellow-400 transition-colors duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 -mr-1 w-5 h-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
