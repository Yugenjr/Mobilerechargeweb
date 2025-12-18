import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Download, Calendar, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const History = () => {
  const [filter, setFilter] = useState('all');

  const transactions = [
    {
      id: 'TXN1234567890',
      date: '2025-12-15',
      amount: 299,
      type: 'Recharge',
      status: 'success',
      mobile: '9876543210',
      operator: 'Jio'
    },
    {
      id: 'TXN1234567891',
      date: '2025-12-10',
      amount: 599,
      type: 'Recharge',
      status: 'success',
      mobile: '9876543210',
      operator: 'Jio'
    },
    {
      id: 'TXN1234567892',
      date: '2025-12-05',
      amount: 239,
      type: 'Recharge',
      status: 'failed',
      mobile: '9876543210',
      operator: 'Jio'
    },
    {
      id: 'TXN1234567893',
      date: '2025-11-28',
      amount: 479,
      type: 'Recharge',
      status: 'success',
      mobile: '9876543210',
      operator: 'Jio'
    },
    {
      id: 'TXN1234567894',
      date: '2025-11-15',
      amount: 299,
      type: 'Bill Payment',
      status: 'success',
      mobile: '9876543210',
      operator: 'Electricity'
    },
  ];

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const getStatusIcon = (status) => {
    return status === 'success' 
      ? <CheckCircle className="w-5 h-5 text-green-500" />
      : <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBadge = (status) => {
    return status === 'success'
      ? 'bg-green-500/20 text-green-500'
      : 'bg-red-500/20 text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold gradient-text">Payment History</h1>
        <div className="flex gap-2">
          {['all', 'success', 'failed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-neon text-white shadow-neon-blue'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card hover>
          <p className="text-gray-400 mb-2">Total Spent</p>
          <p className="text-3xl font-bold gradient-text">₹1,915</p>
          <p className="text-sm text-green-500 mt-1">This month</p>
        </Card>
        <Card hover>
          <p className="text-gray-400 mb-2">Successful</p>
          <p className="text-3xl font-bold text-green-500">4</p>
          <p className="text-sm text-gray-400 mt-1">Transactions</p>
        </Card>
        <Card hover>
          <p className="text-gray-400 mb-2">Failed</p>
          <p className="text-3xl font-bold text-red-500">1</p>
          <p className="text-sm text-gray-400 mt-1">Transactions</p>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <h3 className="font-bold text-white mb-1">{transaction.type}</h3>
                    <p className="text-sm text-gray-400">
                      {transaction.operator} • +91 {transaction.mobile}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col gap-2">
                  <p className="text-2xl font-bold text-white">₹{transaction.amount}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" icon={Download}>
                    Invoice
                  </Button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500">Transaction ID: {transaction.id}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No transactions found</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default History;
