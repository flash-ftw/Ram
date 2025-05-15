import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  const formSchema = z.object({
    username: z.string().min(3, {
      message: t('admin.login.usernameError'),
    }),
    password: z.string().min(6, {
      message: t('admin.login.passwordError'),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ user: { id: number; username: string; isAdmin: boolean } }>({
        url: "/api/auth/login",
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.user?.isAdmin) {
        toast({
          title: t('admin.login.loginSuccess'),
          description: t('admin.login.welcomeMessage'),
        });
        setLocation("/admin/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: t('admin.login.accessDenied'),
          description: t('admin.login.notAdmin'),
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: t('admin.login.loginFailed'),
        description: t('admin.login.invalidCredentials'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold text-center ${isRTL ? 'rtl' : ''}`}>
            {t('admin.login.title')}
          </CardTitle>
          <CardDescription className={`text-center ${isRTL ? 'rtl' : ''}`}>
            {t('admin.login.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className={isRTL ? 'text-right' : ''}>
                    <FormLabel>{t('admin.login.username')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('admin.login.username')} 
                        dir={isRTL ? 'rtl' : 'ltr'}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className={isRTL ? 'text-right' : ''}>
                    <FormLabel>{t('admin.login.password')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={t('admin.login.password')} 
                        dir={isRTL ? 'rtl' : 'ltr'}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('admin.login.loggingIn') : t('admin.login.loginButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setLocation("/")}>
            {t('admin.login.backToWebsite')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}