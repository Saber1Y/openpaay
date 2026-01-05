import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { Modal } from './ui/Modal';
import { formatUnits } from 'viem';

export function TransactionHistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { transactions, isLoading, loadTransactions } = useTransactionHistory();

  return (
    <Modal open={open} onClose={onClose} title="Transaction History">
      <p className="text-gray-600 mb-4">Your USDC transfer history</p>
      <div className="space-y-4">
        <button
          type="button"
          onClick={loadTransactions}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          ) : (
            transactions.map((tx, index) => (
              <div
                key={`${tx.hash}-${index}`}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      tx.type === 'sent' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {tx.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{tx.amount} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-mono text-xs">{tx.from.slice(0, 8)}…{tx.from.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-mono text-xs">{tx.to.slice(0, 8)}…{tx.to.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hash:</span>
                    <a
                      href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-blue-600 hover:underline break-all"
                    >
                      {tx.hash.slice(0, 10)}…{tx.hash.slice(-8)}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
