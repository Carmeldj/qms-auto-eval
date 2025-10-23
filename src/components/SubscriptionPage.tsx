export default function SubscriptionPage() {
    return (
        <div className="h-max flex flex-col items-center justify-center p-8 bg-white rounded-lg">
            <div className="max-w-3xl w-full">
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold">Subscription</h1>
                    <p className="text-sm text-gray-600">Choose a plan and subscribe to get access to premium features.</p>
                </header>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget as HTMLFormElement;
                        const data = new FormData(form);
                        const plan = data.get("plan") ?? "none";
                        const email = data.get("email") ?? "";
                        // Replace this with real subscription logic
                        alert(`Subscribed ${String(email)} to the ${String(plan)} plan.`);
                        form.reset();
                    }}
                    className="space-y-6"
                >
                    <div className="flex gap-4">
                        <label className="flex-1">
                            <input className="peer sr-only" type="radio" name="plan" value="Basic" defaultChecked />
                            <div className="border rounded-lg p-4 flex flex-col gap-2 peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Basic</span>
                                    <span className="text-sm text-gray-500">$5/mo</span>
                                </div>
                                <p className="text-xs text-gray-600">Essential features for personal use.</p>
                            </div>
                        </label>

                        <label className="flex-1">
                            <input className="peer sr-only" type="radio" name="plan" value="Pro" />
                            <div className="border rounded-lg p-4 flex flex-col gap-2 peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Pro</span>
                                    <span className="text-sm text-gray-500">$12/mo</span>
                                </div>
                                <p className="text-xs text-gray-600">Advanced tools and higher limits.</p>
                            </div>
                        </label>

                        <label className="flex-1">
                            <input className="peer sr-only" type="radio" name="plan" value="Enterprise" />
                            <div className="border rounded-lg p-4 flex flex-col gap-2 peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Enterprise</span>
                                    <span className="text-sm text-gray-500">$30/mo</span>
                                </div>
                                <p className="text-xs text-gray-600">All features + priority support.</p>
                            </div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span className="text-sm text-gray-700 mb-1">Email</span>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
                            />
                        </label>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">
                        By subscribing you agree to our terms. You can cancel anytime from your account settings.
                    </p>
                </form>
            </div>
        </div>
    );
}
