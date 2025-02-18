import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "@/lib/formHandler";

export default function Login() {
  const [loginForm, onSubmitLogin] = useLoginForm();
  return (
    <>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="john@mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="sandi kuat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="sm" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}
