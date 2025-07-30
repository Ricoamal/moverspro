// M-Pesa B2C Integration Service for Staff Payments
import axios from 'axios';

class MpesaService {
  constructor() {
    // M-Pesa API Configuration
    this.config = {
      consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || 'your_consumer_key',
      consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'your_consumer_secret',
      environment: import.meta.env.VITE_MPESA_ENVIRONMENT || 'sandbox', // sandbox or production
      shortcode: import.meta.env.VITE_MPESA_SHORTCODE || '174379', // Your business shortcode
      initiatorName: import.meta.env.VITE_MPESA_INITIATOR_NAME || 'testapi',
      securityCredential: import.meta.env.VITE_MPESA_SECURITY_CREDENTIAL || 'your_security_credential',
      queueTimeOutURL: import.meta.env.VITE_MPESA_QUEUE_TIMEOUT_URL || 'https://your-domain.com/mpesa/timeout',
      resultURL: import.meta.env.VITE_MPESA_RESULT_URL || 'https://your-domain.com/mpesa/result'
    };

    // API URLs
    this.baseURL = this.config.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    this.endpoints = {
      auth: '/oauth/v1/generate?grant_type=client_credentials',
      b2c: '/mpesa/b2c/v1/paymentrequest',
      accountBalance: '/mpesa/accountbalance/v1/query',
      transactionStatus: '/mpesa/transactionstatus/v1/query'
    };

    // Initialize payment history storage
    this.paymentHistory = this.loadPaymentHistory();
  }

  // Load payment history from localStorage
  loadPaymentHistory() {
    try {
      const stored = localStorage.getItem('moveease_mpesa_payments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading payment history:', error);
      return [];
    }
  }

  // Save payment history to localStorage
  savePaymentHistory() {
    try {
      localStorage.setItem('moveease_mpesa_payments', JSON.stringify(this.paymentHistory));
      return true;
    } catch (error) {
      console.error('Error saving payment history:', error);
      return false;
    }
  }

