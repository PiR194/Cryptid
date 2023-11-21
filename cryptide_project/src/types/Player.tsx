export interface PlayerSoloStats {
    nbGames: number;
    bestScore: number;
    avgNbTry: number;
};

export interface PlayerOnlineStats {
    nbGames: number;
    nbWins: number;
    ratio: number;
};

export interface PlayerProps {
    profilePicture: string;
    pseudo: string;
    soloStats: PlayerSoloStats;
    onlineStats: PlayerOnlineStats;
};