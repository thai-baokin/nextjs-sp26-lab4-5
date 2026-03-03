"use client";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    total_price: number;
    items: OrderItem[];
    status: string;
    created_at: string;
}

export function OrderCard({ order }: { order: Order }) {
    const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = new Date(order.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none dark:hover:border-white/20 transition-all duration-300 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {formattedDate} at {formattedTime}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
                    }`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${order.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {/* Total */}
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ${Number(order.total_price).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Card Items */}
            <div className="px-6 py-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                    {order.items.length} Item{order.items.length !== 1 ? "s" : ""}
                </p>
                <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center size-5 rounded bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-900 dark:text-white">
                                    {item.quantity}
                                </span>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
