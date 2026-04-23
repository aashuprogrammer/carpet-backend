import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Table } from "@medusajs/ui";

const ProductMetadataWidget = ({ data }: any) => {
  const metadata = data?.metadata || {};

  if (Object.keys(metadata).length === 0) {
    return null;
  }

  return (
    <Container className="p-8">
      <Heading level="h2" className="mb-4">Carpet Attributes</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Attribute</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(metadata).map(([key, value]: [string, any]) => (
            <Table.Row key={key}>
              <Table.Cell className="font-semibold capitalize">{key.replace("_", " ")}</Table.Cell>
              <Table.Cell>{value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductMetadataWidget;
