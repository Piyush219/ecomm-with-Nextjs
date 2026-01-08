"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Signing Up..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder="Name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="current-password"
            required
            placeholder="Confirm Password"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="link">
            Sign In
          </Link>
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
