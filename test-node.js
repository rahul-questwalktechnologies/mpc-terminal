import { Client, AccountBalanceQuery } from "@hashgraph/sdk";

async function main() {
    console.log("-----------------------------------------");
    console.log("🚀 STARTING FINAL CONNECTION TEST");
    console.log("-----------------------------------------");

    // TEST 1: Check if the HTTP API (Mirror Node) is alive
    try {
        console.log("1️⃣  Checking Mirror Node API (HTTP)...");
        const response = await fetch("http://127.0.0.1:5551/api/v1/accounts/0.0.2");
        if (response.ok) {
            console.log("✅ Mirror Node is ALIVE! (HTTP 200 OK)");
        } else {
            console.log("⚠️ Mirror Node responded but with error: " + response.status);
        }
    } catch (err) {
        console.log("❌ Mirror Node unreachable (Is it starting up?): " + err.message);
    }

    // TEST 2: Check the Consensus Node (gRPC) using the SDK
    try {
        console.log("\n2️⃣  Checking Consensus Node (SDK)...");

        // Use the built-in helper for local Docker nodes
        const client = Client.forLocalNode();

        // *** CRITICAL: Set a 30-second timeout ***
        // Docker on Windows is slower than Linux, we must be patient.
        client.setRequestTimeout(30000);

        const query = new AccountBalanceQuery().setAccountId("0.0.2");
        const balance = await query.execute(client);

        console.log("✅ SUCCESS! Connected via SDK.");
        console.log(`💰 Treasury Balance: ${balance.hbars.toString()}`);
    } catch (error) {
        console.error("❌ SDK Connection Failed:", error.message);
    }

    console.log("-----------------------------------------");
    process.exit();
}

main();