export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalShell } from '@/components/portal/PortalShell'
import { Bot, Shield, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { UsageMeter } from '@/components/portal/UsageMeter'

const products = [
  {
    name: 'ChatKit',
    description: 'AI-powered chatbots for your website',
    icon: Bot,
    href: '/portal/chatkit',
    color: 'from-purple-500 to-pink-500',
    status: 'active' as const,
  },
  {
    name: 'SignaKit',
    description: 'Authentication & user management',
    icon: Shield,
    href: '/portal/signakit',
    color: 'from-cyan-500 to-blue-500',
    status: 'coming_soon' as const,
  },
  {
    name: 'TradeKit',
    description: 'Trading signals & analytics',
    icon: BarChart3,
    href: '/portal/tradekit',
    color: 'from-green-500 to-emerald-500',
    status: 'coming_soon' as const,
  },
]

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Fetch customer profile
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch active products
  const { data: customerProducts } = await supabase
    .from('customer_products')
    .select('*')
    .eq('customer_id', user.id)

  const firstName = customer?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  return (
    <PortalShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Welcome, {firstName}</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your products and services</p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(product => {
            const enrolled = customerProducts?.find(cp => cp.product === product.name.toLowerCase().replace('kit', 'kit'))
            return (
              <Link
                key={product.name}
                href={product.href}
                className="bg-[#0d0d20] border border-white/5 rounded-xl p-5 hover:border-purple-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                    <product.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      {product.name}
                    </h3>
                    {product.status === 'coming_soon' && (
                      <span className="text-[10px] text-gray-500">Coming soon</span>
                    )}
                    {enrolled && (
                      <span className="text-[10px] text-green-400">{enrolled.plan} plan</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{product.description}</p>
              </Link>
            )
          })}
        </div>

        {/* ChatKit Usage */}
        {customerProducts?.find(cp => cp.product === 'chatkit') && (
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">ChatKit Free Tier</h2>
            <UsageMeter customerId={user.id} product="chatkit" />
          </div>
        )}

        {/* Quick stats */}
        {customerProducts && customerProducts.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-3">Active Products</h2>
            <div className="bg-[#0d0d20] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-gray-500">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {customerProducts.map(cp => (
                    <tr key={cp.id} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-3 text-white capitalize">{cp.product}</td>
                      <td className="px-4 py-3 text-gray-400 capitalize">{cp.plan}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          cp.status === 'active'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {cp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(cp.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PortalShell>
  )
}
