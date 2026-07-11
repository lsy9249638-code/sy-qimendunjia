"use client";
import Link from "next/link"; import { useRouter } from "next/navigation"; import { createClient } from "@/lib/supabase/client";
export default function AuthNav({signedIn}:{signedIn:boolean}){const router=useRouter();return signedIn?<button className="text-button" onClick={async()=>{await createClient().auth.signOut();router.push("/");router.refresh()}}>退出</button>:<Link href="/login">主人登录</Link>}