  // Generate access token
  async generateAccessToken() {
    try {
      const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
      
      const response = await axios.get(`${this.baseURL}${this.endpoints.auth}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        token: response.data.access_token,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Error generating access token:', error);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Format phone number for M-Pesa
  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    
    return cleaned;
  }

  // Validate phone number for M-Pesa
  isValidMpesaNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // M-Pesa supports Safaricom (7xx) and Airtel (1xx) numbers
    return /^254[17]\d{8}$/.test(formatted);
  }

  // Generate unique transaction reference
  generateTransactionRef() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `SAL${timestamp}${random}`;
  }

  // Single B2C Payment
  async sendB2CPayment(paymentData) {
    try {
      // Validate required fields
      if (!paymentData.phoneNumber || !paymentData.amount || !paymentData.employeeId) {
        throw new Error('Missing required payment data');
      }

      // Validate phone number
      const formattedPhone = this.formatPhoneNumber(paymentData.phoneNumber);
      if (!this.isValidMpesaNumber(formattedPhone)) {
        throw new Error('Invalid M-Pesa phone number');
      }

      // Validate amount (minimum KSh 10, maximum KSh 150,000)
      const amount = parseFloat(paymentData.amount);
      if (amount < 10 || amount > 150000) {
        throw new Error('Amount must be between KSh 10 and KSh 150,000');
      }

      // Get access token
      const tokenResult = await this.generateAccessToken();
      if (!tokenResult.success) {
        throw new Error(`Failed to get access token: ${tokenResult.error}`);
      }

      // Generate transaction reference
      const transactionRef = this.generateTransactionRef();

      // Prepare B2C request
      const b2cRequest = {
        InitiatorName: this.config.initiatorName,
        SecurityCredential: this.config.securityCredential,
        CommandID: 'SalaryPayment', // SalaryPayment, BusinessPayment, PromotionPayment
        Amount: Math.round(amount), // M-Pesa requires integer amounts
        PartyA: this.config.shortcode,
        PartyB: formattedPhone,
        Remarks: paymentData.remarks || `Salary payment for ${paymentData.employeeName}`,
        QueueTimeOutURL: this.config.queueTimeOutURL,
        ResultURL: this.config.resultURL,
        Occasion: paymentData.occasion || 'Salary Payment'
      };

      // For demo purposes, simulate the API call
      // In production, uncomment the actual API call below
      const simulatedResponse = await this.simulateB2CPayment(b2cRequest, transactionRef);
      
      /* 
      // Actual M-Pesa API call (uncomment for production)
      const response = await axios.post(`${this.baseURL}${this.endpoints.b2c}`, b2cRequest, {
        headers: {
          'Authorization': `Bearer ${tokenResult.token}`,
          'Content-Type': 'application/json'
        }
      });
      */

      // Create payment record
      const paymentRecord = {
        id: 'payment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        transactionRef,
        employeeId: paymentData.employeeId,
        employeeName: paymentData.employeeName,
        employeeNumber: paymentData.employeeNumber,
        phoneNumber: formattedPhone,
        amount: amount,
        currency: 'KSH',
        commandID: 'SalaryPayment',
        status: 'pending',
        initiatedAt: new Date().toISOString(),
        completedAt: null,
        mpesaReceiptNumber: null,
        responseCode: simulatedResponse.ResponseCode,
        responseDescription: simulatedResponse.ResponseDescription,
        conversationID: simulatedResponse.ConversationID,
        originatorConversationID: simulatedResponse.OriginatorConversationID,
        remarks: b2cRequest.Remarks,
        occasion: b2cRequest.Occasion,
        retryCount: 0,
        lastRetryAt: null,
        failureReason: null
      };

      // Save payment record
      this.paymentHistory.push(paymentRecord);
      this.savePaymentHistory();

      return {
        success: true,
        data: paymentRecord,
        message: 'Payment initiated successfully'
      };

    } catch (error) {
      console.error('B2C Payment Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to initiate payment'
      };
    }
  }

  // Simulate B2C payment for demo (remove in production)
  async simulateB2CPayment(request, transactionRef) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful response
    return {
      ConversationID: 'AG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 10),
      OriginatorConversationID: transactionRef,
      ResponseCode: '0',
      ResponseDescription: 'Accept the service request successfully.'
    };
  }

  // Bulk B2C Payments for Payroll
  async processBulkPayroll(payrollData) {
    try {
      const results = {
        successful: [],
        failed: [],
        total: payrollData.length,
        totalAmount: 0,
        successfulAmount: 0,
        failedAmount: 0
      };

      // Process payments in batches to avoid rate limiting
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < payrollData.length; i += batchSize) {
        batches.push(payrollData.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const batchPromises = batch.map(async (employee) => {
          try {
            const paymentData = {
              employeeId: employee.id,
              employeeName: employee.name,
              employeeNumber: employee.employeeNumber,
              phoneNumber: employee.mpesaNumber,
              amount: employee.netSalary,
              remarks: `Salary payment for ${employee.name} - ${new Date().toLocaleDateString()}`,
              occasion: 'Monthly Salary'
            };

            const result = await this.sendB2CPayment(paymentData);
            
            if (result.success) {
              results.successful.push({
                employee: employee,
                payment: result.data
              });
              results.successfulAmount += employee.netSalary;
            } else {
              results.failed.push({
                employee: employee,
                error: result.error
              });
              results.failedAmount += employee.netSalary;
            }

            results.totalAmount += employee.netSalary;

          } catch (error) {
            results.failed.push({
              employee: employee,
              error: error.message
            });
            results.failedAmount += employee.netSalary;
            results.totalAmount += employee.netSalary;
          }
        });

        // Wait for batch to complete before processing next batch
        await Promise.all(batchPromises);
        
        // Add delay between batches to respect rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Create bulk payment record
      const bulkPaymentRecord = {
        id: 'bulk_payment_' + Date.now(),
        processedAt: new Date().toISOString(),
        totalEmployees: results.total,
        successfulPayments: results.successful.length,
        failedPayments: results.failed.length,
        totalAmount: results.totalAmount,
        successfulAmount: results.successfulAmount,
        failedAmount: results.failedAmount,
        results: results
      };

      // Save bulk payment record
      const bulkHistory = this.loadBulkPaymentHistory();
      bulkHistory.push(bulkPaymentRecord);
      localStorage.setItem('moveease_bulk_payments', JSON.stringify(bulkHistory));

      return {
        success: true,
        data: bulkPaymentRecord,
        message: `Bulk payroll processed: ${results.successful.length} successful, ${results.failed.length} failed`
      };

    } catch (error) {
      console.error('Bulk Payroll Error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to process bulk payroll'
      };
    }
  }

  // Load bulk payment history
  loadBulkPaymentHistory() {
    try {
      const stored = localStorage.getItem('moveease_bulk_payments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading bulk payment history:', error);
      return [];
    }
  }

  // Check transaction status
  async checkTransactionStatus(transactionId) {
    try {
      // Get access token
      const tokenResult = await this.generateAccessToken();
      if (!tokenResult.success) {
        throw new Error(`Failed to get access token: ${tokenResult.error}`);
      }

      // For demo purposes, simulate status check
      const simulatedStatus = await this.simulateStatusCheck(transactionId);
      
      /* 
      // Actual M-Pesa API call (uncomment for production)
      const statusRequest = {
        Initiator: this.config.initiatorName,
        SecurityCredential: this.config.securityCredential,
        CommandID: 'TransactionStatusQuery',
        TransactionID: transactionId,
        PartyA: this.config.shortcode,
        IdentifierType: '4',
        ResultURL: this.config.resultURL,
        QueueTimeOutURL: this.config.queueTimeOutURL,
        Remarks: 'Transaction status query',
        Occasion: 'Status Check'
      };

      const response = await axios.post(`${this.baseURL}${this.endpoints.transactionStatus}`, statusRequest, {
        headers: {
          'Authorization': `Bearer ${tokenResult.token}`,
          'Content-Type': 'application/json'
        }
      });
      */

      return {
        success: true,
        data: simulatedStatus
      };

    } catch (error) {
      console.error('Transaction Status Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simulate transaction status check (remove in production)
  async simulateStatusCheck(transactionId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate random status
    const statuses = ['completed', 'pending', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      transactionId,
      status: randomStatus,
      mpesaReceiptNumber: randomStatus === 'completed' ? 'MPE' + Date.now() : null,
      completedAt: randomStatus === 'completed' ? new Date().toISOString() : null
    };
  }

  // Get payment history
  getPaymentHistory(options = {}) {
    try {
      let filteredPayments = [...this.paymentHistory];

      // Apply filters
      if (options.employeeId) {
        filteredPayments = filteredPayments.filter(p => p.employeeId === options.employeeId);
      }

      if (options.status) {
        filteredPayments = filteredPayments.filter(p => p.status === options.status);
      }

      if (options.dateFrom) {
        filteredPayments = filteredPayments.filter(p => 
          new Date(p.initiatedAt) >= new Date(options.dateFrom)
        );
      }

      if (options.dateTo) {
        filteredPayments = filteredPayments.filter(p => 
          new Date(p.initiatedAt) <= new Date(options.dateTo)
        );
      }

      // Apply sorting
      filteredPayments.sort((a, b) => new Date(b.initiatedAt) - new Date(a.initiatedAt));

      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedPayments,
        pagination: {
          page,
          limit,
          total: filteredPayments.length,
          totalPages: Math.ceil(filteredPayments.length / limit),
          hasNext: endIndex < filteredPayments.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment statistics
  getPaymentStats() {
    try {
      const stats = {
        totalPayments: this.paymentHistory.length,
        successfulPayments: this.paymentHistory.filter(p => p.status === 'completed').length,
        pendingPayments: this.paymentHistory.filter(p => p.status === 'pending').length,
        failedPayments: this.paymentHistory.filter(p => p.status === 'failed').length,
        totalAmount: this.paymentHistory.reduce((sum, p) => sum + p.amount, 0),
        successfulAmount: this.paymentHistory
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        averagePayment: 0,
        lastPaymentDate: null
      };

      stats.averagePayment = stats.totalPayments > 0 ? stats.totalAmount / stats.totalPayments : 0;
      
      if (this.paymentHistory.length > 0) {
        const sortedPayments = [...this.paymentHistory].sort((a, b) => 
          new Date(b.initiatedAt) - new Date(a.initiatedAt)
        );
        stats.lastPaymentDate = sortedPayments[0].initiatedAt;
      }

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Retry failed payment
  async retryPayment(paymentId) {
    try {
      const paymentIndex = this.paymentHistory.findIndex(p => p.id === paymentId);
      if (paymentIndex === -1) {
        throw new Error('Payment record not found');
      }

      const payment = this.paymentHistory[paymentIndex];
      if (payment.status !== 'failed') {
        throw new Error('Only failed payments can be retried');
      }

      // Update retry information
      payment.retryCount += 1;
      payment.lastRetryAt = new Date().toISOString();
      payment.status = 'pending';

      // Retry the payment
      const retryResult = await this.sendB2CPayment({
        employeeId: payment.employeeId,
        employeeName: payment.employeeName,
        employeeNumber: payment.employeeNumber,
        phoneNumber: payment.phoneNumber,
        amount: payment.amount,
        remarks: payment.remarks + ` (Retry ${payment.retryCount})`,
        occasion: payment.occasion
      });

      if (retryResult.success) {
        // Update original payment record
        this.paymentHistory[paymentIndex] = {
          ...payment,
          ...retryResult.data,
          retryCount: payment.retryCount,
          lastRetryAt: payment.lastRetryAt
        };
      } else {
        // Mark as failed again
        payment.status = 'failed';
        payment.failureReason = retryResult.error;
      }

      this.savePaymentHistory();

      return retryResult;

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export payment history
  exportPaymentHistory(format = 'json') {
    try {
      const data = this.paymentHistory.map(payment => ({
        transactionRef: payment.transactionRef,
        employeeName: payment.employeeName,
        employeeNumber: payment.employeeNumber,
        phoneNumber: payment.phoneNumber,
        amount: payment.amount,
        status: payment.status,
        initiatedAt: payment.initiatedAt,
        completedAt: payment.completedAt,
        mpesaReceiptNumber: payment.mpesaReceiptNumber,
        remarks: payment.remarks
      }));

      if (format === 'csv') {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        return {
          success: true,
          data: csvContent,
          filename: `mpesa_payments_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        success: true,
        data: JSON.stringify(data, null, 2),
        filename: `mpesa_payments_${new Date().toISOString().split('T')[0]}.json`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const mpesaService = new MpesaService();

export default mpesaService;
