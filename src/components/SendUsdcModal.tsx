import { useState } from 'react';
import { useSendUsdc } from '../hooks/useSendUsdc';
import { Sheet } from './ui/Sheet';

export function SendUsdcModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const { sendUsdc, isPending, isConfirmed, error, hash } = useSendUsdc();

  const handleSend = async () => {
    try {
      await sendUsdc(recipientAddress as `0x${string}`, amount);
      if (isConfirmed) {
        onClose();
        setRecipientAddress('');
        setAmount('');
      }
    } catch (err: any) {
      console.error('Send error:', err);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Send USDC" description="Transfer USDC to another address">
      <div className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium mb-2 text-black">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2 text-black">
            Amount (USDC)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={isPending || !recipientAddress || !amount}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : 'Send USDC'}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>
        )}

        {isConfirmed && !error && (
          <div className="mt-2">
            <p className="text-green-600 text-sm">Transaction confirmed! ✓</p>
            {hash && (
              <p className="text-xs text-gray-600 mt-1 break-all">
                Hash: {hash}
              </p>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}
