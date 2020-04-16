class Backlog {
    readonly Stories :Array<Story>;
    readonly Stats :Array<MemberStats>;

    constructor(stories :Array<Story>, stats :Array<MemberStats>) {
        this.Stories = stories;
        this.Stats = stats;
    }
}

class MemberStats {

    AverageValue :number | null = 0;
    NumberOfStories :number  = 0;

}