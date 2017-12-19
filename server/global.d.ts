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
    championId: number;
    matchId: number;
    win: boolean;
}

interface PerkMap {
    [perkId: number]: PerkFrequency;
}

interface PerkFrequency {
    id: number;
    data: {
        [perkId: number]: {
            count: number;
            champions: { [championId: number]: number };
        }
    }
}

interface MatchRecord {
    id: number;
    data: any;
}

interface SeedData {
    matches: any[];
}
