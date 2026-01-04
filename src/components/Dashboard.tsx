import { useUser, useSignOut } from "@openfort/react";
// import { useAccount } from "wagmi";
import { useWallets } from "@openfort/react";
import { useUI } from "@openfort/react";
import { RecoveryMethod } from "@openfort/react";
import { useReadContract, useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { useState } from "react";
import { SendUsdcModal } from "./SendUsdcModal";

export function Dashboard() {
  const { openWallets } = useUI();
  const { user } = useUser();
  const { signOut, isLoading } = useSignOut();
  const { chain } = useAccount();
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const {
    activeWallet,
    wallets,
    isCreating,
    createWallet,
    error: walletError,
  } = useWallets();

  const usdcContractAddress =
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`;

  const erc20Abi = [
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
  ] as const;

  const { data: usdcBalance, isLoading: isBalanceLoading } = useReadContract({
    address: usdcContractAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: activeWallet?.address
      ? [activeWallet.address as `0x${string}`]
      : undefined,
    chainId: baseSepolia.id,
    query: {
      enabled: !!activeWallet?.address,
    },
  });

  const { data: ethBalance } = useBalance({
    address: activeWallet?.address as `0x${string}`,
    chainId: baseSepolia.id,
    query: {
      enabled: !!activeWallet?.address,
    },
  });

  console.log(baseSepolia);

  const formattedBalance = usdcBalance
    ? Number(formatUnits(usdcBalance, 6)).toFixed(2)
    : "0.00";

  const formattedEthBalance = ethBalance
    ? Number(formatUnits(ethBalance?.value, 18)).toFixed(4)
    : "0.0000";

  console.log("Dashboard Debug:", {
    user,
    activeWallet,
    activeWalletAddress: activeWallet?.address,
    wallets,
    isCreating,
    walletError,
    walletCount: wallets?.length,
    chainId: chain?.id,
    chainName: chain?.name,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("signOut() completed");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold  text-black">
                OpenPay Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back!</p>
            </div>
            <div className="flex items-center gap-4">
              {activeWallet ? (
                <button
                  type="button"
                  onClick={openWallets}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Wallet: {activeWallet.address.slice(0, 6)}…
                  {activeWallet.address.slice(-4)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    createWallet({
                      recovery: { recoveryMethod: RecoveryMethod.PASSKEY },
                    })
                  }
                  disabled={isCreating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isCreating ? "Creating..." : "Create Wallet (Passkey)"}
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {user && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-black">
                User Information
              </h2>
              <div className="mb-2 text-sm">
                <span className="text-gray-600">Network: </span>
                <span className="font-bold text-blue-600 text-lg">
                  Base Sepolia
                </span>
              </div>

              <div className="space-y-2">
                <p>
                  {/* <span className="font-medium">Email:</span> {user.email} */}
                </p>
                <p>
                  <span className="font-medium text-black">
                    User ID: {user.id}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-black">
                    Wallets count: {wallets?.length || 0}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-black">
                    Wallet Address:{" "}
                    {activeWallet?.address || "No wallet created yet"}
                  </span>
                </p>
                {walletError && (
                  <p className="text-red-500">
                    Wallet Error: {walletError.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">USDC Balance</h2>
            <div className="text-4xl font-bold text-green-600">
              {isBalanceLoading ? "Loading..." : `${formattedBalance} USDC`}
            </div>
            <p className="text-gray-600 mt-2">
              Testnet balance on Base Sepolia
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">ETH Balance (Gas)</h2>
            <div className="text-4xl font-bold text-blue-600">
              {isBalanceLoading ? "Loading..." : `${formattedEthBalance} ETH`}
            </div>
            <p className="text-gray-600 mt-2">
              Native gas token on Base Sepolia
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSendModalOpen(true)}
                className="bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Send USDC
              </button>
              <button
                type="button"
                className="bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Receive USDC
              </button>
              <button
                type="button"
                className="bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                Transaction History
              </button>
              <button
                type="button"
                className="bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition"
              >
                Settings
              </button>
            </div>
          </div>

          <SendUsdcModal
            open={sendModalOpen}
            onClose={() => setSendModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
