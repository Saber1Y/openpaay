import { useCallback } from 'react';
import { parseUnits } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`;

const erc20Abi = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export function useSendUsdc() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const sendUsdc = useCallback(
    async (to: `0x${string}`, amount: string) => {
      if (!address) throw new Error('Wallet not connected');

      const amountInUnits = parseUnits(amount, 6);

      writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [to, amountInUnits],
      });
    },
    [address, writeContract],
  );

  return {
    sendUsdc,
    hash,
    isPending: isPending || isConfirming,
    isConfirmed,
    error,
  };
}
