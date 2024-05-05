import React, { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "./InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  return (
    <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
      {isListEmpty ? (
        <div className="d-flex flex-column align-items-center">
          <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
          <Link to="/create">
            <Button variant="primary">Create Invoice</Button>
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column">
          <div className="d-flex flex-row align-items-center justify-content-between">
            <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
            <Link to="/create">
              <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
            </Link>

            
          </div>
          <Table responsive>
            <thead>
              <tr className="w-100">
                <th style={{ width: "15%" }}>Invoice No.</th>
                <th>Invoice Id</th>
                <th>Bill To</th>
                <th>Due Date</th>
                <th>Total Amt.</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  navigate={navigate}
                />
              ))}
            </tbody>
          </Table>
          <div className="d-flex gap-1 align-items-center pt-2  justify-content-end">
              <input
                type="text"
                value={copyId}
                onChange={(e) => setCopyId(e.target.value)}
                placeholder="Enter Invoice ID to copy"
                className="bg-white border rounded p-2 mb-2 mb-md-4"
              />
              <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                Copy Invoice
              </Button>
            </div>
        </div>
      )}
    </Card>
  );
};

const InvoiceRow = ({ invoice, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    // can be added as a popup but kept it like this for now to maintain current practice
    if (window.confirm("Are you sure? This cannot be undone.")) {
      dispatch(deleteInvoice(invoiceId));
    }
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <tr className="align-middle">
        <td style={{ width: "15%" }}>{invoice.invoiceNumber}</td>
        <td className="fw-normal">{invoice.id}</td>
        <td className="fw-normal">{invoice.billTo}</td>
        <td className="fw-normal">{invoice.dateOfIssue}</td>
        <td className="fw-normal">
          {invoice.currency}
          {invoice.total}
        </td>
        <td className="d-flex align-items-center justify-content-around">
          <Button
            variant="outline-primary"
            onClick={handleEditClick}
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <BiSolidPencil />
          </Button>

          <Button
            variant="danger"
            onClick={() => handleDeleteClick(invoice.id)}
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <BiTrash />
          </Button>

          <Button
            variant="secondary"
            onClick={openModal}
            className="d-flex align-items-center justify-content-center gap-2"
          >
            <BsEyeFill />
          </Button>
        </td>
      </tr>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </>
  );
};

export default InvoiceList;
