import { Button, Card, Table } from "react-bootstrap";
import { useProductListData } from "../redux/hooks";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { deleteProduct } from "../redux/productsSlice";
import { useDispatch } from "react-redux";
import { BsEyeFill } from "react-icons/bs";
import { useState } from "react";
import ProductModal from "./ProductModal";
import ProductFormModal from "./ProductFormModal";

const ProductList = () => {
  const { productList } = useProductListData();
  const isListEmpty = productList.length === 0;
  const [openProductForm, setOpenProductForm] = useState(false);
  const addNewProduct = () => {
    setOpenProductForm(true);
  };

  const closeModal = () => {
    setOpenProductForm(false);
  };

  return (
    <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
      {isListEmpty ? (
        <div className="d-flex flex-column align-items-center">
          <h3 className="fw-bold pb-2 pb-md-4">No products available</h3>

          <Button variant="primary" onClick={addNewProduct}>
            Add Product
          </Button>

          <ProductFormModal
            showModal={openProductForm}
            mode="add"
            closeModal={closeModal}
          />
        </div>
      ) : (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row align-items-center justify-content-between">
            <h3 className="fw-bold pb-2 pb-md-4">Product List</h3>

            <Button variant="primary mb-2 mb-md-4" onClick={addNewProduct}>
              Add New Product
            </Button>
          </div>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <ProductRow key={product.id} product={product} index={index} />
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Card>
  );
};
export default ProductList;
const ProductRow = ({ product, index }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);

  const handleEditClick = () => {
    setOpenProductForm(true);
  };

  const handleDeleteClick = (productId) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      dispatch(deleteProduct(productId));
    }
  };

  const openModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeProductForm = () => {
    setOpenProductForm(false);
  };

  return (
    <>
      <tr key={product.id} className="align-middle">
        <td>{index + 1}</td>
        <td>{product.id}</td>
        <td>{product.name}</td>
        <td className="line-breaks">{product.description}</td>
        <td>{product.price}</td>
        <td
          style={{ width: "90%" }}
          className="d-flex align-items-center justify-content-around"
        >
          <Button
            variant="outline-secondary"
            onClick={openModal}
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <BsEyeFill />
          </Button>
          <Button
            size="sm"
            onClick={handleEditClick}
            variant="outline-primary"
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <BiSolidPencil />
          </Button>
          <Button
            size="sm"
            onClick={() => handleDeleteClick(product.id)}
            variant="outline-danger"
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <BiTrash />
          </Button>
        </td>
      </tr>
      <ProductFormModal
        showModal={openProductForm}
        mode="edit"
        productId={product.id}
        closeModal={closeProductForm}
      />

      <ProductModal showModal={showModal} closeModal={closeModal} mode="view" />
    </>
  );
};
