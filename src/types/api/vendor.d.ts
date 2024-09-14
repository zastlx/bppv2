export interface vendors {
    vendors: { [key: string]: any }
    _vendors: { [key: string]: any }
    normalized: {
        React: typeof React,
        ReactDOM: typeof ReactDOM,
        SocketIOClient: typeof SocketIOClient
    }
    map: {
        React: string,
        ReactDOM: string,
        SocketIOClient: string
    }
};

export interface VendorManager {
    vendors: vendors;
    styles: {
        dashboard: DashboardStyles,
        leaderboard: LeaderboardStyles,
    }
};