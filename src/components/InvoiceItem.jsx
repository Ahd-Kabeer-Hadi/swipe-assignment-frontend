import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { BiPencil, BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";
import { Dropdown } from "react-bootstrap";
import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";
import ProductFormModal from "./ProductFormModal";

const InvoiceItem = (props) => {
  const {
    onItemizedItemEdit,
    currency,
    onRowDel,
    items,
    onRowAdd,
    onProductAdd,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const addFromProducts = (selectedProducts) => {
    onProductAdd(selectedProducts);
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const itemTable = items.map((item) => (
    <ItemRow
      key={item.id}
      item={item}
      onDelEvent={onRowDel}
      onItemizedItemEdit={onItemizedItemEdit}
      currency={currency}
    />
  ));

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTY</th>
            <th>PRICE/RATE</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>{itemTable}</tbody>
      </Table>
      <Dropdown>
        <Dropdown.Toggle
          variant="primary"
          id="dropdown-basic"
          className="fw-bold"
        >
          Add Item
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onRowAdd}>Add Manually</Dropdown.Item>
          <Dropdown.Item onClick={() => setIsOpen(true)}>
            Add from Products
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div>
        <ProductModal
          showModal={isOpen}
          closeModal={closeModal}
          onProductAdd={(evt) => addFromProducts(evt)}
          mode="add"
        ></ProductModal>
      </div>
    </div>
  );
};

const ItemRow = (props) => {
  const [openProductForm, setOpenProductForm] = useState(false);

  const onDelEvent = () => {
    props.onDelEvent(props.item);
  };
  const onEditProduct = () => {
    setOpenProductForm(true);
  };
  const updateFormData = (newData) => {
    
    props.onItemizedItemEdit(newData, props.item.itemId);
    
  };
  return (
    <>
      <tr>
        <td style={{ width: "100%" }}>
          <EditableField
            onItemizedItemEdit={(evt) =>
              props.onItemizedItemEdit(evt, props.item.itemId)
            }
            cellData={{
              type: "text",
              name: "itemName",
              placeholder: "Item name",
              value: props.item.itemName,
              id: props.item.itemId,
              disabled: props.item.productId ? true : false,
            }}
          />
          <EditableField
            onItemizedItemEdit={(evt) =>
              props.onItemizedItemEdit(evt, props.item.itemId)
            }
            cellData={{
              type: "text",
              name: "itemDescription",
              placeholder: "Item description",
              value: props.item.itemDescription,
              id: props.item.itemId,
              disabled: props.item.productId ? true : false,
            }}
          />
          <EditableField
            onItemizedItemEdit={(evt) =>
              props.onItemizedItemEdit(evt, props.item.itemId)
            }
            cellData={{
              type: "text",
              name: "itemCategory",
              placeholder: "Item Category",
              value: props.item.itemCategory,
              id: props.item.itemId,
            }}
          />
        </td>
        <td style={{ minWidth: "70px" }}>
          <EditableField
            onItemizedItemEdit={(evt) =>
              props.onItemizedItemEdit(evt, props.item.itemId)
            }
            cellData={{
              type: "number",
              name: "itemQuantity",

              min: 1,
              step: "1",
              value: props.item.itemQuantity,
              id: props.item.itemId,
            }}
          />
        </td>
        <td style={{ minWidth: "130px" }}>
          <EditableField
            onItemizedItemEdit={(evt) =>
              props.onItemizedItemEdit(evt, props.item.itemId)
            }
            cellData={{
              leading: props.currency,
              type: "number",
              name: "itemPrice",
              min: 1,
              step: "0.01",
              presicion: 2,
              textAlign: "text-end",
              value: props.item.itemPrice,
              id: props.item.itemId,
              disabled: props.item.productId ? true : false,
            }}
          />
        </td>
        <td
          className="text-center d-flex flex-column gap-2"
          style={{ minWidth: "50px" }}
        >
          {props.item.productId ? (
            <>
              <BiPencil
                onClick={onEditProduct}
                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                className="text-white mt-1 btn btn-success"
              />
              <BiTrash
                onClick={onDelEvent}
                style={{ height: "33px", width: "33px", padding: "7.5px" }}
                className="text-white mt-1 btn btn-danger"
              />
            </>
          ) : (
            <BiTrash
              onClick={onDelEvent}
              style={{ height: "33px", width: "33px", padding: "7.5px" }}
              className="text-white mt-1 btn btn-danger"
            />
          )}
        </td>
      </tr>
      {props.item.productId ? (
        <ProductFormModal
          showModal={openProductForm}
          productId={props.item.productId}
          onUpdatePoduct={updateFormData}
          mode="edit"
          closeModal={() => setOpenProductForm(false)}
        />
      ) : null}
    </>
  );
};

export default InvoiceItem;
