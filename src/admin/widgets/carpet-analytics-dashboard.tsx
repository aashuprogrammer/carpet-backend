import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, StatusBadge, Table, Button } from "@medusajs/ui"
import { Eye, ShoppingCart, TrendingUp, Package } from "lucide-react"
import { useEffect, useState } from "react"

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-base">
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-muted text-small uppercase">Revenue</Text>
            <Heading level="h3">
              {(data?.stats?.total_revenue / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </Heading>
          </div>
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-muted text-small uppercase">Orders</Text>
            <Heading level="h3">{data?.stats?.total_orders}</Heading>
          </div>
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-muted text-small uppercase">Customers</Text>
            <Heading level="h3">{data?.stats?.total_customers}</Heading>
          </div>
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-muted text-small uppercase">Products</Text>
            <Heading level="h3">{data?.stats?.total_products}</Heading>
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
