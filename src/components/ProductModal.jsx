import { Button, Modal, Table } from "react-bootstrap";
import { useProductListData } from "../redux/hooks";

const ProductModal = (props) => {
  const { productList } = useProductListData();
  const addedProducts = [];
  const addToInvoice = (productId) => {
    addedProducts.push(productId);
  };
  const removeFromInvoice = (productId) => {
    addedProducts.splice(addedProducts.indexOf(productId), 1);
  };

  return (
    <div>
      <Modal
        show={props.showModal}
        onHide={props.closeModal}
        size="lg"
        centered
      >
        <div className="p-4">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
            </div>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>PRODUCT ID</th>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product, i) => {
                  return (
                    <tr id={product.id} key={i}>
                      <td>
                        {props.mode === "add" ? (
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              if (event.target.checked) {
                                addToInvoice(product.id);
                              } else {
                                removeFromInvoice(product.id);
                              }
                            }}
                          />
                        ) : (
                          i + 1
                        )}
                      </td>
                      <td>{product.id}</td>
                      <td>{product.name} </td>
                      <td
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          lineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: "2.1rem",
                        }}
                      >
                        {product.description}
                      </td>

                      <td>{product.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end mt-4 gap-2">
              {props.mode === "add" ? (
                <Button
                  className="px-4"
                  variant="primary"
                  onClick={(event) => {
                    event.preventDefault();
                    props.onProductAdd(addedProducts);
                    props.closeModal();
                  }}
                >
                  Add
                </Button>
              ) : null}
              <Button
                className="px-4"
                variant="outline-secondary"
                onClick={(event) => {
                  event.preventDefault();
                  props.closeModal();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductModal;
