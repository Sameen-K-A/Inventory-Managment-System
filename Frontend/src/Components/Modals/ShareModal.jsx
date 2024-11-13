import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaPrint, FaFilePdf, FaFileExcel, FaEnvelope } from "react-icons/fa";
import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import printJS from 'print-js';
import baseAxios from "../../Config/jwtInterceptor";

const ShareModal = ({ setShowShareModal, tableRef, sales }) => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = () => {
    setShowEmailInput(false);
    const doc = new jsPDF();
    autoTable(doc, { html: tableRef.current });
    doc.save("sales_report.pdf");
  };

  const downloadExcel = () => {
    setShowEmailInput(false);
    const tableData = tableRef.current;
    const wb = XLSX.utils.table_to_book(tableData);
    XLSX.writeFile(wb, "sales_report.xlsx");
  };

  const handlePrint = () => {
    setShowEmailInput(false);
    printJS({
      printable: tableRef.current,
      type: 'html',
      targetStyles: ['*'],
    });
  };

  const handleSendEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enteredEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await baseAxios.post("/sendSalestoEmail", { enteredEmail, sales });
      toast.success(`Report sent to ${enteredEmail} successfully`);
      setEnteredEmail("");
      setShowShareModal(false);
      setShowEmailInput(false);
    } catch (error) {
      toast.error("Failed to send the report to email");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title">Share</h5>
                <IoIosCloseCircleOutline fill="black" size={24} onClick={() => setShowShareModal(false)} style={{ cursor: "pointer" }} />
              </div>
              <div className="d-flex gap-2 justify-content-around mt-4 mb-3">
                <button className="btn btn-light custom-btn print-btn" onClick={handlePrint}>
                  <FaPrint className="me-2" />
                  Print
                </button>
                <button className="btn btn-light custom-btn pdf-btn" onClick={downloadPDF}>
                  <FaFilePdf className="me-2" />
                  PDF
                </button>
                <button className="btn btn-light custom-btn excel-btn" onClick={downloadExcel}>
                  <FaFileExcel className="me-2" />
                  Excel
                </button>
                <button className="btn btn-light custom-btn email-btn" onClick={() => setShowEmailInput((prev) => !prev)}>
                  <FaEnvelope className="me-2" />
                  Share via Email
                </button>
              </div>
              {showEmailInput && (
                <div className="d-flex gap-2 align-items-center mt-4 mb-3 email-input-group">
                  <input type="email" className="form-control" placeholder="Enter email address" onChange={(e) => setEnteredEmail(e.target.value)} />
                  <button className="btn btn-primary" onClick={handleSendEmail} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Send"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;