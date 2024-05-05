import { useState } from "react";
import { Button, Card, Col, Form,  Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addProduct, updateProduct } from "../redux/productsSlice";
import { updateInvoice } from "../redux/invoicesSlice";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData, useProductListData } from "../redux/hooks";

const ProductForm = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  const params =  useParams();
  const isEdit =  location.pathname.includes("update");

  const navigate = useNavigate();
  const { getOneProduct } = useProductListData();
  const { invoiceList } = useInvoiceListData();

  const [formData, setFormData] = useState(
    isEdit
      ? getOneProduct(params.id)
      : {
          name: "",
          description: "",
          price: "",
          id: generateRandomId(),
        }
  );
  const updateProductInInvoices = (product) => {
    dispatch(updateProduct({ id: product.id, updatedProduct: product }));
    const updatedInvoices = [];
    invoiceList.forEach((invoice) => {
      const { items = [] } = invoice;
      const updatingItems = items.map((item) => {
        if (item.productId && item.productId === product.id) {
          const updatingItem = {
            itemName: product.name,
            itemDescription: product.description,
            itemPrice: product.price,
            itemQuantity: item.quantity,
            productId: product.id,
          };
          return (item = updatingItem);
        }
        return item;
      });

      const updatedInvoice = { ...invoice, items: updatingItems };

      dispatch(
        updateInvoice({ id: invoice.id, updatedInvoice: updatedInvoice })
      );

      updatedInvoices.push(updatedInvoice);
    });

    return alert("Product updated successfully");
  };

  const handleAddProduct = () => {
    if (isEdit) {
      updateProductInInvoices(formData);
    } else {
      dispatch(addProduct({ id: generateRandomId(), ...formData }));
      alert("Product added successfuly 🥳");
    }
    navigate("/");
  };
  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const openModal = (event) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={12} lg={12}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-column align-items-start justify-content-between mb-3">
              <Col md={12} lg={12} className="w-100 mb-5">
                <h3>{isEdit ? "Update Product" : "Add new Product"}</h3>
              </Col>

              <Col md={12} lg={12} className="d-flex  flex-column mb-4 w-100">
                <Form.Label className="fw-bold">Product name:</Form.Label>
                <Form.Control
                  placeholder="Product's name here"
                  rows={3}
                  value={formData.name}
                  type="text"
                  name="name"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />

                <Form.Label className="fw-bold">
                  Product description:
                </Form.Label>
                <Form.Control
                  placeholder="Product's Description here"
                  rows={3}
                  value={formData.description}
                  type="text"
                  name="description"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="description"
                  required
                />
                <Form.Label className="fw-bold">Price:</Form.Label>
                <Form.Control
                  placeholder="Price here"
                  rows={3}
                  value={formData.price}
                  type="number"
                  name="price"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
              </Col>
              <Col className="d-flex flex-column align-items-center my-3 w-100 gap-4 justify-content-between">
                <Button
                  variant="dark"
                  onClick={handleAddProduct}
                  className="d-block w-100 mb-2"
                  type="submit"
                >
                  {isEdit ? "Update Product" : "Add Product"}
                </Button>

                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                  className="d-block w-100 mb-2"
                >
                  Cancel
                </Button>
              </Col>
            </div>
          </Card>
        </Col>
      </Row>
    </Form>
    
  );
};

export default ProductForm;
