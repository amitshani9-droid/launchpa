import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="py-12 text-white bg-gray-900 border-t border-gray-800">
            <div className="container px-6 mx-auto grid md:grid-cols-4 gap-8">
                <div>
                    <h3 className="mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
                        Nano Banana
                    </h3>
                    <p className="text-gray-400">Future of Freshness. Cold-pressed, scientifically optimized nutrition.</p>
                </div>
                <div>
                    <h4 className="mb-4 text-lg font-semibold">Shop</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/" className="hover:text-orange-400 transition-colors">All Flavors</Link></li>
                        <li><Link href="#" className="hover:text-orange-400 transition-colors">Bundles</Link></li>
                        <li><Link href="#" className="hover:text-orange-400 transition-colors">Subscription</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-lg font-semibold">Support</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="#" className="hover:text-orange-400 transition-colors">FAQ</Link></li>
                        <li><Link href="#" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
                        <li><Link href="#" className="hover:text-orange-400 transition-colors">Shipping Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 text-lg font-semibold">Newsletter</h4>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email" className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white" />
                        <button className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">Go</button>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 text-center text-gray-600 border-t border-gray-800">
                © {new Date().getFullYear()} Nano Banana. All rights reserved.
            </div>
        </footer>
    );
}
