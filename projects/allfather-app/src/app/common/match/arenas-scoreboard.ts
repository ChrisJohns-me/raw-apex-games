const MAX_ROUNDS = 9;
const MIN_ROUNDS_TO_WIN = 3;
const WIN_VARIANCE = 2;

export class ArenasScoreboard {
    /** Boolean list of if a round was won or not */
    public roundsResult: boolean[] = [];
    public get isUnfinished(): boolean {
        return !this.hasLost && !this.hasWon;
    }
    /** Round when about to lose; including sudden death */
    public get isLoseAtRisk(): boolean {
        const isAtRisk = this.numRoundsLost >= MIN_ROUNDS_TO_WIN - 1 && this.numRoundsWinVariance <= -WIN_VARIANCE + 1;
        return this.isUnfinished && (this.isSuddenDeath || isAtRisk);
    }
    /** Round when about to win; including sudden death */
    public get isWinAtRisk(): boolean {
        const isAtRisk = this.numRoundsWon >= MIN_ROUNDS_TO_WIN - 1 && this.numRoundsWinVariance >= WIN_VARIANCE - 1;
        return this.isUnfinished && (this.isSuddenDeath || isAtRisk);
    }
    /** Is Sudden Death round */
    public get isSuddenDeath(): boolean {
        return this.isUnfinished && this.numRoundsPlayed === MAX_ROUNDS - 1;
    }
    /** Match has resulted in a loss */
    public get hasLost(): boolean {
        return this.numRoundsLost >= MIN_ROUNDS_TO_WIN && this.numRoundsWinVariance <= -WIN_VARIANCE;
    }
    /** Match has resulted in a win */
    public get hasWon(): boolean {
        return this.numRoundsWon >= MIN_ROUNDS_TO_WIN && this.numRoundsWinVariance >= WIN_VARIANCE;
    }
    public get numRoundsPlayed(): number {
        return this.roundsResult.length;
    }
    public get numRoundsWon(): number {
        return this.roundsResult.filter((result) => result).length;
    }
    public get numRoundsLost(): number {
        return this.roundsResult.filter((result) => !result).length;
    }
    /** 1 = Winning or Tied, 2 = Losing */
    public get placement(): number {
        return this.numRoundsWon >= this.numRoundsLost ? 1 : 2;
    }

    /**
     * @returns Rounds won/ahead: Positive number
     * @returns Rounds lost/behind: Negative number
     */
    public get numRoundsWinVariance(): number {
        return this.numRoundsWon - this.numRoundsLost;
    }

    constructor(ctor?: { roundsResult?: boolean[] }) {
        this.roundsResult = ctor?.roundsResult ?? [];
    }

    public addRoundResult(win: boolean): void {
        if (this.hasLost || this.hasWon) {
            throw Error(`[Arenas Scoreboard] Request to add a round result when match has a win/lose condition`);
        } else if (this.numRoundsPlayed >= MAX_ROUNDS) {
            throw Error(`[Arenas Scoreboard] Request to add a round result when match has maximum number of rounds`);
        } else if (typeof win !== "boolean") {
            throw Error(`[Arenas Scoreboard] Result was non-boolean: "${win}"`);
        }

        this.roundsResult.push(!!win);
    }
}
