import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, StatusBadge, Table, Button } from "@medusajs/ui"
import { Eye, ShoppingCart, TrendingUp, Package, BarChart2 } from "lucide-react"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts"

const CarpetAnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/admin/analytics")
        if (response.ok) {
          const json = await response.json()
          setData(json)
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <Text>Loading analytics...</Text>

  const topViewed = data?.top_viewed || []
  const topCarted = data?.top_added_to_cart || []

  return (
    <div className="flex flex-col gap-y-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-base gap-y-base">
        <Container>
          <div className="flex items-center gap-x-2 mb-4">
            <Eye className="text-ui-fg-subtle" size={18} />
            <Heading level="h2">Most Viewed Carpets</Heading>
          </div>
          {topViewed.length === 0 ? (
            <Text className="text-ui-fg-muted">No data yet</Text>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Product</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Views</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {topViewed.slice(0, 5).map((item: any) => (
                  <Table.Row key={item.product_id}>
                    <Table.Cell>
                      <div className="flex items-center gap-x-2">
                        {item.product?.thumbnail && (
                          <img 
                            src={item.product.thumbnail} 
                            className="h-8 w-8 rounded-sm object-cover" 
                            alt=""
                          />
                        )}
                        <Text>{item.product?.title || "Unknown"}</Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <StatusBadge color="blue">{item.count}</StatusBadge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Container>

        <Container>
          <div className="flex items-center gap-x-2 mb-4">
            <ShoppingCart className="text-ui-fg-subtle" size={18} />
            <Heading level="h2">Most Added to Cart</Heading>
          </div>
          {topCarted.length === 0 ? (
            <Text className="text-ui-fg-muted">No data yet</Text>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Product</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Adds</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {topCarted.slice(0, 5).map((item: any) => (
                  <Table.Row key={item.product_id}>
                    <Table.Cell>
                      <div className="flex items-center gap-x-2">
                        {item.product?.thumbnail && (
                          <img 
                            src={item.product.thumbnail} 
                            className="h-8 w-8 rounded-sm object-cover" 
                            alt=""
                          />
                        )}
                        <Text>{item.product?.title || "Unknown"}</Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <StatusBadge color="green">{item.count}</StatusBadge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Container>
      </div>

      <Container>
        <div className="flex items-center gap-x-2 mb-4">
          <TrendingUp className="text-ui-fg-subtle" size={18} />
          <Heading level="h2">Store Performance Overview</Heading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-base mb-8">
          <div className="flex flex-col gap-y-1 p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
            <Text className="text-ui-fg-muted text-small uppercase">Revenue</Text>
            <Heading level="h3">
              {(data?.stats?.total_revenue / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Heading>
          </div>
          <div className="flex flex-col gap-y-1 p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
            <Text className="text-ui-fg-muted text-small uppercase">Orders</Text>
            <Heading level="h3">{data?.stats?.total_orders}</Heading>
          </div>
          <div className="flex flex-col gap-y-1 p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
            <Text className="text-ui-fg-muted text-small uppercase">Customers</Text>
            <Heading level="h3">{data?.stats?.total_customers}</Heading>
          </div>
          <div className="flex flex-col gap-y-1 p-4 bg-ui-bg-base border border-ui-border-base rounded-lg">
            <Text className="text-ui-fg-muted text-small uppercase">Products</Text>
            <Heading level="h3">{data?.stats?.total_products}</Heading>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-base">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-ui-bg-base border border-ui-border-base rounded-lg p-4">
            <div className="flex items-center gap-x-2 mb-6">
              <BarChart2 className="text-ui-fg-subtle" size={18} />
              <Heading level="h3">Revenue & Orders Trend</Heading>
            </div>
            {data?.chart_data?.length > 0 ? (
              <div style={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis yAxisId="left" stroke="#4F46E5" fontSize={12} tickFormatter={(val) => `$${val}`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      formatter={(value: number, name: string) => [name === "revenue" ? `$${value}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#4F46E5" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-ui-fg-muted">
                Not enough data to display trends. Seed the database to see charts.
              </div>
            )}
          </div>

          {/* Order Status Distribution */}
          <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-4">
            <div className="flex items-center gap-x-2 mb-6">
              <Package className="text-ui-fg-subtle" size={18} />
              <Heading level="h3">Order Status Distribution</Heading>
            </div>
            {data?.order_status_distribution?.length > 0 ? (
              <div style={{ height: 300, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.order_status_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.order_status_distribution.map((entry: any, index: number) => {
                        const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6B7280"];
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ")]} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-ui-fg-muted">
                No orders yet.
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.after",
})

export default CarpetAnalyticsDashboard
