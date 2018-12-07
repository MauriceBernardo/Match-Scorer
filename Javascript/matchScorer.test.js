import * as matchScorer from './matchScorer'


describe("score function", () => {
    const points = [1,0,1,0,1,1,1,1,1,0,0,0,0];
    const player0 = 0;
    const player1 = 1;

    it("should return right value", () => {
        expect(matchScorer.comp101_score(points,player0)).toEqual([6,7]);
    });

    it("should return right score depending on the player", () => {
        expect(matchScorer.comp101_score(points,player0)).toEqual([6,7]);
        expect(matchScorer.comp101_score(points,player1)).toEqual([7,6]);
    });
});

describe("tiebreaker", () => {
    let points = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
    let player0 = 0;
    let player1 = 1;
    let excessivePoints = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1];

    it("should return right score", () => {
        expect(matchScorer.comp101_tiebreaker(points,player0))
            .toEqual(["8-9",null,[]]);
    });

    it("should return right value based on the player", () => {
        expect(matchScorer.comp101_tiebreaker(points,player0))
            .toEqual(["8-9",null,[]]);
        expect(matchScorer.comp101_tiebreaker(points,player1))
            .toEqual(["9-8",null,[]]);
    });

    it("should return the right remainder after tiebreaker", () => {
        expect(matchScorer.comp101_tiebreaker(excessivePoints,player0))
            .toEqual(["9-7",0,[1]]);
    });
});

describe("Game", () => {
    let points = [1,0,1,0,1,0,1,0,1,1];
    let player0 = 0;
    let player1 = 1;
    let excessivePoints = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1];

    it("should return right score", () => {
        expect(matchScorer.comp101_game(points,player0))
            .toEqual(["40-W",1,[]]);
    });

    it("should return right score based on the player", () => {
        expect(matchScorer.comp101_game(points,player0))
            .toEqual(["40-W",1,[]]);
        expect(matchScorer.comp101_game(points,player1))
            .toEqual(["W-40",1,[]]);
    });

    it("should return right remainder from excessive score after winning",() =>{
        expect(matchScorer.comp101_game(excessivePoints,player0))
            .toEqual(["W-40",0,[1]])
    });
})

describe("Set", () => {
    let points = [1,0,1,0,1,0,1,0,1,1];
    let player0 = 0;
    let player1 = 1;
    let tiebreakerPoint = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0]
    let mockGame = jest.fn()
        .mockImplementation(matchScorer.comp101_game);
    let mockTiebreaker = jest.fn()
        .mockImplementation(matchScorer.comp101_tiebreaker);

    it("should have the right behaviour and value", () => {
        expect(matchScorer.comp101_set(points,player0,mockTiebreaker,mockGame))
            .toEqual(["0-1",null,[]]);
        expect(mockTiebreaker.mock.calls.length).toBe(0);
        expect(mockGame.mock.calls.length).toBeGreaterThan(0);
    })

    it("should resolve tiebreaker", () => {        
        expect(matchScorer.comp101_set(tiebreakerPoint,player0))
            .toEqual(["6-5",0,[0,0,0]]);
    })
})
