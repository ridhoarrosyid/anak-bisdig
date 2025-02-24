import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeOf, z } from "zod";
import {
  feedbackFormScheme,
  loginFormScheme,
  signupFormScheme,
} from "./formSchema";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";

export function useFeedbackForm(): [
  UseFormReturn<z.infer<typeof feedbackFormScheme>>,
  (value: TypeOf<typeof feedbackFormScheme>) => void,
] {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof feedbackFormScheme>>({
    resolver: zodResolver(feedbackFormScheme),
    defaultValues: {
      suggestion: "",
    },
  });
  async function onSubmit(value: z.infer<typeof feedbackFormScheme>) {
    try {
      const res = await fetch("http://localhost:3000/api/suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
        credentials: "include",
        redirect: "follow",
      }).then((res) => res.json());
      form.reset();
      toast({
        title: res.message,
        description: res.data.suggestion,
      });
    } catch (err) {
      console.log(err);
    }
  }
  return [form, onSubmit];
}

export function useLoginForm(): [
  UseFormReturn<z.infer<typeof loginFormScheme>>,
  (value: TypeOf<typeof loginFormScheme>) => void,
] {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginFormScheme>>({
    resolver: zodResolver(loginFormScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(value: z.infer<typeof loginFormScheme>) {
    try {
      const data = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(value),
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        credentials: "include",
      }).then((res) => res.json());
      alert(data.message);
      navigate("/dashboard/products");
    } catch (err) {
      console.log(err);
    }
  }
  return [form, onSubmit];
}

export function useSignupForm(): [
  UseFormReturn<z.infer<typeof signupFormScheme>>,
  (value: TypeOf<typeof signupFormScheme>) => void,
] {
  const form = useForm<z.infer<typeof signupFormScheme>>({
    resolver: zodResolver(signupFormScheme),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(value: z.infer<typeof signupFormScheme>) {
    const { firstName, lastName, email, password } = value;
    const body = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        credentials: "include",
      }).then((res) => res.json);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
  return [form, onSubmit];
}
