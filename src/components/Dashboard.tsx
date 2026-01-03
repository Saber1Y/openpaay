import { useUser, useSignOut } from "@openfort/react";
import { useAccount } from "wagmi";
import { useWallets } from "@openfort/react";
import { useUI } from "@openfort/react";

export function Dashboard() {
  const { openProviders, openWallets } = useUI();
  const { user } = useUser();
  const { signOut, isLoading } = useSignOut();
  const { address } = useAccount();

  const { activeWallet, wallets } = useWallets();

  const handleLogout = async () => {
    console.log("Logging out...");
    console.log("User before logout:", user);

    try {
      await signOut();
      console.log("signOut() completed");

      localStorage.clear();
      sessionStorage.clear();

      console.log("Cleared storage, redirecting...");
      window.location.href = "/";
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
              {address && (
                <button
                  onClick={openWallets}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Wallet: {address.slice(0, 6)}…{address.slice(-4)}
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
              <div className="space-y-2">
                <p>
                  {/* <span className="font-medium">Email:</span> {user.email} */}
                </p>
                <p>
                  <span className="font-medium text-black">
                    User ID: {user.id}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">USDC Balance</h2>
            <div className="text-4xl font-bold text-green-600">0.00 USDC</div>
            <p className="text-gray-600 mt-2">Testnet balance</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
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
        </div>
      </div>
    </div>
  );
}
