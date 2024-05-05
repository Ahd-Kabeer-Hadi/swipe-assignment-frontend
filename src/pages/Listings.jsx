import { Col, Row } from "react-bootstrap";
import InvoiceList from "../components/InvoiceList";
import ProductList from "../components/ProductList";

const Listings = () => {
  // I'm not entirely clear on the requirement at this point, especially in regards to the items in the existing invoices and the new product tab that is being added.concerns about whether they are the same or not.
  // therefore, for the purposes of this assignment, I'm going to treat the product as an independent entity that can be added to invoices when creating it.
  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
      </Col>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <InvoiceList />
      </Col>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <ProductList />
      </Col>
    </Row>
  );
};

export default Listings;
