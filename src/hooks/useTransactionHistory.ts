import { useCallback, useEffect, useState } from 'react';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`;

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  type: 'sent' | 'received';
}

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const transferEvent = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)'
);

export function useTransactionHistory() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const logs = await publicClient.getLogs({
        address: USDC_CONTRACT_ADDRESS,
        event: transferEvent,
        args: {
          from: address as `0x${string}`,
        },
        fromBlock: 0n,
        toBlock: 'latest',
      });

      const receivedLogs = await publicClient.getLogs({
        address: USDC_CONTRACT_ADDRESS,
        event: transferEvent,
        args: {
          to: address as `0x${string}`,
        },
        fromBlock: 0n,
        toBlock: 'latest',
      });

      const sentTxs = logs.map((log) => ({
        hash: log.transactionHash,
        from: log.args.from || '0x0',
        to: log.args.to || '0x0',
        amount: (Number(log.args.value) / 1e6).toFixed(6),
        timestamp: Date.now(),
        type: 'sent' as const,
      }));

      const receivedTxs = receivedLogs.map((log) => ({
        hash: log.transactionHash,
        from: log.args.from || '0x0',
        to: log.args.to || '0x0',
        amount: (Number(log.args.value) / 1e6).toFixed(6),
        timestamp: Date.now(),
        type: 'received' as const,
      }));

      const allTxs = [...sentTxs, ...receivedTxs].sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(allTxs);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    isLoading,
    loadTransactions,
  };
}
