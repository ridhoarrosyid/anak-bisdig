import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignupForm } from "@/lib/formHandler";

export default function SignUp() {
  const [signupForm, onSubmitSignup] = useSignupForm();

  return (
    <>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSubmitSignup)}
          className="mx-auto w-4/5"
        >
          <FormField
            control={signupForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jhon" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="jhondoe@mail" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password123" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="password123" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
