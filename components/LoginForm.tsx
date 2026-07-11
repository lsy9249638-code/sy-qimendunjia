"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export default function LoginForm(){const router=useRouter();const[error,setError]=useState("");const[busy,setBusy]=useState(false);async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget);const result=await createClient().auth.signInWithPassword({email:String(f.get("email")),password:String(f.get("password"))});if(result.error){setError("邮箱或密码不正确");setBusy(false)}else{router.push("/");router.refresh()}}return <form className="login-form" onSubmit={submit}><label>邮箱<input name="email" type="email" required/></label><label>密码<input name="password" type="password" required/></label><button disabled={busy}>{busy?"正在登录…":"登录"}</button>{error&&<p className="form-error">{error}</p>}</form>}
