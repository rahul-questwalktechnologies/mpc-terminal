import React, { useState, useEffect } from 'react';
import { mpcashService, MpcashNetworkData } from '../../services/mpcashService';
import { Activity, Server, Wallet } from 'lucide-react'; // Fincept uses Lucide icons

const MpcashTab: React.FC = () => {
    const [data, setData] = useState<MpcashNetworkData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Bloomberg Design Constants
    const COLORS = {
        ORANGE: '#FFA500',
        WHITE: '#FFFFFF',
        GREEN: '#00C800',
        RED: '#FF0000',
        GRAY: '#787878',
        DARK_BG: '#1a1a1a',
        PANEL_BG: '#000000'
    };

    // Fetch Data Loop
    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true);
            const result = await mpcashService.getTreasuryDetails();
            setData(result);
            setLastUpdate(new Date());
            setLoading(false);
        };

        fetchData();
        // Auto-refresh every 5 seconds (Real-time feel)
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style= {{
        height: '100%',
            backgroundColor: COLORS.DARK_BG,
                color: COLORS.WHITE,
                    fontFamily: 'Consolas, monospace',
                        display: 'flex',
                            flexDirection: 'column'
    }
}>
    {/* 1. Terminal Header */ }
    < div style = {{
    padding: '8px 12px',
        backgroundColor: COLORS.PANEL_BG,
            borderBottom: `1px solid ${COLORS.GRAY}`,
                fontSize: '13px',
                    display: 'flex',
                        justifyContent: 'space-between'
}}>
    <div>
    <span style={ { color: COLORS.ORANGE, fontWeight: 'bold' } }> MPCASH LEDGER </span>
        < span style = {{ marginLeft: '16px', color: COLORS.GRAY }}> LOCAL NODE // 0.0.2</span>
            </div>
            < div style = {{ color: COLORS.GRAY }}>
                UPDATED: { lastUpdate.toLocaleTimeString() }
</div>
    </div>

{/* 2. Main Grid Content */ }
<div style={ { padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } }>

    {/* Panel A: Treasury Status */ }
    < div style = {{
    backgroundColor: COLORS.PANEL_BG,
        border: `1px solid ${COLORS.GRAY}`,
            padding: '16px'
}}>
    <div style={ { color: COLORS.ORANGE, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }>
        <Wallet size={ 16 } /> TREASURY RESERVE
            </div>

            < div style = {{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                { loading? "LOADING...": data?.treasuryBalance }
                </div>

                < div style = {{ fontSize: '11px', color: COLORS.GRAY }}>
                    ACCOUNT ID: 0.0.2
                        </div>
                        </div>

{/* Panel B: Network Health */ }
<div style={
    {
        backgroundColor: COLORS.PANEL_BG,
            border: `1px solid ${COLORS.GRAY}`,
                padding: '16px'
    }
}>
    <div style={ { color: COLORS.ORANGE, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }>
        <Server size={ 16 } /> NETWORK STATUS
            </div>

            < div style = {{
    fontSize: '18px',
        color: data?.isConnected ? COLORS.GREEN : COLORS.RED,
            marginBottom: '8px'
}}>
    { data?.isConnected? "● SYSTEM ONLINE": "● DISCONNECTED" }
    </div>

    < div style = {{ fontSize: '11px', color: COLORS.GRAY }}>
        NODE ADDR: { data?.networkAddress }
</div>
    </div>

    </div>
    </div>
  );
};

export default MpcashTab;