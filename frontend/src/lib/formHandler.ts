import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeOf, z } from "zod";
import { feedbackFormScheme } from "./formSchema";

export function useFeedbackForm(): [
  UseFormReturn<
    {
      feedback: string;
    },
    undefined
  >,
  (value: TypeOf<typeof feedbackFormScheme>) => void,
] {
  const form = useForm<z.infer<typeof feedbackFormScheme>>({
    resolver: zodResolver(feedbackFormScheme),
    defaultValues: {
      feedback: "",
    },
  });
  function onSubmit(value: z.infer<typeof feedbackFormScheme>) {
    alert("feedback nya " + value.feedback);
    form.reset({ feedback: "" });
  }
  return [form, onSubmit];
}
