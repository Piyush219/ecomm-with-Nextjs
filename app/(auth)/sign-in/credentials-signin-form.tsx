"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInwithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const CredentialSignInForm = () => {
  const [data, action] = useActionState(signInwithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Email"
            defaultValue={signInDefaultValues.email}
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
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <SignInButton />
        </div>

        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="link">
            Sign Up
          </Link>
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
      </div>
    </form>
  );
};

export default CredentialSignInForm;
