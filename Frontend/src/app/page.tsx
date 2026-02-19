"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, Layout, Users } from "lucide-react";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        </div>
    );

    return (
        <main className="flex min-h-screen flex-col bg-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                        T
                    </div>
                    <span className="text-xl font-bold text-gray-900">TaskFlow</span>
                </div>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-white to-white">
                <div className="max-w-3xl space-y-8 animate-fade-in">
                    <div className="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600">
                        <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                        v1.0 Now Available
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                        Manage tasks with <br />
                        <span className="text-primary-600">clarity and focus</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500">
                        Streamline your workflow, collaborate with your team, and ship projects faster with our intuitive task management system.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Link href="/register">
                            <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary-500/30 hover:shadow-primary-600/40 transform transition hover:-translate-y-1">
                                Start for free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="secondary" size="lg" className="h-14 px-8 text-lg">
                                Live Demo
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto px-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow text-left">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                            <Layout />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Kanban Boards</h3>
                        <p className="text-gray-500">Visualize your workflow with intuitive drag-and-drop boards.</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow text-left">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
                            <CheckCircle />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Task Tracking</h3>
                        <p className="text-gray-500">Keep track of deadlines, priorities, and status in real-time.</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow text-left">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                            <Users />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Team Collaboration</h3>
                        <p className="text-gray-500">Assign tasks and manage user roles seamlessly.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
