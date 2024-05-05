import { useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../redux/productsSlice";
import { updateInvoice } from "../redux/invoicesSlice";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData, useProductListData } from "../redux/hooks";

export default function ProductFormModal(props) {
  const dispatch = useDispatch();

  const isEdit = props.mode && props.mode === "edit" ? true : false;

  const { getOneProduct } = useProductListData();
  const { invoiceList } = useInvoiceListData();
  const [editedFields, setEditedFields] = useState([]);

  const [formData, setFormData] = useState(
    isEdit
      ? getOneProduct(props.productId)
      : {
          name: "",
          description: "",
          price: "",
          id: generateRandomId(),
        }
  );

  const resetForm = () => {
    if (!isEdit) {
      setFormData({
        name: "",
        description: "",
        price: "",
        id: generateRandomId(),
      });
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleFormFields = (product) => {
    if (editedFields.length > 0) {
      let updatingField = {
        target: {
          name: "name",
          value: "value",
        },
      };
      editedFields.forEach((field) => {
        if (field === "name") {
          updatingField.target.name = "itemName";
          updatingField.target.value = product.name;

          props.onUpdatePoduct(updatingField);
        } else if (field === "description") {
          updatingField.target.name = "itemDescription";
          updatingField.target.value = product.description;
          props.onUpdatePoduct(updatingField);
        } else if (field === "price") {
          updatingField.target.name = "itemPrice";
          updatingField.target.value = product.price;
          props.onUpdatePoduct(updatingField);
        }
      });
    }
  };

  const confirm = () => {
    return window.confirm(
      "Are you sure? This is a product. This will overwrite the product details along with other invoices associated with this product."
    );
  };

  const updateProductInInvoices = (product) => {
    dispatch(updateProduct({ id: product.id, updatedProduct: product }));
    invoiceList.forEach((invoice) => {
      const { items = [], taxRate, discountRate } = invoice;
      const updatingItems = items.map((item) => {
        if (item.productId && item.productId === product.id) {
          if (!confirm()) return item;

         return {
            ...item,
            itemName: product.name,
            itemDescription: product.description,
            itemPrice: product.price,
          };
          // return (item = updatingItem);
        }
        return item;
      });

      let subTotal = 0;

      updatingItems.forEach((item) => {
        subTotal +=
          parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      })

      const taxAmount = parseFloat(subTotal * (taxRate / 100)).toFixed(2);
      const discountAmount = parseFloat(subTotal * (discountRate / 100)).toFixed(2);
      const total = (subTotal + parseFloat(taxAmount) - parseFloat(discountAmount)).toFixed(2);

      const updatedInvoice = {
        ...invoice,
        items: updatingItems,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total
      }


      console.log(updatedInvoice);
      dispatch(
        updateInvoice({ id: invoice.id, updatedInvoice: updatedInvoice })
      );
    });
    if (props.onUpdatePoduct) {
      handleFormFields(product);
    }

    props.closeModal();
    return alert("Product updated successfully");
  };

  const handleAddProduct = () => {
    if (isEdit) {
      updateProductInInvoices(formData);
    } else {
      dispatch(addProduct({ id: generateRandomId(), ...formData }));
      alert("Product added successfuly 🥳");
    }
  };
  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setEditedFields([...editedFields, name]);
  };
  const openModal = (event) => {
    event.preventDefault();
    setEditedFields([]);
  };

  return (
    <div>
      <Modal
        show={props.showModal}
        onHide={props.closeModal}
        size="lg"
        centered
      >
        <Form onSubmit={openModal}>
          <Row>
            <Col md={12} lg={12}>
              <Card className="p-4 p-xl-5 my-3 my-xl-4 border-0">
                <div className="d-flex flex-column align-items-start justify-content-between mb-3">
                  <Col md={12} lg={12} className="w-100 mb-5">
                    <h3>{isEdit ? "Update Product" : "Add new Product"}</h3>
                  </Col>

                  <Col
                    md={12}
                    lg={12}
                    className="d-flex  flex-column mb-4 w-100"
                  >
                    <Form.Label className="fw-bold">Product name:</Form.Label>
                    <Form.Control
                      placeholder="Product's name here"
                      rows={3}
                      value={formData.name}
                      type="text"
                      name="name"
                      className="my-2"
                      onChange={(e) => {
                        editField(e.target.name, e.target.value);
                        handleSubmit(e);
                      }}
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddProduct();
                      }}
                      className="d-block w-100 mb-2"
                      type="submit"
                    >
                      {isEdit ? "Update Product" : "Add Product"}
                    </Button>

                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        resetForm();
                        props.closeModal();
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
      </Modal>
    </div>
  );
}
