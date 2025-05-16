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
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const ContactForm = () => {
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formSchema = z.object({
    firstName: z.string().min(2, { message: t('contact.form.errors.firstNameMin') }),
    lastName: z.string().min(2, { message: t('contact.form.errors.lastNameMin') }),
    email: z.string().email({ message: t('contact.form.errors.emailInvalid') }),
    subject: z.string().min(1, { message: t('contact.form.errors.subjectRequired') }),
    message: z.string().min(10, { message: t('contact.form.errors.messageMin') }),
    subscribe: z.boolean().default(false),
  });

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
        title: t('contact.form.success.title'),
        description: t('contact.form.success.message'),
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: t('contact.form.error.title'),
        description: t('contact.form.error.message'),
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
              <MessageSquare className={`text-yellow-500 ${isRTL ? 'ml-2' : 'mr-2'}`} size={28} />
              <span className="text-yellow-500 text-lg uppercase font-semibold tracking-wider">{t('contact.title')}</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">
              {t('contact.heading')}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mt-6">
              {t('contact.description')}
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
                        <FormLabel className="text-sm font-medium text-white">{t('contact.form.firstName')}</FormLabel>
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
                        <FormLabel className="text-sm font-medium text-white">{t('contact.form.lastName')}</FormLabel>
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
                      <FormLabel className="text-sm font-medium text-white">{t('contact.form.email')}</FormLabel>
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
                      <FormLabel className="text-sm font-medium text-white">{t('contact.form.subject')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-yellow-500">
                            <SelectValue placeholder={t('contact.form.subjectPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="motorcycle-inquiry">{t('contact.form.subjects.motorcycleInquiry')}</SelectItem>
                          <SelectItem value="test-ride">{t('contact.form.subjects.testRide')}</SelectItem>
                          <SelectItem value="service">{t('contact.form.subjects.service')}</SelectItem>
                          <SelectItem value="parts">{t('contact.form.subjects.parts')}</SelectItem>
                          <SelectItem value="financing">{t('contact.form.subjects.financing')}</SelectItem>
                          <SelectItem value="other">{t('contact.form.subjects.other')}</SelectItem>
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
                      <FormLabel className="text-sm font-medium text-white">{t('contact.form.message')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={5} 
                          className="w-full rounded-lg resize-none bg-gray-800 border-gray-700 text-white focus-visible:ring-yellow-500"
                          placeholder={t('contact.form.messagePlaceholder')}
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
                          {t('contact.form.subscribe')}
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
                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                    <Send className={`${isRTL ? 'mr-2 -ml-1' : 'ml-2 -mr-1'} w-5 h-5 ${isRTL ? 'transform rotate-180' : ''}`} />
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