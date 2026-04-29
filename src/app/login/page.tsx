"use client"
import { APP_NAME } from "@/config/app.config";
import { notifyError, notifySuccess } from "@/lib/toast";
import { initLogin, LoginRequest } from "@/model/login.model";
import { AuthService } from "@/service/login.service";
import { loginStallSchema } from "@/validation/login.validation";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
    const [form, setForm] = useState<LoginRequest>(initLogin);
    const [isLoading, SetIsLoading] = useState<boolean>(false);
    const router = useRouter();


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        SetIsLoading(true);

        const valid = loginStallSchema.safeParse(form);
        if (!valid.success) {
            notifyError(valid.error.issues[0].message);
            SetIsLoading(false);
            return;
        }

        const res = await AuthService.loginStall(valid.data);
        if (!res.success) {
            notifyError(res.message);
            SetIsLoading(false);
            return;
        }

        notifySuccess(res.message);
        SetIsLoading(false);
        router.push("/")
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-90 px-4">
                <h1 className="mb-8">{APP_NAME}</h1>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <fieldset disabled={isLoading} className="space-y-6">
                        <div>
                            <label htmlFor="licence" className="block mb-2">
                                Licence
                            </label>
                            <input
                                id="licence"
                                type="text"
                                value={form.licence}
                                onChange={(e) => setForm((prev) => ({ ...prev, licence: e.target.value }))}
                                className="w-full px-3 py-2 border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                className="w-full px-3 py-2 border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground px-4 py-2 hover:bg-opacity-90 transition-colors"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                disabled={isLoading}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Contact Admin
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}