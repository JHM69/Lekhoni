"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(4, { message: "Password must be at least 6 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserSigninForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: "test@gmail.com",
    password: "test",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl ?? "/write",
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "You have successfully logged in."
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to login. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ইমেইল</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="আপনার ইমেইল দিন..."
                    disabled={loading}
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
              <FormItem>
                <FormLabel>পাসওয়ার্ড</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="আপনার পাসওয়ার্ড দিন..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            লগ ইন করুন
          </Button>
        </form>
      </Form>
      
    </>
  );
}