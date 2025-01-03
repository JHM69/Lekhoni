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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type UserSignupFormValue = z.infer<typeof formSchema>;

export default function UserSignupForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };
  const form = useForm<UserSignupFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserSignupFormValue) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", data);
      toast({
        title: "Signup successful",
        description: "You have successfully signed up.",
      });
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/write",
      });
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to signup. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="আপনার পাসওয়ার্ড নিশ্চিত করুন..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} className="ml-auto w-full" type="submit">
          সাইন আপ করুন
        </Button>
      </form>
    </Form>
  );
}
