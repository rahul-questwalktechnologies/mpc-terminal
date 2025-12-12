import { Client, AccountBalanceQuery, AccountId, AccountBalance } from "@hashgraph/sdk";

// Define the data structure for our UI
export interface MpcashNetworkData {
    treasuryBalance: string;
    isConnected: boolean;
    networkAddress: string;
}

class MpcashService {
    private client: Client | null = null;

    constructor() {
        // Initialize the client for Local Node immediately
        try {
            this.client = Client.forLocalNode();
            // Set a patient timeout for Docker on Windows
            this.client.setRequestTimeout(15000);
        } catch (error) {
            console.error("Failed to init MPCASH client:", error);
        }
    }

    async getTreasuryDetails(): Promise<MpcashNetworkData> {
        if (!this.client) {
            return {
                treasuryBalance: "Client Error",
                isConnected: false,
                networkAddress: "127.0.0.1"
            };
        }

        try {
            // Query Account 0.0.2 (Treasury)
            const query = new AccountBalanceQuery().setAccountId("0.0.2");
            const balance: AccountBalance = await query.execute(this.client);

            return {
                treasuryBalance: balance.hbars.toString(),
                isConnected: true,
                networkAddress: "127.0.0.1:50211"
            };
        } catch (error) {
            console.error("MPCASH Fetch Error:", error);
            return {
                treasuryBalance: "Unreachable",
                isConnected: false,
                networkAddress: "127.0.0.1:50211"
            };
        }
    }
}

export const mpcashService = new MpcashService();