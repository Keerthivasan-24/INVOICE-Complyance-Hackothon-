import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Building2, DollarSign, FileText } from 'lucide-react';

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Read from localStorage since the backend is stateless
    const savedResult = localStorage.getItem("latestInvoiceResult");
    if (savedResult) {
      const parsed = JSON.parse(savedResult);
      const invoicesArray = Array.isArray(parsed.invoices) ? parsed.invoices : [parsed];
      const found = invoicesArray.find(inv => (inv.document_id || inv.id) === id);
      setInvoice(found);
    }
  }, [id]);

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
          <Link to="/dashboard" className="text-blue-600 hover:underline flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const confidenceScore = Math.round((invoice.confidence_score || 0) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-100 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_number || 'Unknown Invoice'}</h1>
                <p className="text-gray-500">Document ID: {invoice.document_id}</p>
              </div>
            </div>
            <div>
              {invoice.validation_status === 'valid' ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valid
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Needs Review
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <Building2 className="w-4 h-4 mr-2" />
                Seller Information
              </h3>
              <p className="text-lg font-semibold text-gray-900">{invoice.seller_name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <Building2 className="w-4 h-4 mr-2" />
                Buyer Information
              </h3>
              <p className="text-lg font-semibold text-gray-900">{invoice.buyer_name || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{invoice.subtotal || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Amount</span>
                <span className="font-medium">₹{invoice.tax_amount || '0.00'}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-1" /> Total Amount
                </span>
                <span className="text-xl font-bold text-blue-600">₹{invoice.total_amount || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Extraction Confidence</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  confidenceScore >= 80 ? 'bg-green-500' : 
                  confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>

          {invoice.validation_errors && invoice.validation_errors.length > 0 && (
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="text-sm font-bold text-red-800 flex items-center mb-3">
                <AlertCircle className="w-4 h-4 mr-2" />
                Validation Errors
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {invoice.validation_errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;