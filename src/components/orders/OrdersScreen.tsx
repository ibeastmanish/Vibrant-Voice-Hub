import { motion } from "framer-motion";
import { Package, Clock, CheckCircle } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export const OrdersScreen = () => {
    const { activeOrder } = useAppContext();

    const mockPastOrders = [
        { id: "ORD-8923", item: "Noise-Cancelling Headphones", date: "May 12, 2026", status: "Delivered", price: "$299.00" },
        { id: "ORD-7104", item: "Ergonomic Office Chair", date: "April 04, 2026", status: "Delivered", price: "$450.00" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto space-y-8"
        >
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Order History</h2>
                <p className="text-white/60">Track and manage your recent purchases.</p>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white/90 border-b border-white/10 pb-2">Active Orders</h3>
                
                {activeOrder ? (
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                {activeOrder.status}
                            </span>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <Package size={32} className="text-white/80" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{activeOrder.item}</h4>
                                <p className="text-white/60 mb-4">Order ID: {activeOrder.id} • Total: {activeOrder.price}</p>
                                
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock size={16} className="text-blue-400" />
                                    <span className="text-blue-400 font-medium">Estimated Delivery: Tomorrow by 8 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/50">
                        No active orders at this time.
                    </div>
                )}
            </div>

            <div className="space-y-6 pt-4">
                <h3 className="text-xl font-semibold text-white/90 border-b border-white/10 pb-2">Past Orders</h3>
                
                <div className="grid gap-4">
                    {mockPastOrders.map((order) => (
                        <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <CheckCircle size={24} className="text-green-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white">{order.item}</h4>
                                    <p className="text-white/50 text-sm">Order ID: {order.id} • {order.date}</p>
                                </div>
                            </div>
                            <div className="md:text-right">
                                <div className="text-lg font-bold text-white">{order.price}</div>
                                <div className="text-green-400 text-sm font-medium">{order.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
