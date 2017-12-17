interface PgOptions {
    username: string;
    password: string;
}

interface PerkSet {
    perk0Id: number;
    perk1Id: number;
    perk2Id: number;
    perk3Id: number;
    perk4Id: number;
    perk5Id: number;
    matchId: number;
    win: boolean;
}

interface MatchRecord {
    id: number;
    data: any;
}

interface SeedData {
    matches: any[];
}
