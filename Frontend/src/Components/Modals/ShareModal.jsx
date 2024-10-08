import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaPrint, FaFilePdf, FaFileExcel, FaEnvelope } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import printJS from 'print-js';

const ShareModal = ({ setShowShareModal, tableRef }) => {
  const [showEmailInput, setShowEmailInput] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: tableRef.current });
    doc.save("sales_report.pdf");
  };

  const downloadExcel = () => {
    const tableData = tableRef.current;
    const wb = XLSX.utils.table_to_book(tableData);
    XLSX.writeFile(wb, "sales_report.xlsx");
  };

  const handlePrint = () => {
    printJS({
      printable: tableRef.current,
      type: 'html',
      targetStyles: ['*'],
    });
  };

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
                <button className="btn btn-light custom-btn" onClick={handlePrint}>
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
                <button className="btn btn-light custom-btn email-btn" onClick={() => setShowEmailInput(true)}>
                  <FaEnvelope className="me-2" />
                  Share via Email
                </button>
              </div>
              {showEmailInput && (
                <div className="d-flex gap-2 align-items-center mt-4 mb-3 email-input-group">
                  <input type="email" className="form-control" placeholder="Enter email address" />
                  <button className="btn btn-primary">Send</button>
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